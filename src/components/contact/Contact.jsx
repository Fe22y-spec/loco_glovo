import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Instagram, MapPin } from "lucide-react";
import SectionHeading from "../common/SectionHeading.jsx";

const actions = [
  {
    label: "WhatsApp Us",
    icon: MessageCircle,
    href: "https://wa.me/254763377229",
    gradient: "from-[#25D366] to-[#128C7E]",
  },
  {
    label: "Call Us",
    icon: Phone,
    href: "tel:+254763377229",
    gradient: "from-royalPurple to-deepPurple",
  },
  {
    label: "Instagram",
    icon: Instagram,
    href: "#",
    gradient: "from-pink-500 to-vibrantOrange",
  },
  {
    label: "TikTok",
    icon: null,
    href: "#",
    gradient: "from-ink to-royalPurple",
    emoji: "🎵",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <SectionHeading
        eyebrow="Get In Touch"
        title="We're a Message Away"
        subtitle="Questions about an order, a slot, or just want to chat? Reach us however's easiest."
        align="center"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
        {actions.map((a, i) => (
          <motion.a
            key={a.label}
            href={a.href}
            target={a.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className={`flex flex-col items-center gap-2 rounded-2xl p-5 text-white bg-gradient-to-br ${a.gradient} shadow-card`}
          >
            {a.icon ? <a.icon size={22} /> : <span className="text-xl">{a.emoji}</span>}
            <span className="text-xs font-display font-semibold text-center">{a.label}</span>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400"
      >
        <MapPin size={16} className="text-vibrantOrange" />
        Serving Qwetu & Qejani hostels only
      </motion.div>
    </section>
  );
}
