const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.text({ type: "text/*" })); // M-Pesa sometimes sends text/plain callbacks

const PORT = process.env.PORT || 3001;

/* ─── Supabase client (for logging transactions) ─── */
const supabaseUrl = "https://rwevslisctwexarloeqk.supabase.co";
const supabaseAnonKey = "sb_publishable_Bs9p3KO7MUOescWQ2vZpAA_c6I9qM_I";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ─── In-memory callback store (sandbox fix) ─── */
const callbackStore = new Map();

/* ─── Daraja helpers ─── */

let accessToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt) return accessToken;
  const auth = Buffer.from(`${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`).toString("base64");
  try {
    const { data } = await axios.get(`${process.env.DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    console.log("OAuth token response:", JSON.stringify(data));
    accessToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
    return accessToken;
  } catch (err) {
    console.error("OAuth token error:", err.response?.data || err.message);
    throw new Error("Failed to get access token");
  }
}

function formatPhone(phone) {
  let cleaned = phone.replace(/\s+/g, "");
  if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);
  if (cleaned.startsWith("0")) cleaned = `254${cleaned.slice(1)}`;
  if (!cleaned.startsWith("254")) cleaned = `254${cleaned}`;
  return cleaned;
}

/* ─── STK Push ─── */

app.post("/api/mpesa/stk-push", async (req, res) => {
  try {
    const { phone, amount, orderRef } = req.body;
    if (!phone || !amount) {
      return res.status(400).json({ error: "Phone and amount are required." });
    }

    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(`${process.env.DARAJA_SHORTCODE}${process.env.DARAJA_PASSKEY}${timestamp}`).toString("base64");

    const payload = {
      BusinessShortCode: process.env.DARAJA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: formatPhone(phone),
      PartyB: process.env.DARAJA_SHORTCODE,
      PhoneNumber: formatPhone(phone),
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: orderRef || `LG-${Date.now().toString().slice(-5)}`,
      TransactionDesc: "LocoGlovo Order Payment",
    };

    const { data } = await axios.post(
      `${process.env.DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Log the STK Push initiation
    try {
      await supabase.from("mpesa_transactions").insert({
        checkout_request_id: data.CheckoutRequestID,
        merchant_request_id: data.MerchantRequestID,
        phone: formatPhone(phone),
        amount: Math.round(amount),
        order_ref: payload.AccountReference,
        status: data.ResponseCode === "0" ? "initiated" : "failed",
        result_code: parseInt(data.ResponseCode),
        result_desc: data.ResponseDescription,
      });
    } catch (dbErr) {
      console.error("Failed to log transaction initiation:", dbErr.message);
    }

    res.json(data);
  } catch (err) {
    console.error("STK Push error:", err.response?.data || err.message);
    res.status(500).json({ error: "M-Pesa request failed.", details: err.response?.data || err.message });
  }
});

/* ─── Query STK status ─── */

app.post("/api/mpesa/status", async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;
    if (!checkoutRequestId) return res.status(400).json({ error: "checkoutRequestId required." });

    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(`${process.env.DARAJA_SHORTCODE}${process.env.DARAJA_PASSKEY}${timestamp}`).toString("base64");

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      {
        BusinessShortCode: process.env.DARAJA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Status query failed." });
  }
});

/* ─── Callback receiver (M-Pesa posts here) ─── */

app.post("/api/mpesa/callback", async (req, res) => {
  // Handle both JSON and text/plain callbacks
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { /* ignore */ }
  }
  console.log("M-Pesa Callback received:", JSON.stringify(body, null, 2));
  const stkCallback = body?.Body?.stkCallback;
  if (stkCallback) {
    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;
    callbackStore.set(CheckoutRequestID, { ResultCode, ResultDesc, receivedAt: Date.now() });
    const meta = CallbackMetadata?.Item || [];
    const getItem = (name) => {
      const item = meta.find((i) => i.Name === name);
      return item ? item.Value : null;
    };

    const transactionData = {
      result_code: ResultCode,
      result_desc: ResultDesc,
      mpesa_receipt_number: getItem("MpesaReceiptNumber"),
      transaction_date: getItem("TransactionDate"),
      callback_data: body,
      updated_at: new Date().toISOString(),
    };

    if (ResultCode === 0) {
      transactionData.status = "completed";
    } else {
      transactionData.status = "failed";
    }

    try {
      const { error } = await supabase
        .from("mpesa_transactions")
        .update(transactionData)
        .eq("checkout_request_id", CheckoutRequestID);

      if (error) {
        // If update failed (no matching row), insert a new one
        await supabase.from("mpesa_transactions").insert({
          checkout_request_id: CheckoutRequestID,
          ...transactionData,
        });
      }
    } catch (dbErr) {
      console.error("Failed to log callback:", dbErr.message);
    }
  }
  res.json({ ResultCode: 0, ResultDesc: "Success" });
});

/* ─── Check if callback was received (for sandbox) ─── */

app.get("/api/mpesa/callback-result/:checkoutRequestId", (req, res) => {
  const result = callbackStore.get(req.params.checkoutRequestId) || null;
  res.json({ found: !!result, data: result });
});

/* ─── Health check ─── */

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.DARAJA_CONSUMER_KEY ? "daraja-live" : "simulated" });
});

app.listen(PORT, () => {
  console.log(`M-Pesa server running on http://localhost:${PORT}`);
  if (!process.env.DARAJA_CONSUMER_KEY) {
    console.log("⚠️  No Daraja credentials found. Set DARAJA_CONSUMER_KEY and DARAJA_CONSUMER_SECRET in .env");
  }
});
