import React from "react";
import { categories } from "../../data/categories.js";
import CategoryCard from "./CategoryCard.jsx";
import SectionHeading from "../common/SectionHeading.jsx";

export default function Categories({ activeCategory, onSelectCategory }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <SectionHeading
        eyebrow="Browse"
        title="What do you need today?"
        subtitle="Tap a category to filter the menu below — or clear it to see everything."
      />
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 sm:grid sm:grid-cols-4 lg:grid-cols-8 sm:overflow-visible">
        {categories.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            index={i}
            active={activeCategory === cat.id}
            onClick={() => onSelectCategory(activeCategory === cat.id ? null : cat.id)}
          />
        ))}
      </div>
    </section>
  );
}
