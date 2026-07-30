import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "../../data/products.js";
import { useAdmin } from "../../context/AdminContext.jsx";
import { buildMenuItems } from "../../utils/buildMenuItems.js";
import ProductCard from "./ProductCard.jsx";
import SearchBar from "./SearchBar.jsx";
import EstimatedDelivery from "./EstimatedDelivery.jsx";
import SectionHeading from "../common/SectionHeading.jsx";
import { CardSkeleton } from "../common/Skeleton.jsx";
import RippleButton from "../common/RippleButton.jsx";

export default function ProductGrid({ activeCategory, searchTerm, setSearchTerm, onRequestItem, onAddToOrder }) {
  const [loading, setLoading] = useState(true);
  const { catalogue } = useAdmin();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const menuItems = useMemo(() => buildMenuItems(catalogue), [catalogue]);

  const filtered = useMemo(() => {
    return menuItems.filter((p) => {
      const matchesCategory = !activeCategory || p.category === activeCategory;
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchTerm]);

  return (
    <section id="menu" className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <SectionHeading eyebrow="Order Now" title="Full Menu" align="center" />

      <div className="flex flex-col items-center gap-4 mb-10">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <EstimatedDelivery />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onAddToOrder={onAddToOrder} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-display font-semibold text-lg text-ink dark:text-white">
            We couldn't find that item, but Loco Glovo can still try to get it for you.
          </p>
          <p className="text-sm text-gray-500 mt-1">Try another search or clear the filter.</p>
          <RippleButton
            onClick={() => onRequestItem?.(searchTerm)}
            className="mt-6 justify-center"
          >
            Request Item
          </RippleButton>
        </div>
      )}
    </section>
  );
}
