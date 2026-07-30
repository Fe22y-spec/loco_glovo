import React from "react";
import { motion } from "framer-motion";

export default function EstimatedDelivery() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 mx-auto rounded-full bg-gold-gradient text-ink text-sm font-semibold px-5 py-2.5 shadow-glowGold"
    >
      <motion.span
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        🛵
      </motion.span>
      Estimated Delivery: 22–35 Minutes
    </motion.div>
  );
}
