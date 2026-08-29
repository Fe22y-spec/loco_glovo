import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "../../context/AdminContext.jsx";
import { DollarSign, Phone, Mail, Save, Lock, Plus, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminSettings() {
  const { settings, setSettings, catalogue, updateCatalogueItem, addCatalogueItem, removeCatalogueItem, updatePassword } = useAdmin();
  const [local, setLocal] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ newPass: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "Meals", price: "", image: "" });
  const [catFilter, setCatFilter] = useState("All");

  const categories = [...new Set(catalogue.map((c) => c.category))];

  const handleSave = () => {
    setSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    if (passwordForm.newPass.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordError("Passwords do not match.");
      return;
    }
    const { error } = await updatePassword({ password: passwordForm.newPass });
    if (error) {
      setPasswordError(error.message);
      return;
    }
    setPasswordSuccess(true);
    setPasswordForm({ current: "", newPass: "", confirm: "" });
  };

  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.price) return;
    addCatalogueItem({ name: newItem.name.trim(), category: newItem.category, price: Number(newItem.price), image: newItem.image.trim() || null });
    setNewItem({ name: "", category: "Meals", price: "", image: "" });
  };

  const filteredCatalogue = catFilter === "All" ? catalogue : catalogue.filter((c) => c.category === catFilter);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-ink dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage delivery fees, product catalogue, contact info, and account settings.</p>
      </div>

      {/* Delivery Fee */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl2 shadow-card p-6"
      >
        <h3 className="font-display font-bold text-base text-ink dark:text-white mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-vibrantOrange" /> Delivery Fee
        </h3>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 focus-within:ring-2 focus-within:ring-vibrantOrange">
          <span className="text-sm font-semibold text-gray-500">KSh</span>
          <input type="number" value={local.deliveryFee}
            onChange={(e) => setLocal((f) => ({ ...f, deliveryFee: Number(e.target.value) }))}
            className="w-full bg-transparent outline-none text-sm text-ink dark:text-white"
          />
        </div>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-xl2 shadow-card p-6"
      >
        <h3 className="font-display font-bold text-base text-ink dark:text-white mb-4 flex items-center gap-2">
          <Phone size={16} className="text-vibrantOrange" /> Contact Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 focus-within:ring-2 focus-within:ring-vibrantOrange">
            <Phone size={16} className="text-royalPurple dark:text-vibrantOrange shrink-0" />
            <input type="text" value={local.contactPhone}
              onChange={(e) => setLocal((f) => ({ ...f, contactPhone: e.target.value }))}
              className="w-full bg-transparent outline-none text-sm text-ink dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 focus-within:ring-2 focus-within:ring-vibrantOrange">
            <Mail size={16} className="text-royalPurple dark:text-vibrantOrange shrink-0" />
            <input type="email" value={local.contactEmail}
              onChange={(e) => setLocal((f) => ({ ...f, contactEmail: e.target.value }))}
              className="w-full bg-transparent outline-none text-sm text-ink dark:text-white"
            />
          </div>
        </div>
      </motion.div>

      {/* Product Catalogue Management */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl2 shadow-card p-6"
      >
        <h3 className="font-display font-bold text-base text-ink dark:text-white mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-vibrantOrange" /> Product Catalogue
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Manage product prices, add new items, or remove items. Changes take effect immediately on the customer website.
        </p>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-3">
          {["All", ...categories].map((cat) => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className={`shrink-0 rounded-full px-3 py-2 sm:py-1 text-[10px] font-semibold transition-colors min-h-[44px] sm:min-h-0 ${
                catFilter === cat
                  ? "bg-brand-gradient text-white"
                  : "bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10"
              }`}
            >{cat}</button>
          ))}
        </div>

        {/* Catalogue items */}
        <div className="space-y-1.5 max-h-96 overflow-y-auto">
          {filteredCatalogue.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-lg bg-white/50 dark:bg-white/5 px-3 py-2">
              <button onClick={() => updateCatalogueItem(item.id, { enabled: !item.enabled })}
                className={`shrink-0 h-8 sm:h-7 w-8 sm:w-7 grid place-items-center rounded-full ${
                  item.enabled ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                }`}
                title={item.enabled ? "Disable" : "Enable"}
              >
                {item.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {item.image && (
                <img src={item.image} alt="" className="h-8 w-8 rounded object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${item.enabled ? "text-ink dark:text-white" : "text-gray-400 dark:text-gray-500 line-through"}`}>
                  {item.name}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{item.category}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-500">KSh</span>
                <input type="number" value={item.price}
                  onChange={(e) => updateCatalogueItem(item.id, { price: Number(e.target.value) })}
                  className="w-14 sm:w-16 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-1.5 sm:px-2 py-1 text-xs text-ink dark:text-white outline-none focus:ring-1 focus:ring-vibrantOrange"
                />
                <button onClick={() => removeCatalogueItem(item.id)}
                  className="h-8 sm:h-7 w-8 sm:w-7 grid place-items-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50"
                  title="Remove"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add new item */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
          <h4 className="text-xs font-semibold text-ink dark:text-white mb-3">Add New Item</h4>
          <div className="flex flex-wrap gap-2">
            <input type="text" value={newItem.name} placeholder="Item name"
              onChange={(e) => setNewItem((f) => ({ ...f, name: e.target.value }))}
              className="flex-1 min-w-[120px] sm:min-w-[140px] rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm text-ink dark:text-white placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-vibrantOrange"
            />
            <select value={newItem.category}
              onChange={(e) => setNewItem((f) => ({ ...f, category: e.target.value }))}
              className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm text-ink dark:text-white outline-none focus:ring-1 focus:ring-vibrantOrange"
            >
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <div className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2">
              <span className="text-xs text-gray-500">KSh</span>
              <input type="number" value={newItem.price} placeholder="Price"
                onChange={(e) => setNewItem((f) => ({ ...f, price: e.target.value }))}
                className="w-14 sm:w-16 bg-transparent outline-none text-sm text-ink dark:text-white"
              />
            </div>
            <input type="text" value={newItem.image} placeholder="Image URL (optional)"
              onChange={(e) => setNewItem((f) => ({ ...f, image: e.target.value }))}
              className="flex-1 min-w-[180px] rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm text-ink dark:text-white placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-vibrantOrange"
            />
            <button onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient text-white text-xs font-semibold px-4 py-2.5 sm:py-2 hover:shadow-glowOrange transition-shadow min-h-[44px] sm:min-h-0"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-xl2 shadow-card p-6"
      >
        <h3 className="font-display font-bold text-base text-ink dark:text-white mb-4 flex items-center gap-2">
          <Lock size={16} className="text-vibrantOrange" /> Change Password
        </h3>
          <form onSubmit={handlePasswordChange} className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 focus-within:ring-2 focus-within:ring-vibrantOrange">
            <Lock size={16} className="text-royalPurple dark:text-vibrantOrange shrink-0" />
            <input type="password" value={passwordForm.newPass} onChange={(e) => setPasswordForm((f) => ({ ...f, newPass: e.target.value }))} placeholder="New password" required className="w-full bg-transparent outline-none text-sm text-ink dark:text-white placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 focus-within:ring-2 focus-within:ring-vibrantOrange">
            <Lock size={16} className="text-royalPurple dark:text-vibrantOrange shrink-0" />
            <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))} placeholder="Confirm new password" required className="w-full bg-transparent outline-none text-sm text-ink dark:text-white placeholder:text-gray-400" />
          </div>
          {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
          {passwordSuccess && <p className="text-xs text-green-500">Password changed successfully.</p>}
          <button type="submit" className="rounded-full bg-brand-gradient text-white text-xs font-semibold px-4 py-2.5 sm:py-2 hover:shadow-glowOrange transition-shadow min-h-[44px] sm:min-h-0">Update Password</button>
        </form>
      </motion.div>

      {/* Save Button */}
        <div className="text-center">
        <button onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-brand-gradient text-white font-display font-semibold px-8 py-3 shadow-glowPurple hover:shadow-glowOrange transition-all min-h-[44px] sm:min-h-0"
        >
          <Save size={16} /> {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
