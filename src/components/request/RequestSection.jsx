import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import RippleButton from "../common/RippleButton.jsx";

const quickSuggestions = [
  { label: "Chips", emoji: "🍟" },
  { label: "Pizza", emoji: "🍕" },
  { label: "Milk", emoji: "🥛" },
  { label: "Eggs", emoji: "🥚" },
  { label: "Bread", emoji: "🍞" },
  { label: "Tissue", emoji: "🧻" },
  { label: "Printing Paper", emoji: "📄" },
  { label: "Charger", emoji: "🔌" },
  { label: "Pain Relief", emoji: "💊" },
  { label: "Chocolate", emoji: "🍫" },
  { label: "Fruits", emoji: "🍎" },
  { label: "Burger", emoji: "🍔" },
];

export default function RequestSection({ onRequest }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onRequest?.(query.trim());
      setQuery("");
    }
  };

  const handleSuggestion = (label) => {
    onRequest?.(label);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-vibrantOrange mb-2">
          Need Something Else?
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink dark:text-white">
          Can't find what you're looking for?
        </h2>
        <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
          Type anything you need and we'll try to get it delivered.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex items-center gap-2 rounded-full glass shadow-card p-1.5 sm:p-2">
          <Search size={18} className="ml-2 text-gray-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Example: Extension cable, Calculator, KFC, Panadol, Avocado, Notebook, Charger..."
            className="w-full bg-transparent outline-none text-sm text-ink dark:text-white placeholder:text-gray-400 py-2.5"
          />
          <RippleButton type="submit" className="!px-5 !py-2.5 sm:!py-2.5 text-sm shrink-0 min-h-[44px] sm:min-h-0">
            Request Item
          </RippleButton>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-1">
            Quick ideas:
          </span>
          {quickSuggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => handleSuggestion(s.label)}
              className="inline-flex items-center gap-1 rounded-full bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-2 sm:py-1.5 text-xs sm:text-xs font-medium text-ink dark:text-white hover:border-vibrantOrange hover:text-vibrantOrange transition-colors min-h-[44px] sm:min-h-0"
            >
              <span>{s.emoji}</span>
              {s.label}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
