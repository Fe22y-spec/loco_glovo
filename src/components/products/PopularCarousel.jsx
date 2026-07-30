import React, { useMemo } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { buildMenuItems } from "../../utils/buildMenuItems.js";
import ProductCard from "./ProductCard.jsx";
import SectionHeading from "../common/SectionHeading.jsx";

export default function PopularCarousel({ onAddToOrder }) {
  const { catalogue } = useAdmin();
  const items = useMemo(() => buildMenuItems(catalogue), [catalogue]);
  const popular = items.slice(0, 10);

  if (popular.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <SectionHeading eyebrow="Trending" title="Popular Right Now" />
      <div className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar pb-4 snap-x">
        {popular.map((p, i) => (
          <div key={p.id} className="min-w-[200px] sm:min-w-[240px] lg:min-w-[260px] snap-start">
            <ProductCard product={p} index={i} onAddToOrder={onAddToOrder} />
          </div>
        ))}
      </div>
    </section>
  );
}
