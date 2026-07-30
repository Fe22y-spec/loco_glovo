import React from "react";
import { motion } from "framer-motion";
import { Bike, Search } from "lucide-react";
import FloatingIcons from "./FloatingIcons.jsx";
import ScooterIllustration from "./ScooterIllustration.jsx";
import AnimatedCounter from "./AnimatedCounter.jsx";
import RippleButton from "../common/RippleButton.jsx";

export default function Hero({ onSearch }) {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 overflow-hidden bg-brand-gradient"
    >
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 opacity-70" aria-hidden="true">
        <div className="absolute top-10 -left-10 w-72 h-72 bg-vibrantOrange/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brightGold/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
      </div>

      <FloatingIcons />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/30 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <Bike size={14} /> Exclusively for Qwetu & Qejani residents
          </span>

          <h1 className="mt-6 font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-white">
            Anything. Anywhere.
            <br />
            <span className="bg-gold-gradient bg-clip-text text-transparent">We Deliver.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/85 max-w-lg">
            Food, groceries, shopping, gifts and literally anything delivered directly to your
            room — no queues, no stress.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.target).get("q");
              onSearch?.(q);
              document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-8 flex items-center gap-2 rounded-full glass p-2 max-w-md"
          >
            <Search size={18} className="ml-2 text-white/80" />
            <input
              name="q"
              placeholder="Search for food, drinks, errands…"
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/60 py-2"
            />
            <RippleButton type="submit" className="!px-5 !py-2 text-sm">
              Search
            </RippleButton>
          </form>

          <div className="mt-10 flex items-center gap-8">
            <AnimatedCounter value={2400} suffix="+" label="Orders Delivered" />
            <AnimatedCounter value={25} suffix=" min" label="Avg. Delivery" />
            <AnimatedCounter value={4.9} suffix="★" label="Resident Rating" />
          </div>
        </motion.div>

        <ScooterIllustration />
      </div>
    </section>
  );
}
