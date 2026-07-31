import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Menu as MenuIcon, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

const links = [
  { label: "Home", href: "#home" },
  { label: "Order", href: "#place-order" },
  { label: "Menu", href: "#menu" },
  { label: "Offers", href: "#offers" },
  { label: "Order Times", href: "#delivery-rates" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.classList.toggle("nav-open", mobileOpen);
    return () => document.body.classList.remove("nav-open");
  }, [mobileOpen]);

  // Close mobile menu on resize past md breakpoint
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-dark shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 shrink-0">
          <img src="/logo.svg" alt="LocoGlovo" className="h-7 w-auto" />
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled ? "text-white/90 hover:text-brightGold" : "text-ink dark:text-white hover:text-vibrantOrange"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className={`grid place-items-center h-10 sm:h-9 w-10 sm:w-9 rounded-full transition-colors ${
               scrolled ? "bg-white/10 text-white" : "bg-white/70 dark:bg-white/10 text-ink dark:text-white"
             }`}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            className={`md:hidden grid place-items-center h-10 sm:h-9 w-10 sm:w-9 rounded-full ${
               scrolled ? "bg-white/10 text-white" : "bg-white/70 dark:bg-white/10 text-ink dark:text-white"
             }`}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={17} /> : <MenuIcon size={17} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <>
          {/* Backdrop for closing */}
          <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)} />
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden relative z-50 glass-dark px-6 pb-6 pt-2 flex flex-col gap-1"
          >
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-sm font-medium text-white/90 hover:text-brightGold active:text-brightGold min-h-[44px] flex items-center"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        </>
      )}
    </header>
  );
}
