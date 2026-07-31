import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext.jsx";
import { ArrowLeft, User, MapPin, Package, MessageSquare, CreditCard, Clock, Copy, Printer, FileText, DollarSign, Send, Check } from "lucide-react";

const allStatuses = ["Pending", "Accepted", "Shopping", "Out for Delivery", "Delivered", "Cancelled"];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus, updateOrderNotes, priceCustomOrder, verifyPayment, settings } = useAdmin();
  const order = useMemo(() => getOrderById(id), [id, getOrderById]);
  const [notes, setNotes] = useState(order?.adminNotes || "");
  const [customPrice, setCustomPrice] = useState(order?.customPricing?.items?.[0]?.price || "");
  const [invoiceSent, setInvoiceSent] = useState(false);

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🔍</p>
        <p className="font-display font-semibold text-lg text-ink dark:text-white">Order not found</p>
        <button onClick={() => navigate("/admin/orders")} className="mt-4 text-sm font-semibold text-royalPurple dark:text-brightGold hover:underline">
          Back to Orders
        </button>
      </div>
    );
  }

  const isCustom = order.orderType === "Custom";
  const deliveryFee = settings.deliveryFee || 50;

  const catalogueTotal = (order.catalogueItems || []).reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const customItemPrice = Number(customPrice) || 0;
  const grandTotal = catalogueTotal + customItemPrice + deliveryFee;

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
  };

  const handleNotesSave = () => {
    updateOrderNotes(order.id, notes);
  };

  const handleSendInvoice = () => {
    const pricedItems = [{ label: "Custom Items", price: customItemPrice }];
    priceCustomOrder(order.id, pricedItems, catalogueTotal + customItemPrice, deliveryFee);
    setInvoiceSent(true);
    setTimeout(() => setInvoiceSent(false), 3000);
  };

  const handleMarkAsPaid = () => {
    verifyPayment(order.id);
  };

  const copyOrder = () => {
    const lines = [
      `🛵 *LocoGlovo Order*`,
      ``,
      `Order: ${order.id} (${order.orderType})`,
      `Customer: ${order.customer?.name}`,
      `Phone: ${order.customer?.phone}`,
      `Residence: ${order.delivery?.residence}`,
      `Floor: ${order.delivery?.block || "N/A"}`,
      `Room: ${order.delivery?.room}`,
      `Time: ${order.delivery?.time || "Not specified"}`,
      `Instructions: ${order.delivery?.instructions || "None"}`,
      ``,
    ];
    if (order.catalogueItems?.length > 0) {
      lines.push(`*Menu Items:*`);
      order.catalogueItems.forEach((item) => {
        lines.push(`${item.name} x${item.quantity} @ KSh ${item.unitPrice} = KSh ${item.unitPrice * item.quantity}`);
      });
      lines.push(``);
    }
    if (order.customItems) {
      lines.push(`*Custom Items:*`);
      lines.push(order.customItems);
      lines.push(``);
    }
    if (order.order?.specialInstructions) {
      lines.push(`*Special Instructions:* ${order.order.specialInstructions}`);
    }
    lines.push(``);
    if (order.paymentStatus === "Verified") {
      lines.push(`Payment: Verified ✅`);
      lines.push(`Ref: ${order.transactionRef}`);
    } else {
      lines.push(`Payment: ${order.paymentStatus}`);
    }
    navigator.clipboard.writeText(lines.join("\n"));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate("/admin/orders")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-royalPurple dark:text-brightGold hover:underline">
        <ArrowLeft size={15} /> Back to Orders
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink dark:text-white">{order.id}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Created {new Date(order.createdAt).toLocaleString()} &middot; {order.orderType} Order
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyOrder} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/10 px-4 py-2.5 sm:py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/5 min-h-[44px] sm:min-h-0">
            <Copy size={13} /> Copy Order
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/10 px-4 py-2.5 sm:py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/5 min-h-[44px] sm:min-h-0">
            <Printer size={13} /> Print
          </button>
        </div>
      </div>

      {/* Order Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl2 shadow-card p-6"
      >
        <h3 className="font-display font-bold text-base text-ink dark:text-white mb-4">Order Timeline</h3>
        <div className="relative pl-6 space-y-0">
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-white/10" />
          {order.timeline.map((step) => (
            <div key={step.status} className="relative flex items-center gap-3 pb-4">
              <div className={`absolute -left-[18px] h-3.5 w-3.5 rounded-full border-2 z-10 ${
                step.done ? "bg-royalPurple border-royalPurple" : "bg-white dark:bg-[#0d0518] border-gray-300 dark:border-white/20"
              }`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${step.done ? "text-ink dark:text-white" : "text-gray-400"}`}>
                  {step.done ? "✓" : "○"} {step.status}
                </p>
                {step.timestamp && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(step.timestamp).toLocaleString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Status Control */}
      {order.paymentStatus === "Verified" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass rounded-xl2 shadow-card p-6"
        >
          <h3 className="font-display font-bold text-base text-ink dark:text-white mb-3">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {allStatuses.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`rounded-full px-4 py-2 sm:py-1.5 text-xs font-bold transition-all min-h-[44px] sm:min-h-0 ${
                  order.status === s
                    ? "bg-brand-gradient text-white shadow-glowPurple"
                    : "bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-vibrantOrange"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Customer Information */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl2 shadow-card p-6"
      >
        <h3 className="font-display font-bold text-base text-ink dark:text-white mb-4 flex items-center gap-2">
          <User size={16} className="text-vibrantOrange" /> Customer Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Full Name</span>
            <p className="font-medium text-ink dark:text-white">{order.customer?.name}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Phone</span>
            <p><a href={`tel:${order.customer?.phone}`} className="font-medium text-royalPurple dark:text-brightGold hover:underline">{order.customer?.phone}</a></p>
          </div>
        </div>
      </motion.div>

      {/* Delivery Details */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-xl2 shadow-card p-6"
      >
        <h3 className="font-display font-bold text-base text-ink dark:text-white mb-4 flex items-center gap-2">
          <MapPin size={16} className="text-vibrantOrange" /> Delivery Details
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Residence</span>
            <p className="font-medium text-ink dark:text-white">{order.delivery?.residence}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Floor</span>
            <p className="font-medium text-ink dark:text-white">{order.delivery?.block || "N/A"}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Room</span>
            <p className="font-medium text-ink dark:text-white">{order.delivery?.room}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Preferred Time</span>
            <p className="font-medium text-ink dark:text-white">{order.delivery?.time || "Not specified"}</p>
          </div>
          <div className="sm:col-span-2 lg:col-span-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Delivery Instructions</span>
            <p className="font-medium text-ink dark:text-white">{order.delivery?.instructions || "None"}</p>
          </div>
        </div>
      </motion.div>

      {/* Ordered Items */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl2 shadow-card p-6"
      >
        <h3 className="font-display font-bold text-base text-ink dark:text-white mb-4 flex items-center gap-2">
          <Package size={16} className="text-vibrantOrange" /> Ordered Items
        </h3>

        {/* Catalogue Items */}
        {order.catalogueItems?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-vibrantOrange mb-2">Menu Items</h4>
            <div className="space-y-1">
              {order.catalogueItems.map((item) => (
                <div key={item.name} className="flex justify-between text-sm text-gray-700 dark:text-gray-300 rounded-lg bg-white/50 dark:bg-white/5 px-4 py-2">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-medium text-ink dark:text-white">KSh {item.unitPrice * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Items */}
        {order.customItems && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-vibrantOrange mb-2">Custom Requests</h4>
            <div className="rounded-lg bg-white/50 dark:bg-white/5 p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {order.customItems}
            </div>
          </div>
        )}

        {/* Fallback */ }
        {!order.catalogueItems?.length && !order.customItems && (
          <div className="rounded-lg bg-white/50 dark:bg-white/5 p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {order.order?.items || "No items specified."}
          </div>
        )}

        {order.order?.specialInstructions && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-vibrantOrange mb-2 flex items-center gap-1.5">
              <MessageSquare size={13} /> Special Instructions
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">{order.order.specialInstructions}</p>
          </div>
        )}
      </motion.div>

      {/* Pricing Section — Custom Orders */}
      {isCustom && order.paymentStatus !== "Verified" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-xl2 shadow-card p-6"
        >
          <h3 className="font-display font-bold text-base text-ink dark:text-white mb-4 flex items-center gap-2">
            <DollarSign size={16} className="text-vibrantOrange" /> Price Custom Items
          </h3>

          {order.status === "Priced" || order.customPricing ? (
            <div className="space-y-3">
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-sm">
                <p className="font-semibold text-green-700 dark:text-green-400">Invoice Sent ✅</p>
                {order.customPricing && (
                  <div className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between"><span>Menu Items</span><span>KSh {catalogueTotal}</span></div>
                    <div className="flex justify-between"><span>Custom Items</span><span>KSh {order.customPricing.items.reduce((s, i) => s + i.price, 0)}</span></div>
                    <div className="flex justify-between"><span>Delivery Fee</span><span>KSh {order.customPricing.deliveryFee}</span></div>
                    <div className="flex justify-between font-bold text-ink dark:text-white border-t border-gray-200 dark:border-white/10 pt-1"><span>Total</span><span>KSh {order.customPricing.grandTotal}</span></div>
                  </div>
                )}
              </div>
              {order.status === "Priced" && (
                <button
                  onClick={handleMarkAsPaid}
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white text-xs font-bold px-4 py-2.5 sm:py-2 hover:bg-green-700 transition-colors min-h-[44px] sm:min-h-0"
                >
                  <Check size={14} /> Mark as Paid (M-Pesa)
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enter a total price for all custom items below. The system will calculate the final total including delivery.
              </p>
              <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 sm:px-4 py-3 focus-within:ring-2 focus-within:ring-vibrantOrange">
                <span className="text-xs sm:text-sm font-semibold text-gray-500 shrink-0">KSh</span>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder="Enter price"
                  className="w-full bg-transparent outline-none text-sm text-ink dark:text-white"
                />
              </div>
              <div className="rounded-lg bg-white/50 dark:bg-white/5 p-4 text-sm space-y-1">
                {catalogueTotal > 0 && <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Menu Items</span><span>KSh {catalogueTotal}</span></div>}
                <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Custom Items</span><span>KSh {customItemPrice}</span></div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Delivery Fee</span><span>KSh {deliveryFee}</span></div>
                <div className="flex justify-between font-bold text-ink dark:text-white border-t border-gray-200 dark:border-white/10 pt-1"><span>Grand Total</span><span>KSh {grandTotal}</span></div>
              </div>
              <button
                onClick={handleSendInvoice}
                disabled={!customPrice || Number(customPrice) <= 0}
                className="inline-flex items-center gap-2 rounded-full bg-brand-gradient text-white text-sm font-semibold px-5 py-2.5 disabled:opacity-50 hover:shadow-glowOrange transition-shadow min-h-[44px] sm:min-h-0"
              >
                <Send size={15} /> {invoiceSent ? "Invoice Sent!" : "Send Invoice"}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Payment Information */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass rounded-xl2 shadow-card p-6"
      >
        <h3 className="font-display font-bold text-base text-ink dark:text-white mb-4 flex items-center gap-2">
          <CreditCard size={16} className="text-vibrantOrange" /> Payment Information
        </h3>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
            <p className={`font-medium ${order.paymentStatus === "Verified" ? "text-green-600" : "text-amber-600"}`}>
              {order.paymentStatus === "Verified" ? "Verified ✅" : order.paymentStatus}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Method</span>
            <p className="font-medium text-ink dark:text-white">{order.paymentMethod || "—"}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Reference</span>
            <p className="font-medium text-ink dark:text-white">{order.transactionRef || "—"}</p>
          </div>
        </div>
        {order.customPricing && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
            <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Items Total</span><span className="font-medium text-ink dark:text-white">KSh {order.customPricing.totalPrice}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Delivery Fee</span><span className="font-medium text-ink dark:text-white">KSh {order.customPricing.deliveryFee}</span></div>
            <div className="flex justify-between text-sm font-bold"><span className="text-ink dark:text-white">Grand Total</span><span className="text-ink dark:text-white">KSh {order.customPricing.grandTotal}</span></div>
          </div>
        )}
      </motion.div>

      {/* Admin Notes */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl2 shadow-card p-6"
      >
        <h3 className="font-display font-bold text-base text-ink dark:text-white mb-4 flex items-center gap-2">
          <FileText size={16} className="text-vibrantOrange" /> Admin Notes
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Visible only to administrators.</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Customer is a frequent buyer. Usually prefers Brookside milk. Deliver through Gate 2."
          rows={4}
          className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 text-sm text-ink dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-vibrantOrange resize-none"
        />
        <button
          onClick={handleNotesSave}
          className="mt-2 rounded-full bg-brand-gradient text-white text-xs font-semibold px-4 py-2.5 sm:py-2 hover:shadow-glowOrange transition-shadow min-h-[44px] sm:min-h-0"
        >
          Save Notes
        </button>
      </motion.div>
    </div>
  );
}
