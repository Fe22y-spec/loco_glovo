import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-xl mx-auto">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search burgers, drinks, groceries…"
        className="w-full rounded-full glass shadow-card pl-11 pr-10 py-3.5 text-sm outline-none text-ink dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-vibrantOrange transition-shadow"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-vibrantOrange"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
