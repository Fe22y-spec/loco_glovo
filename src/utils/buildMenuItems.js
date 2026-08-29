import { products } from "../data/products.js";

const catCategoryToId = {
  Meals: "fast-food",
  Snacks: "snacks",
  Drinks: "drinks",
};

const nameToProduct = {};
for (const p of products) {
  nameToProduct[p.name.toLowerCase()] = p;
}

const exactMap = {
  "pilau": "pilau",
  "pilau beef": "pilau",
  "chapati + beans": "chapati",
  "chapati + ndengu": "chapati",
  "chapati + kamande": "chapati",
  "chapati + miji": "chapati",
  "ugali + beef": "ugali & beef",
  "ugali + matumbo": "matumbo",
  "ugali + greens": "ugali & beef",
  "ugali + cabbage": "ugali & beef",
  "rice + beef": "rice & beef",
  "rice + beans": "rice & beef",
  "rice + ndengu": "rice & beef",
  "rice + kamande": "rice & beef",
  "rice + miji": "rice & beef",
  "mukimo plain": "mukimo",
  "mukimo + beef": "mukimo",
  "mukimo + stew": "mukimo",
  "chips / fries": "chips (french fries)",
  "smokie": "smokie",
  "sausage": "sausages",
  "chapati": "chapati",
  "andazi": null,
  "tea": "tea leaves",
  "juice (small)": "fresh juice",
  "juice (large)": "fresh juice",
};

const customImages = {
  "andazi": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80",
  "pilau beef": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80",
  "ugali plain": "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&q=80",
  "ugali + matumbo": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&q=80",
  "beef stew": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80",
  "mukimo plain": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=80",
  "mukimo + beef": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=80",
  "mukimo + stew": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=80",
  "chicken loaded": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&q=80",
  "beef loaded": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&q=80",
  "pork loaded": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80",
  "masala": "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80",
  "sausage": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&q=80",
  "smokie": "https://images.unsplash.com/photo-1654632171633-6b0d3048a360?w=500&q=80",
  "chapati": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80",
  "chapati + beans": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80",
  "chapati + ndengu": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80",
  "chapati + kamande": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80",
  "chapati + miji": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80",
  "rice + beef": "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80",
  "rice + beans": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80",
  "rice + ndengu": "https://images.unsplash.com/photo-1536304929836-ee1ca7d449d4?w=500&q=80",
  "rice + kamande": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80",
  "rice + miji": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80",
};

const customDescriptions = {
  "andazi": "Soft fluffy African-style doughnuts, lightly sweetened and fried golden.",
  "pilau beef": "Fragrant spiced pilau rice with tender beef pieces.",
  "ugali plain": "Firm white ugali, the classic Kenyan staple served on its own.",
  "chapati + beans": "Soft layered chapati served with warm cooked beans.",
  "chapati + ndengu": "Chapati paired with nutritious green grams.",
  "chapati + kamande": "Chapati served with boiled maize and beans mix.",
  "chapati + miji": "Chapati accompanied by mixed traditional vegetables.",
  "ugali + beef": "Ugali served with savoury beef stew.",
  "ugali + matumbo": "Ugali accompanied by tender tripe in rich spices.",
  "ugali + greens": "Ugali paired with fresh cooked greens.",
  "ugali + cabbage": "Ugali served with lightly fried cabbage.",
  "beef stew": "Hearty beef stew cooked with onions, potatoes and aromatic spices.",
  "rice + beef": "Fluffy white rice served with tender beef stew.",
  "rice + beans": "White rice paired with warm cooked beans.",
  "rice + ndengu": "Rice served with nutritious green grams.",
  "rice + kamande": "Rice accompanied by boiled maize and beans.",
  "rice + miji": "Rice with mixed traditional vegetables.",
  "mukimo plain": "Mashed potatoes with greens, maize and pumpkin leaves.",
  "mukimo + beef": "Mukimo served with beef stew.",
  "mukimo + stew": "Mukimo accompanied by savoury meat stew.",
  "chicken loaded": "Loaded chicken platter with fries, salad and all the fixings.",
  "beef loaded": "Loaded beef platter with fries, salad and all the fixings.",
  "pork loaded": "Loaded pork platter with fries, salad and all the fixings.",
  "masala": "Aromatic spiced dish served with rice or chapati.",
};

const fallbackImages = {
  Meals: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
  Snacks: "https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?w=500&q=80",
  Drinks: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80",
};

function lookup(name) {
  const key = name.toLowerCase().trim();
  const mappedKey = exactMap[key];
  if (mappedKey === null) return null;
  if (mappedKey && nameToProduct[mappedKey]) return nameToProduct[mappedKey];
  if (nameToProduct[key]) return nameToProduct[key];
  return null;
}

export function buildMenuItems(catalogue) {
  return catalogue
    .filter((c) => c.enabled)
    .map((c) => {
      const key = c.name.toLowerCase().trim();
      const product = lookup(c.name);
      return {
        id: c.id,
        name: c.name,
        category: catCategoryToId[c.category] || "fast-food",
        price: c.price,
        image: customImages[key] || product?.image || fallbackImages[c.category] || fallbackImages.Meals,
        description: customDescriptions[key] || product?.description || `${c.name} — available on Loco Glovo.`,
        tags: product?.tags || [],
      };
    });
}

export function getAvailableCategories(catalogue) {
  const ids = new Set(catalogue.filter((c) => c.enabled).map((c) => catCategoryToId[c.category] || "fast-food"));
  return ids;
}
