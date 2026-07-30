import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Package, Hash, FileText, MapPin, Building, DoorOpen, Clock, MessageSquare } from "lucide-react";
import RippleButton from "../common/RippleButton.jsx";

const hostels = ["Qwetu", "Qejani"];

export default function RequestItemModal({ open, onClose, initialItem }) {
  const [itemName, setItemName] = useState(initialItem || "");
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");
  const [residence, setResidence] = useState("");
  const [block, setBlock] = useState("");
  const [room, setRoom] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [instructions, setInstructions] = useState("");
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (initialItem) setItemName(initialItem);
  }, [initialItem]);

  React.useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setQuantity("1");
      setDescription("");
      setResidence("");
      setBlock("");
      setRoom("");
      setDeliveryTime("");
      setInstructions("");
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
            className="relative w-full max-w-lg rounded-xl2 glass shadow-glowPurple p-5 sm:p-7 sm:p-8 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X size={17} />
            </button>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 grid place-items-center shadow-lg mb-4">
                  <Package size={28} className="text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-ink dark:text-white">
                  Request Submitted!
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  We'll try our best to get "{itemName}" delivered to you.
                </p>
                <RippleButton onClick={onClose} className="mt-6 justify-center w-full">
                  Done
                </RippleButton>
              </motion.div>
            ) : (
              <>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-vibrantOrange">
                  Custom Request
                </span>
                <h2 className="mt-2 text-2xl font-display font-bold text-ink dark:text-white">
                  Tell us what you need
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  We'll do our best to source it and deliver to your room.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <Field
                    icon={Package}
                    placeholder="What do you need? *"
                    value={itemName}
                    onChange={setItemName}
                    required
                  />
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <Field
                      icon={Hash}
                      placeholder="Quantity *"
                      value={quantity}
                      onChange={setQuantity}
                      required
                    />
                    <Field
                      icon={Clock}
                      placeholder="Delivery time"
                      value={deliveryTime}
                      onChange={setDeliveryTime}
                    />
                  </div>
                  <Field
                    icon={FileText}
                    placeholder="Description (optional)"
                    value={description}
                    onChange={setDescription}
                  />

                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block">
                      Residence *
                    </label>
                    <div className="flex gap-2">
                      {hostels.map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setResidence(h)}
                          className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                            residence === h
                              ? "bg-brand-gradient text-white border-transparent"
                              : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-white/5"
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      icon={Building}
                      placeholder="Block (optional)"
                      value={block}
                      onChange={setBlock}
                    />
                    <Field
                      icon={DoorOpen}
                      placeholder="Room (optional)"
                      value={room}
                      onChange={setRoom}
                    />
                  </div>

                  <Field
                    icon={MessageSquare}
                    placeholder="Additional instructions (optional)"
                    value={instructions}
                    onChange={setInstructions}
                  />

                  <RippleButton
                    type="submit"
                    disabled={!itemName.trim() || !quantity.trim() || !residence}
                    className="w-full justify-center"
                  >
                    Submit Request
                  </RippleButton>
                </form>
              </>
            )}
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
