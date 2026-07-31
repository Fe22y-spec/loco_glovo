import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useAdmin } from "../../context/AdminContext.jsx";

export default function ProductCard({ product, index = 0, onAddToOrder }) {
  const [qty, setQty] = useState(1);
  const { getCatalogueItem } = useAdmin();
  const catItem = getCatalogueItem(product.name);
  const price = catItem?.price;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 8) * 0.05 }}
      whileHover={{ y: -8 }}
      className="glow-card glass shadow-card rounded-xl2 overflow-hidden flex flex-col"
    >
      <div className="relative h-32 sm:h-40 overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-sm sm:text-base text-ink dark:text-white leading-tight">
          {product.name}
        </h3>
        {price != null && (
          <p className="mt-1 text-sm font-bold text-vibrantOrange">KSh {price}</p>
        )}
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-3 flex items-center gap-2 sm:gap-3">
          <div className="flex items-center rounded-full border border-gray-200 dark:border-white/20 bg-white/70 dark:bg-white/5">
            <button
              type="button"
              onClick={() => setQty((v) => Math.max(1, v - 1))}
              className="h-9 sm:h-8 w-9 sm:w-8 grid place-items-center text-ink dark:text-white hover:text-vibrantOrange"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-[24px] text-center text-sm font-semibold text-ink dark:text-white">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((v) => v + 1)}
              className="h-9 sm:h-8 w-9 sm:w-8 grid place-items-center text-ink dark:text-white hover:text-vibrantOrange"
            >
              <Plus size={14} />
            </button>
          </div>

          <motion.button
            onClick={() => {
              onAddToOrder?.(product.name, qty, price);
              setQty(1);
            }}
            whileTap={{ scale: 0.95 }}
            className="btn-ripple relative flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-gradient text-white text-xs font-semibold py-2.5 sm:py-2 shadow-glowPurple hover:shadow-glowOrange transition-shadow min-h-[44px] sm:min-h-0"
          >
            <ShoppingCart size={13} /> Add
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
