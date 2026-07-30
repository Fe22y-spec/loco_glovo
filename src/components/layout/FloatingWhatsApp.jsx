import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/254763377229"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed z-40 bottom-24 md:bottom-6 right-4 sm:right-6 h-14 w-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-lg shadow-[#25D366]/40"
    >
      <MessageCircle size={26} fill="white" className="text-[#25D366]" />
    </motion.a>
  );
}
