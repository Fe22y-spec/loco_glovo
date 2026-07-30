import React from "react";
import { motion } from "framer-motion";

export default function CategoryCard({ category, active, onClick, index }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.06, y: -6 }}
      whileTap={{ scale: 0.96 }}
      className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl p-5 min-w-[120px] transition-shadow ${
        active
          ? `bg-gradient-to-br ${category.gradient} shadow-glowOrange text-white`
          : "glass shadow-card text-ink dark:text-white hover:shadow-glowPurple"
      }`}
    >
      <span className="text-3xl animate-floatSlow group-hover:animate-none group-hover:scale-125 transition-transform">
        {category.emoji}
      </span>
      <span className="text-xs sm:text-sm font-display font-semibold text-center">
        {category.name}
      </span>
    </motion.button>
  );
}
