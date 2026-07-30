/**
 * IntaSend M-Pesa payment integration — frontend-ready stub.
 *
 * LocoGlovo has no backend yet, so this module simulates the STK push +
 * polling flow that a real integration would follow. When the backend is
 * ready, swap the body of `requestStkPush` and `pollPaymentStatus` for real
 * calls, e.g.:
 *
 *   POST /api/payments/stk-push   { phone, amount, orderRef }
 *   GET  /api/payments/status/:orderRef
 *
 * IntaSend docs: https://developers.intasend.com/docs/mpesa-stk-push
 *
 * Never put a live IntaSend secret key in frontend code — STK push must be
 * initiated from a server using the secret key. The publishable key is the
 * only key ever safe to use from the browser.
 */

const SIMULATED_NETWORK_DELAY_MS = 2200;
const SIMULATED_SUCCESS_RATE = 0.92;

export function isValidKenyanPhone(phone) {
  const cleaned = phone.replace(/\s+/g, "");
  return /^(?:\+254|0)(7|1)\d{8}$/.test(cleaned);
}

export function normalizePhone(phone) {
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.startsWith("0")) return `+254${cleaned.slice(1)}`;
  if (cleaned.startsWith("254")) return `+${cleaned}`;
  return cleaned;
}

/**
 * Simulates sending an STK push prompt to the customer's phone and waiting
 * for them to enter their M-Pesa PIN. Resolves with a mock transaction
 * result. Replace with a real fetch() to your backend once it exists.
 */
export function requestStkPush({ phone, amount, orderRef }) {
  return new Promise((resolve, reject) => {
    if (!isValidKenyanPhone(phone)) {
      reject(new Error("Enter a valid Safaricom / Airtel number, e.g. 07XXXXXXXX"));
      return;
    }
    setTimeout(() => {
      const success = Math.random() < SIMULATED_SUCCESS_RATE;
      if (success) {
        resolve({
          status: "COMPLETE",
          orderRef,
          amount,
          phone: normalizePhone(phone),
          mpesaReceipt: `SIM${Math.floor(Math.random() * 900000 + 100000)}`,
          timestamp: new Date().toISOString(),
        });
      } else {
        reject(new Error("Payment was not completed. Please try again."));
      }
    }, SIMULATED_NETWORK_DELAY_MS);
  });
}

/**
 * Shape of the payload the frontend will POST to the backend once an order
 * is paid for. Kept here so the checkout flow and any future API client
 * agree on the same contract.
 */
export function buildBackendPayload(orderPayload) {
  return {
    ...orderPayload,
    paymentStatus: "Paid",
  };
}
