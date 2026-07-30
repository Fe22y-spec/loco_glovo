import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, DoorOpen, Phone, User, ArrowRight } from "lucide-react";
import RippleButton from "../common/RippleButton.jsx";

/**
 * Second step of onboarding — collects floor/room/phone (and optionally
 * name) so orders can be delivered to the right door. No login, no
 * registration: this is stored locally only, for guest ordering.
 */
export default function DeliveryDetailsModal({ open, hostel, onBack, onSubmit }) {
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!floor.trim() || !room.trim()) {
      setError("Floor and room number are required so your rider can find you.");
      return;
    }
    setError("");
    onSubmit({ floor: floor.trim(), room: room.trim(), phone: phone.trim(), customerName: customerName.trim() });
  };

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
            className="relative w-full max-w-md rounded-xl2 glass shadow-glowPurple p-8"
          >
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-vibrantOrange">
              Delivering to {hostel}
            </span>
            <h2 className="mt-2 text-2xl font-display font-bold text-ink dark:text-white">
              Where should we bring it?
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Guest ordering — no account needed.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Field icon={MapPin} placeholder="Floor number" value={floor} onChange={setFloor} required />
              <Field icon={DoorOpen} placeholder="Room number" value={room} onChange={setRoom} required />
              <Field icon={Phone} placeholder="Phone number (optional)" value={phone} onChange={setPhone} type="tel" />
              <Field icon={User} placeholder="Your name (optional)" value={customerName} onChange={setCustomerName} />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-sm font-semibold text-gray-500 hover:text-royalPurple dark:text-gray-300"
                >
                  ← Back
                </button>
                <RippleButton type="submit" className="flex-1 justify-center">
                  Continue <ArrowRight size={18} />
                </RippleButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ icon: Icon, placeholder, value, onChange, type = "text", required = false }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 focus-within:ring-2 focus-within:ring-vibrantOrange transition-shadow">
      <Icon size={18} className="text-royalPurple dark:text-vibrantOrange shrink-0" />
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent outline-none text-sm text-ink dark:text-white placeholder:text-gray-400"
      />
    </div>
  );
}
