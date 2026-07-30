import React from "react";
import { motion } from "framer-motion";

const icons = [
  { emoji: "🍕", top: "10%", left: "8%", delay: 0 },
  { emoji: "🛒", top: "68%", left: "4%", delay: 0.6 },
  { emoji: "📦", top: "20%", left: "88%", delay: 1.1 },
  { emoji: "🎁", top: "75%", left: "90%", delay: 0.3 },
  { emoji: "🥤", top: "45%", left: "94%", delay: 1.6 },
];

export default function FloatingIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
      {icons.map((icon, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl sm:text-4xl select-none animate-float"
          style={{ top: icon.top, left: icon.left, animationDelay: `${icon.delay}s` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ delay: icon.delay, duration: 0.6, type: "spring" }}
        >
          {icon.emoji}
        </motion.span>
      ))}
    </div>
  );
}
