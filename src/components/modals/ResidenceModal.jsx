import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOrder } from "../../context/OrderContext.jsx";

/**
 * First-time popup shown immediately on load. Asks the guest which hostel
 * they live in before anything else — LocoGlovo only serves Qwetu & Qejani.
 *
 * NOTE: replace /qwetu-logo-placeholder.svg and /qejani-logo-placeholder.svg
 * in /public with the real uploaded qwetu_logo / qejani_logo artwork.
 */
export default function ResidenceModal({ open, onSelect }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="relative w-full max-w-lg rounded-xl2 glass shadow-glowPurple p-8 sm:p-10 text-center overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-vibrantOrange/30 rounded-full blur-3xl animate-blob" />
            <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-royalPurple/30 rounded-full blur-3xl animate-blob" />

            <div className="relative">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-vibrantOrange">
                Welcome to LocoGlovo
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-display font-bold text-ink dark:text-white">
                Choose Your Residence
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                We currently deliver only to Qwetu and Qejani hostels.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <HostelButton
                  label="Qwetu"
                  logo="/qwetu-logo-placeholder.svg"
                  onClick={() => onSelect("Qwetu")}
                  glow="shadow-glowPurple"
                />
                <HostelButton
                  label="Qejani"
                  logo="/qejani-logo-placeholder.svg"
                  onClick={() => onSelect("Qejani")}
                  glow="shadow-glowOrange"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HostelButton({ label, logo, onClick, glow }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative flex flex-col items-center gap-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/40 dark:border-white/10 p-6 transition-shadow ${glow} hover:shadow-lg`}
    >
      <img
        src={logo}
        alt={`${label} logo`}
        className="h-16 w-auto rounded-xl object-contain"
      />
      <span className="font-display font-semibold text-lg text-ink dark:text-white">
        {label}
      </span>
      <span className="text-xs text-vibrantOrange font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        Deliver here →
      </span>
    </motion.button>
  );
}
