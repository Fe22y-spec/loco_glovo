import React from "react";
import { motion } from "framer-motion";
import { Percent, Clock3 } from "lucide-react";

const offers = [
  {
    title: "Free Delivery Fridays",
    desc: "Order before 2 PM every Friday and skip the delivery fee.",
    badge: "FREE DELIVERY",
    icon: Clock3,
  },
  {
    title: "Combo Deal",
    desc: "Any burger + drink combo for KSh 50 off.",
    badge: "-KSh 50",
    icon: Percent,
  },
  {
    title: "First Order Discount",
    desc: "New here? Get 10% off your very first LocoGlovo order.",
    badge: "10% OFF",
    icon: Percent,
  },
];

export default function OffersBanner() {
  return (
    <section id="offers" className="relative py-16 bg-gradient-to-br from-royalPurple to-deepPurple overflow-hidden">
      <div className="absolute -top-10 right-10 w-72 h-72 bg-vibrantOrange/30 rounded-full blur-3xl animate-blob" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-brightGold mb-2">
            Today's Special
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Deals Worth Ordering For
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="relative glass rounded-xl2 p-6 shadow-glowGold overflow-hidden"
            >
              <span className="absolute top-4 right-4 rounded-full bg-gold-gradient text-ink text-[10px] font-bold px-2.5 py-1">
                {offer.badge}
              </span>
              <offer.icon size={26} className="text-brightGold mb-4" />
              <h3 className="font-display font-semibold text-white text-lg">{offer.title}</h3>
              <p className="mt-2 text-sm text-white/75">{offer.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
