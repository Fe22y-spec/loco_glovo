import React from "react";
import { motion } from "framer-motion";

/**
 * Hand-built animated scooter/rider illustration (pure SVG + CSS) — no
 * external Lottie file needed, so it works fully offline. Wheels spin,
 * the whole rider gently bounces along an imaginary road.
 */
export default function ScooterIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="relative w-full max-w-md mx-auto"
    >
      <motion.svg
        viewBox="0 0 400 260"
        className="w-full h-auto drop-shadow-2xl animate-drive"
        style={{ animationDuration: "2.2s" }}
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#FFC107" />
          </linearGradient>
          <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6A0DAD" />
            <stop offset="100%" stopColor="#4B0082" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="200" cy="235" rx="150" ry="12" fill="#4B0082" opacity="0.12" />

        {/* Delivery box on the back */}
        <rect x="60" y="110" width="70" height="60" rx="10" fill="url(#boxGrad)" />
        <text x="95" y="147" fontSize="22" textAnchor="middle" fill="#FFC107">📦</text>

        {/* Scooter body */}
        <path
          d="M120 190 L150 190 L170 140 L230 140 L245 100 L275 100"
          stroke="url(#bodyGrad)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="255" y="88" width="14" height="26" rx="4" fill="#4B0082" />

        {/* Seat + rider */}
        <path d="M170 140 L210 140 L215 128 L180 128 Z" fill="#4B0082" />
        <circle cx="205" cy="95" r="16" fill="#FFDDB0" />
        <path d="M188 92 a17 17 0 0 1 34 0 z" fill="#4B0082" />
        <rect x="192" y="105" width="30" height="38" rx="10" fill="url(#bodyGrad)" />
        <rect x="182" y="112" width="16" height="8" rx="4" fill="url(#bodyGrad)" />

        {/* Wheels */}
        <g style={{ transformOrigin: "150px 200px" }} className="animate-wheelSpin">
          <circle cx="150" cy="200" r="26" fill="none" stroke="#1A0B2E" strokeWidth="8" />
          <circle cx="150" cy="200" r="4" fill="#1A0B2E" />
        </g>
        <g style={{ transformOrigin: "270px 200px" }} className="animate-wheelSpin">
          <circle cx="270" cy="200" r="26" fill="none" stroke="#1A0B2E" strokeWidth="8" />
          <circle cx="270" cy="200" r="4" fill="#1A0B2E" />
        </g>

        {/* Speed lines */}
        <g stroke="#FFC107" strokeWidth="4" strokeLinecap="round" opacity="0.6">
          <line x1="10" y1="140" x2="45" y2="140" />
          <line x1="0" y1="160" x2="35" y2="160" />
          <line x1="15" y1="180" x2="50" y2="180" />
        </g>
      </motion.svg>
    </motion.div>
  );
}
