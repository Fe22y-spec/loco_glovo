import React from "react";
import { Home, UtensilsCrossed, Tag, Clock } from "lucide-react";

const items = [
  { label: "Home", href: "#home", icon: Home },
  { label: "Menu", href: "#menu", icon: UtensilsCrossed },
  { label: "Offers", href: "#offers", icon: Tag },
  { label: "Times", href: "#delivery-rates", icon: Clock },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-dark border-t border-white/10 pb-safe">
      <ul className="flex items-center justify-around py-1">
        {items.map(({ label, href, icon: Icon }) => (
          <li key={href}>
            <a
              href={href}
              className="flex flex-col items-center gap-0.5 px-2 py-2 text-white/80 hover:text-brightGold text-[10px] font-medium min-w-[64px]"
            >
              <Icon size={20} />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
