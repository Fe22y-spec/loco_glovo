import React from "react";
import { Link } from "react-router-dom";
import { Instagram, MessageCircle, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-ink text-white pt-16 pb-28 md:pb-10 overflow-hidden">
      <div className="absolute -top-20 left-1/4 w-72 h-72 bg-royalPurple/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-vibrantOrange/20 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <img src="/logo.svg" alt="LocoGlovo" className="h-8 w-auto mb-4" />
          <p className="text-sm text-white/70 max-w-xs">
            Anything. Anywhere. We Deliver. Fast delivery built exclusively for Qwetu & Qejani
            residents.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4 text-brightGold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><a href="#home" className="hover:text-white">Home</a></li>
            <li><a href="#menu" className="hover:text-white">Menu</a></li>
            <li><a href="#offers" className="hover:text-white">Offers</a></li>
            <li><a href="#delivery-rates" className="hover:text-white">Order Times</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4 text-brightGold">Contact</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2"><Phone size={15} /> +254 763 377 229</li>
            <li className="flex items-center gap-2"><MessageCircle size={15} /> <a href="https://wa.me/254763377229" target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp us</a></li>
            <li className="flex items-center gap-2"><MapPin size={15} /> Qwetu & Qejani Hostels</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4 text-brightGold">Follow Us</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-vibrantOrange transition-colors">
              <Instagram size={17} />
            </a>
            <a href="#" aria-label="TikTok" className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-vibrantOrange transition-colors">
              <TikTokIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="relative mt-12 pt-6 border-t border-white/10 mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
        <p>© {year} LocoGlovo. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/admin/login" className="hover:text-white/80 transition-colors">Admin</Link>
          <p className="font-display text-brightGold">Anything. Anywhere. We Deliver.</p>
        </div>
      </div>
    </footer>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.6h-3.15v13.9c0 1.62-1.32 2.93-2.93 2.93a2.93 2.93 0 1 1 0-5.86c.28 0 .55.04.8.11V9.9a6.1 6.1 0 0 0-.8-.05A6.13 6.13 0 0 0 3 16a6.13 6.13 0 0 0 6.12 6.12A6.13 6.13 0 0 0 15.24 16V9.01a9.3 9.3 0 0 0 5.4 1.73V7.6a5.7 5.7 0 0 1-4.04-1.78Z" />
    </svg>
  );
}
