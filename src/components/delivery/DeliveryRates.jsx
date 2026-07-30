import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Clock, Banknote } from "lucide-react";
import { deliverySlots } from "../../data/deliverySlots.js";
import SectionHeading from "../common/SectionHeading.jsx";

const periodMeta = {
  morning: { icon: Sun, label: "Morning Deliveries", gradient: "from-brightGold to-vibrantOrange" },
  evening: { icon: Moon, label: "Evening Deliveries", gradient: "from-royalPurple to-deepPurple" },
  late: { icon: Clock, label: "Past 9 PM", gradient: "from-deepPurple to-ink" },
};

export default function DeliveryRates() {
  const grouped = deliverySlots.reduce((acc, slot) => {
    (acc[slot.period] = acc[slot.period] || []).push(slot);
    return acc;
  }, {});

  return (
    <section id="delivery-rates" className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <SectionHeading
        eyebrow="Plan Ahead"
        title="Delivery Time Slots & Rates"
        subtitle="Pick a slot at checkout — fees vary by how close to your window we deliver."
        align="center"
      />

      <div className="space-y-10">
        {Object.entries(grouped).map(([period, slots]) => {
          const meta = periodMeta[period];
          const Icon = meta.icon;
          return (
            <div key={period}>
              <div className="flex items-center gap-2 mb-4 justify-center">
                <Icon size={18} className="text-royalPurple dark:text-brightGold" />
                <h3 className="font-display font-semibold text-lg text-ink dark:text-white">
                  {meta.label}
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
                {slots.map((slot, i) => (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={`relative rounded-xl2 p-6 text-white bg-gradient-to-br ${meta.gradient} shadow-glowPurple overflow-hidden`}
                  >
                    <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
                    <p className="font-display font-bold text-lg">{slot.window}</p>
                    <p className="text-sm text-white/80 mt-1">{slot.deliveredBy}</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold">
                      <Banknote size={14} /> KSh {slot.fee}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
