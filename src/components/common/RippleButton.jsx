import React, { useRef } from "react";
import { motion } from "framer-motion";

/**
 * A button with a material-style ripple on click, wrapped in a Framer Motion
 * scale-tap effect. `as` lets it render as a real <button> or a decorative
 * wrapper (e.g. around a Link).
 */
export default function RippleButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
  ...rest
}) {
  const ref = useRef(null);

  const variants = {
    primary:
      "bg-brand-gradient text-white shadow-glowPurple hover:shadow-glowOrange",
    gold: "bg-gold-gradient text-ink shadow-glowGold",
    ghost:
      "bg-white/10 text-white border border-white/30 backdrop-blur-md hover:bg-white/20",
    outline:
      "border-2 border-royalPurple text-royalPurple dark:text-white dark:border-white/40 hover:bg-royalPurple/10",
  };

  const spawnRipple = (e) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const span = document.createElement("span");
    span.className = "ripple-span";
    span.style.width = span.style.height = `${size}px`;
    span.style.left = `${e.clientX - rect.left - size / 2}px`;
    span.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(span);
    setTimeout(() => span.remove(), 650);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        if (disabled) return;
        spawnRipple(e);
        onClick?.(e);
      }}
      className={`btn-ripple relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
