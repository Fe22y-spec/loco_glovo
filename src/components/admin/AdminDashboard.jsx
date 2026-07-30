import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext.jsx";
import { Clock, CheckCircle, ShoppingBag, Bike, Package, XCircle, TrendingUp, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const { getStats, getMostRequested, orders } = useAdmin();
  const stats = useMemo(() => getStats(), [getStats, orders]);
  const mostRequested = useMemo(() => getMostRequested(), [getMostRequested, orders]);
  const navigate = useNavigate();

  const statCards = [
    { label: "Today's Orders", value: stats.todayOrders, gradient: "linear-gradient(135deg, #6A0DAD, #4B0082)", icon: Clock },
    { label: "Pending", value: stats.pending, gradient: "linear-gradient(135deg, #F59E0B, #D97706)", icon: Clock },
    { label: "Accepted", value: stats.accepted, gradient: "linear-gradient(135deg, #3B82F6, #2563EB)", icon: CheckCircle },
    { label: "Shopping", value: stats.shopping, gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)", icon: ShoppingBag },
    { label: "Out for Delivery", value: stats.outForDelivery, gradient: "linear-gradient(135deg, #FF7A00, #EA580C)", icon: Bike },
    { label: "Delivered", value: stats.delivered, gradient: "linear-gradient(135deg, #22C55E, #16A34A)", icon: Package },
    { label: "Awaiting Pricing", value: stats.awaitingPricing, gradient: "linear-gradient(135deg, #F59E0B, #D97706)", icon: DollarSign },
    { label: "Priced", value: stats.priced, gradient: "linear-gradient(135deg, #14B8A6, #0D9488)", icon: CheckCircle },
    { label: "Cancelled", value: stats.cancelled, gradient: "linear-gradient(135deg, #EF4444, #DC2626)", icon: XCircle },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-ink dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of all orders.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl p-4 text-white shadow-lg"
            style={{ background: card.gradient }}
          >
            <card.icon size={20} className="opacity-80 mb-2" />
            <p className="text-2xl font-display font-bold">{card.value}</p>
            <p className="text-[11px] opacity-80 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl2 shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-ink dark:text-white">Recent Orders</h3>
            <button onClick={() => navigate("/admin/orders")} className="text-xs font-semibold text-royalPurple dark:text-brightGold hover:underline">
              View All
            </button>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 8).map((order) => (
                <button
                  key={order.id}
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                  className="w-full flex items-center justify-between rounded-lg bg-white/50 dark:bg-white/5 px-4 py-2.5 text-left hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink dark:text-white">{order.id}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/50 dark:bg-white/10 text-gray-500 dark:text-gray-300`}>
                      {order.orderType}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full text-white`}
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
                      {order.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Most Requested Items */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl2 shadow-card p-6"
        >
          <h3 className="font-display font-bold text-lg text-ink dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-vibrantOrange" />
            Most Requested Items
          </h3>
          {mostRequested.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No data yet — orders will populate this list.</p>
          ) : (
            <div className="space-y-2">
              {mostRequested.slice(0, 10).map((item, i) => (
                <div key={item.item} className="flex items-center justify-between rounded-lg bg-white/50 dark:bg-white/5 px-4 py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-5">{i + 1}.</span>
                    <span className="text-sm font-medium text-ink dark:text-white capitalize">{item.item}</span>
                  </div>
                  <span className="text-xs font-semibold text-royalPurple dark:text-brightGold">{item.count}x</span>
                </div>
              ))}
            </div>
          )}
          {mostRequested.length > 0 && (
            <p className="mt-4 text-[10px] text-gray-400 dark:text-gray-500">
              Based on verified order data. Helps decide what to feature on the homepage.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
