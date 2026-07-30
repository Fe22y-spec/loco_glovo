import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext.jsx";
import { Search, Bell } from "lucide-react";

const statuses = ["All", "Pending", "Accepted", "Shopping", "Out for Delivery", "Delivered", "Awaiting Pricing", "Priced", "Cancelled"];

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useAdmin();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesFilter = filter === "All" || o.status === filter;
      const matchesType = typeFilter === "All" || o.orderType === typeFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        (o.customer?.name || "").toLowerCase().includes(q) ||
        (o.customer?.phone || "").includes(q) ||
        (o.delivery?.room || "").toLowerCase().includes(q);
      return matchesFilter && matchesType && matchesSearch;
    });
  }, [orders, search, filter, typeFilter]);

  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  const copyToClipboard = (order) => {
    const lines = [
      `🛵 *LocoGlovo Order*`,
      ``,
      `Order: ${order.id} (${order.orderType})`,
      `Customer: ${order.customer?.name}`,
      `Phone: ${order.customer?.phone}`,
      `Residence: ${order.delivery?.residence}`,
      `Room: ${order.delivery?.room}`,
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
      lines.push(`*Instructions:* ${order.order.specialInstructions}`);
    }
    if (order.paymentStatus === "Verified") {
      lines.push(``);
      lines.push(`Payment: Verified ✅`);
      lines.push(`Ref: ${order.transactionRef}`);
    }
    navigator.clipboard.writeText(lines.join("\n"));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink dark:text-white">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setShowNotification(true);
              setTimeout(() => setShowNotification(false), 3000);
              try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g); g.connect(ctx.destination);
                o.type = "sine"; o.frequency.setValueAtTime(880, ctx.currentTime);
                g.gain.setValueAtTime(0.04, ctx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                o.start(); o.stop(ctx.currentTime + 0.3);
              } catch {}
            }}
            className="relative h-9 w-9 grid place-items-center rounded-full bg-white/70 dark:bg-white/10 text-ink dark:text-white hover:bg-white"
            title="Check new orders"
          >
            <Bell size={16} />
            {pendingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-vibrantOrange text-[9px] font-bold text-white grid place-items-center">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </button>
          {showNotification && pendingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-full mt-2 w-64 glass-dark rounded-xl p-3 shadow-lg z-10"
            >
              <p className="text-sm font-semibold text-white">🔔 {pendingCount} New Verified Order{pendingCount !== 1 ? "s" : ""}</p>
              <p className="text-xs text-white/60 mt-0.5">Pending review</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Order ID, name, phone or room..."
          className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 pl-9 pr-4 py-2.5 text-sm outline-none text-ink dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-vibrantOrange"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === s
                  ? "bg-brand-gradient text-white"
                  : "bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {["All", "Standard", "Custom"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold transition-colors ${
                typeFilter === t
                  ? "bg-ink text-white dark:bg-white dark:text-ink"
                  : "bg-white/70 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 glass rounded-xl2">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-display font-semibold text-lg text-ink dark:text-white">No orders found</p>
          <p className="text-sm text-gray-500 mt-1">
            {search ? "Try a different search term." : "Orders will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="pb-3 pr-3">Order ID</th>
                <th className="pb-3 pr-3">Customer</th>
                <th className="pb-3 pr-3 hidden sm:table-cell">Phone</th>
                <th className="pb-3 pr-3 hidden md:table-cell">Room</th>
                <th className="pb-3 pr-3 hidden lg:table-cell">Date</th>
                <th className="pb-3 pr-3">Type</th>
                <th className="pb-3 pr-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-3">
                    <button onClick={() => navigate(`/admin/orders/${order.id}`)} className="font-semibold text-royalPurple dark:text-brightGold hover:underline text-xs">
                      {order.id}
                    </button>
                  </td>
                  <td className="py-3 pr-3 font-medium text-ink dark:text-white">{order.customer?.name}</td>
                  <td className="py-3 pr-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                    <a href={`tel:${order.customer?.phone}`} className="hover:text-royalPurple dark:hover:text-brightGold">{order.customer?.phone}</a>
                  </td>
                  <td className="py-3 pr-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">{order.delivery?.room}</td>
                  <td className="py-3 pr-3 text-gray-500 dark:text-gray-400 hidden lg:table-cell text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.orderType === "Standard"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {order.orderType}
                    </span>
                  </td>
                  <td className="py-3 pr-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-full text-white border-none cursor-pointer`}
                      style={{
                        backgroundColor: order.status === "Awaiting Pricing" ? "#F59E0B" :
                          order.status === "Priced" ? "#14B8A6" :
                          order.status === "Pending" ? "#F59E0B" :
                          order.status === "Accepted" ? "#3B82F6" :
                          order.status === "Shopping" ? "#8B5CF6" :
                          order.status === "Out for Delivery" ? "#FF7A00" :
                          order.status === "Delivered" ? "#22C55E" : "#EF4444"
                      }}
                    >
                      {statuses.filter(s => s !== "All").map((s) => (
                        <option key={s} value={s} style={{ color: "black", background: "white" }}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => copyToClipboard(order)}
                        className="text-[10px] font-semibold px-2 py-1.5 rounded bg-white/70 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-white min-w-[44px]"
                        title="Copy Order"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="text-[10px] font-semibold px-2 py-1.5 rounded bg-white/70 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-white min-w-[44px]"
                        title="Print Order"
                      >
                        Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
