import { products } from "../data/products.js";

const catCategoryToId = {
  Meals: "fast-food",
  Snacks: "snacks",
  Drinks: "drinks",
};

const fallbackImages = {
  Meals: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
  Snacks: "https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?w=500&q=80",
  Drinks: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80",
};

/* Manually map each catalogue item to the right product data */
const nameToProduct = {};
for (const p of products) {
  nameToProduct[p.name.toLowerCase()] = p;
}

function lookup(name) {
  const key = name.toLowerCase();
  if (nameToProduct[key]) return nameToProduct[key];
  if (key === "chips / fries" && nameToProduct["chips (french fries)"]) return nameToProduct["chips (french fries)"];
  if (key === "sausage" && nameToProduct["sausages"]) return nameToProduct["sausages"];
  if (key.startsWith("chapati +") && nameToProduct["chapati"]) return nameToProduct["chapati"];
  if (key.startsWith("ugali +") && nameToProduct["ugali & beef"]) return nameToProduct["ugali & beef"];
  if (key.startsWith("ugali ") && nameToProduct["ugali & beef"]) return nameToProduct["ugali & beef"];
  if (key.startsWith("rice +") && nameToProduct["rice & beef"]) return nameToProduct["rice & beef"];
  if (key.startsWith("mukimo ") && nameToProduct["mukimo"]) return nameToProduct["mukimo"];
  if (key === "beef stew" && nameToProduct["beef stew"]) return nameToProduct["beef stew"];
  if (key === "masala") return nameToProduct["rice & beef"];
  if (key.includes("loaded")) return nameToProduct["fried chicken"];
  if (key === "tea" && nameToProduct["tea leaves"]) return nameToProduct["tea leaves"];
  if (key.startsWith("juice") && nameToProduct["fresh juice"]) return nameToProduct["fresh juice"];
  if (key === "andazi") return nameToProduct["bread (loaf)"];
  return null;
}

export function buildMenuItems(catalogue) {
  return catalogue
    .filter((c) => c.enabled)
    .map((c) => {
      const product = lookup(c.name);
      return {
        id: c.id,
        name: c.name,
        category: catCategoryToId[c.category] || "fast-food",
        price: c.price,
        image: product?.image || fallbackImages[c.category] || fallbackImages.Meals,
        description: product?.description || `${c.name} — available on Loco Glovo.`,
        tags: product?.tags || [],
      };
    });
}

export function getAvailableCategories(catalogue) {
  const ids = new Set(catalogue.filter((c) => c.enabled).map((c) => catCategoryToId[c.category] || "fast-food"));
  return ids;
}
