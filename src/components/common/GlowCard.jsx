import React from "react";
import { motion } from "framer-motion";

export default function GlowCard({ children, className = "", delay = 0, as: Comp = motion.div, ...rest }) {
  return (
    <Comp
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className={`glow-card glass shadow-card ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  );
}
