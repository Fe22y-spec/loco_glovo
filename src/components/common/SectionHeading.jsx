import React from "react";
import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, subtitle, align = "left" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-10 ${align === "center" ? "text-center mx-auto max-w-2xl" : ""}`}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-vibrantOrange mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-display font-bold bg-brand-gradient bg-clip-text text-transparent">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-gray-600 dark:text-gray-300">{subtitle}</p>
      )}
    </motion.div>
  );
}
