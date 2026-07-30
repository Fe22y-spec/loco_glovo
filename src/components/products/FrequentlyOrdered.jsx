import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const commonRequests = [
  { label: "Extension Cable", emoji: "🔌" },
  { label: "Laptop Charger", emoji: "⚡" },
  { label: "Phone Charger", emoji: "📱" },
  { label: "Earphones", emoji: "🎧" },
  { label: "Calculator", emoji: "🧮" },
  { label: "Notebook", emoji: "📓" },
  { label: "Umbrella", emoji: "☂️" },
  { label: "Power Bank", emoji: "🔋" },
  { label: "Avocado", emoji: "🥑" },
  { label: "KFC", emoji: "🍗" },
  { label: "Java Coffee", emoji: "☕" },
  { label: "Ice Cream", emoji: "🍦" },
];

export default function FrequentlyOrdered({ onRequestItem }) {
  if (commonRequests.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 mb-6"
      >
        <Sparkles size={18} className="text-vibrantOrange" />
        <h3 className="font-display font-bold text-xl text-ink dark:text-white">
          Frequently Requested
        </h3>
      </motion.div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {commonRequests.map((item) => (
          <button
            key={item.label}
            onClick={() => onRequestItem?.(item.label)}
            className="shrink-0 flex items-center gap-2 rounded-full glass shadow-card px-4 py-2.5 text-sm font-semibold text-ink dark:text-white hover:shadow-glowPurple transition-shadow hover:-translate-y-0.5"
          >
            <span className="text-lg">{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
