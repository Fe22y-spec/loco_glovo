import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Building, DoorOpen, Clock, MessageSquare, ShoppingCart, ClipboardList, Edit3, Trash2, Check, Loader } from "lucide-react";
import SectionHeading from "../common/SectionHeading.jsx";
import RippleButton from "../common/RippleButton.jsx";
import { useAdmin } from "../../context/AdminContext.jsx";

const hostels = ["Qwetu", "Qejani"];

const API_BASE = "http://localhost:3001";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function pollMpesaStatus(checkoutRequestId, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(2000);
    try {
      // Check callback store first (works in sandbox)
      const cbRes = await fetch(`${API_BASE}/api/mpesa/callback-result/${checkoutRequestId}`);
      const cbData = await cbRes.json();
      if (cbData.found) {
        return { ResultCode: cbData.data.ResultCode, ResultDesc: cbData.data.ResultDesc };
      }
      // Fallback to Daraja status query
      const res = await fetch(`${API_BASE}/api/mpesa/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutRequestId }),
      });
      const data = await res.json();
      if (data.ResultCode === "0" || data.ResultCode === 0) return data;
      if (data.ResultCode !== "1032") return data; // 1032 = pending
    } catch {}
  }
  throw new Error("Payment confirmation timed out. Please check your M-Pesa messages for the transaction status.");
}

export default function ManualOrderSection({ orderItems, setOrderItems, catalogueItems, setCatalogueItems, onRemoveCatalogueItem }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    residence: "",
    block: "",
    room: "",
    deliveryTime: "",
    deliveryInstructions: "",
    specialInstructions: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const { createOrder, settings, matchCatalogueItems } = useAdmin();
  const formRef = useRef(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const deliveryFee = settings.deliveryFee || 50;

  const subtotal = useMemo(() => {
    return catalogueItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [catalogueItems]);

  const grandTotal = subtotal + deliveryFee;

  const hasCatalogueItems = catalogueItems.length > 0;
  const hasCustomText = orderItems.trim().length > 0;

  const orderType = hasCustomText ? "Custom" : hasCatalogueItems ? "Standard" : null;

  const resetForm = () => {
    setForm({
      fullName: "",
      phone: "",
      residence: "",
      block: "",
      room: "",
      deliveryTime: "",
      deliveryInstructions: "",
      specialInstructions: "",
    });
    setOrderItems("");
    setCatalogueItems([]);
    setSubmitted(false);
    setSubmission(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.residence || !form.room.trim()) return;
    if (!hasCatalogueItems && !hasCustomText) return;
    setError("");

    const payload = {
      customer: {
        name: form.fullName.trim(),
        phone: form.phone.trim(),
      },
      delivery: {
        residence: form.residence,
        block: form.block.trim(),
        room: form.room.trim(),
        time: form.deliveryTime.trim(),
        instructions: form.deliveryInstructions.trim(),
      },
      order: {
        items: orderItems.trim(),
        specialInstructions: form.specialInstructions.trim(),
      },
      catalogueItems: catalogueItems.map((c) => ({ ...c })),
      customItems: orderItems.trim(),
      subtotal,
      deliveryFee,
      grandTotal,
      orderType,
    };

    if (orderType === "Standard") {
      setProcessing(true);
      try {
        const stkRes = await fetch(`${API_BASE}/api/mpesa/stk-push`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: form.phone, amount: grandTotal, orderRef: `LG-${Date.now().toString().slice(-5)}` }),
        });
        const stkData = await stkRes.json();
        if (stkData.ResponseCode !== "0") {
          throw new Error(stkData.ResponseDescription || "M-Pesa request failed.");
        }
        const result = await pollMpesaStatus(stkData.CheckoutRequestID);
        if (result.ResultCode !== "0" && result.ResultCode !== 0) {
          throw new Error(result.ResultDesc || "Payment was not completed.");
        }
        createOrder({ ...payload, paymentStatus: "Verified" });
        setSubmission({ type: "standard", name: form.fullName.trim() });
        setSubmitted(true);
      } catch (err) {
        setError(err.message);
      }
      setProcessing(false);
    } else {
      createOrder({ ...payload, orderType: "Custom" });
      setSubmission({ type: "custom", name: form.fullName.trim() });
      setSubmitted(true);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (submitted) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto text-center"
        >
          <div className={`mx-auto h-16 w-16 rounded-full bg-gradient-to-br grid place-items-center shadow-lg mb-4 ${
            submission?.type === "standard" ? "from-green-400 to-green-600" : "from-amber-400 to-amber-600"
          }`}>
            <Check size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-ink dark:text-white">
            {submission?.type === "standard" ? "Payment Successful!" : "Order Submitted!"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {submission?.type === "standard"
              ? `Thank you, ${submission?.name}. Your order is confirmed and will be delivered soon.`
              : `Thank you, ${submission?.name}. We'll review your custom items and send an invoice.`}
          </p>
          <RippleButton onClick={resetForm} className="mt-6 justify-center">
            Place Another Order
          </RippleButton>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="place-order" className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <SectionHeading
        eyebrow="Order Now"
        title="Place Your Order"
        subtitle="Select items from the menu below or type anything you need."
        align="center"
      />

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-10 space-y-8">
        {/* Student Information */}
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="glass rounded-xl2 shadow-card p-6 sm:p-8"
        >
          <h3 className="font-display font-bold text-lg text-ink dark:text-white mb-5 flex items-center gap-2">
            <User size={18} className="text-vibrantOrange" />
            Your Details
          </h3>

          <div className="space-y-4">
            <InputField icon={User} placeholder="Full Name *" value={form.fullName} onChange={update("fullName")} required />
            <InputField icon={Phone} type="tel" placeholder="Phone Number *" value={form.phone} onChange={update("phone")} required />

            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block">Residence *</label>
              <div className="flex gap-2">
                {hostels.map((h) => (
                  <button key={h} type="button" onClick={() => setForm((f) => ({ ...f, residence: h }))}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                      form.residence === h
                        ? "bg-brand-gradient text-white border-transparent"
                        : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-white/5"
                    }`}
                  >{h}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField icon={Building} placeholder="Floor Number (e.g. Floor 3)" value={form.block} onChange={update("block")} />
              <InputField icon={DoorOpen} placeholder="Room Number * (e.g. A-304)" value={form.room} onChange={update("room")} required />
            </div>

            <InputField icon={Clock} placeholder="Preferred Delivery Time (optional)" value={form.deliveryTime} onChange={update("deliveryTime")} />

            <div>
              <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 focus-within:ring-2 focus-within:ring-vibrantOrange transition-shadow">
                <MessageSquare size={18} className="text-royalPurple dark:text-vibrantOrange shrink-0 self-start mt-0.5" />
                <textarea
                  placeholder="Additional delivery instructions (optional) - e.g. Call when you arrive, Meet me at the gate, Leave it with security..."
                  value={form.deliveryInstructions}
                  onChange={update("deliveryInstructions")}
                  rows={3}
                  className="w-full bg-transparent outline-none text-sm text-ink dark:text-white placeholder:text-gray-400 resize-none"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Catalogue Items */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="glass rounded-xl2 shadow-card p-6 sm:p-8"
        >
          <h3 className="font-display font-bold text-lg text-ink dark:text-white mb-5 flex items-center gap-2">
            <ShoppingCart size={18} className="text-vibrantOrange" />
            Your Items
          </h3>

          {catalogueItems.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No items added yet. Use the "Add" buttons on the menu cards above.
            </p>
          ) : (
            <div className="space-y-2">
              {catalogueItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-lg bg-white/50 dark:bg-white/5 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink dark:text-white">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      KSh {item.unitPrice} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-vibrantOrange">KSh {item.unitPrice * item.quantity}</span>
                    <button type="button" onClick={() => onRemoveCatalogueItem?.(item.name)}
                      className="h-7 w-7 grid place-items-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-white/10 mt-2">
                <span className="text-sm font-semibold text-ink dark:text-white">Subtotal</span>
                <span className="text-sm font-bold text-ink dark:text-white">KSh {subtotal}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Custom Items */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="glass rounded-xl2 shadow-card p-6 sm:p-8"
        >
          <h3 className="font-display font-bold text-lg text-ink dark:text-white mb-1 flex items-center gap-2">
            <ClipboardList size={18} className="text-vibrantOrange" />
            Need Something Else?
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Type any items not listed in the menu above. We'll source them for you.
          </p>

          <div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 focus-within:ring-2 focus-within:ring-vibrantOrange transition-shadow">
              <ShoppingCart size={18} className="text-royalPurple dark:text-vibrantOrange shrink-0 self-start mt-0.5" />
              <textarea
                placeholder={"Type items not found in the menu, e.g.:\nKFC\nPhone Charger\nExtension Cable\nUmbrella\nMedicine"}
                value={orderItems}
                onChange={(e) => setOrderItems(e.target.value)}
                rows={5}
                className="w-full bg-transparent outline-none text-sm text-ink dark:text-white placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 focus-within:ring-2 focus-within:ring-vibrantOrange transition-shadow">
              <MessageSquare size={18} className="text-royalPurple dark:text-vibrantOrange shrink-0 self-start mt-0.5" />
              <textarea
                placeholder={"Special instructions (optional):\nBuy the cheapest available brand.\nIf out of stock, replace with alternatives."}
                value={form.specialInstructions}
                onChange={update("specialInstructions")}
                rows={4}
                className="w-full bg-transparent outline-none text-sm text-ink dark:text-white placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="glass rounded-xl2 shadow-card p-6 sm:p-8"
        >
          <h3 className="font-display font-bold text-lg text-ink dark:text-white mb-5 flex items-center gap-2">
            <ClipboardList size={18} className="text-vibrantOrange" />
            Order Summary
          </h3>

          {!form.fullName && !form.phone && !form.residence && !form.room && catalogueItems.length === 0 && !orderItems.trim() ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your order is currently empty. Select items from the menu or type what you need.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              {/* Customer Info */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-vibrantOrange mb-2">Customer Information</h4>
                <div className="space-y-1 text-gray-700 dark:text-gray-300">
                  {form.fullName && <p><span className="font-medium text-ink dark:text-white">Name:</span> {form.fullName}</p>}
                  {form.phone && <p><span className="font-medium text-ink dark:text-white">Phone:</span> {form.phone}</p>}
                  {form.residence && <p><span className="font-medium text-ink dark:text-white">Residence:</span> {form.residence}</p>}
                  {form.block && <p><span className="font-medium text-ink dark:text-white">Floor:</span> {form.block}</p>}
                  {form.room && <p><span className="font-medium text-ink dark:text-white">Room:</span> {form.room}</p>}
                </div>
              </div>

              {/* Catalogue Items Summary */}
              {catalogueItems.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-vibrantOrange mb-2">Items from Menu</h4>
                  <div className="space-y-1">
                    {catalogueItems.map((item) => (
                      <div key={item.name} className="flex justify-between text-gray-700 dark:text-gray-300">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-medium text-ink dark:text-white">KSh {item.unitPrice * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Items Summary */}
              {orderItems.trim() && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-vibrantOrange mb-2">Custom Requests</h4>
                  <div className="rounded-lg bg-white/50 dark:bg-white/5 p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {orderItems.trim()}
                  </div>
                </div>
              )}

              {form.specialInstructions.trim() && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-vibrantOrange mb-2">Special Instructions</h4>
                  <p className="text-gray-700 dark:text-gray-300">{form.specialInstructions.trim()}</p>
                </div>
              )}

              {/* Pricing */}
              {orderType === "Standard" && (
                <div className="border-t border-gray-200 dark:border-white/10 pt-3 space-y-1">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>KSh {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Delivery Fee</span>
                    <span>KSh {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-ink dark:text-white pt-1 border-t border-gray-200 dark:border-white/10">
                    <span>Grand Total</span>
                    <span>KSh {grandTotal}</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1">
                    <span className="text-[10px] font-bold text-green-700 dark:text-green-400">Standard Order</span>
                  </div>
                </div>
              )}

              {orderType === "Custom" && (
                <div className="border-t border-gray-200 dark:border-white/10 pt-3 space-y-2">
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 text-xs text-amber-800 dark:text-amber-300">
                    This order contains custom requests that require price confirmation before payment.
                  </div>
                  {catalogueItems.length > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Subtotal (menu items)</span>
                        <span>KSh {subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Delivery Fee</span>
                        <span>KSh {deliveryFee}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-ink dark:text-white pt-1 border-t border-gray-200 dark:border-white/10">
                        <span>Estimated Total</span>
                        <span>KSh {subtotal + deliveryFee} + custom items</span>
                      </div>
                    </>
                  )}
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1">
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">Custom Order</span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button type="button" onClick={scrollToForm}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-royalPurple dark:text-brightGold hover:underline"
                >
                  <Edit3 size={13} /> Edit Order
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Submit Button */}
        {orderType && (
          <div className="text-center">
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            <RippleButton type="submit" disabled={processing} className="px-10 py-3.5 text-base justify-center">
              {processing ? (
                <span className="flex items-center gap-2"><Loader size={18} className="animate-spin" /> Processing M-Pesa...</span>
              ) : orderType === "Standard" ? (
                "Proceed to Payment"
              ) : (
                "Submit for Pricing"
              )}
            </RippleButton>
          </div>
        )}
      </form>

      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 grid place-items-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-[#1a0a2e] rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl"
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 grid place-items-center shadow-lg mb-4">
                <Loader size={28} className="text-white animate-spin" />
              </div>
              <h3 className="text-lg font-display font-bold text-ink dark:text-white">Processing Payment</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Please wait while we process your M-Pesa payment of KSh {grandTotal}...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function InputField({ icon: Icon, placeholder, value, onChange, type = "text", required = false }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 focus-within:ring-2 focus-within:ring-vibrantOrange transition-shadow">
      <Icon size={18} className="text-royalPurple dark:text-vibrantOrange shrink-0" />
      <input type={type} value={value} required={required} placeholder={placeholder} onChange={onChange}
        className="w-full bg-transparent outline-none text-sm text-ink dark:text-white placeholder:text-gray-400"
      />
    </div>
  );
}
