import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase.js";
import { defaultCatalogue } from "../data/catalogue.js";

const AdminContext = createContext(null);

function generateId() {
  return `LG-${Date.now().toString().slice(-5)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

function loadLocal(key, fallback) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}

/* ─── DB <-> App data mappers ─── */

function orderFromRow(row) {
  return {
    id: row.order_id,
    customer: { name: row.customer_name, phone: row.customer_phone },
    delivery: {
      residence: row.delivery_residence,
      block: row.delivery_block,
      room: row.delivery_room,
      time: row.delivery_time,
      instructions: row.delivery_instructions,
    },
    order: { items: row.custom_items || "", specialInstructions: row.special_instructions || "" },
    catalogueItems: row.catalogue_items || [],
    customItems: row.custom_items || "",
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    grandTotal: row.grand_total,
    orderType: row.order_type,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    transactionRef: row.transaction_ref,
    status: row.status,
    timeline: row.timeline || [],
    customPricing: row.custom_pricing,
    adminNotes: row.admin_notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    _uuid: row.id,
  };
}

function rowFromOrder(o) {
  return {
    order_id: o.id,
    customer_name: o.customer?.name || "",
    customer_phone: o.customer?.phone || "",
    delivery_residence: o.delivery?.residence || "",
    delivery_block: o.delivery?.block || "",
    delivery_room: o.delivery?.room || "",
    delivery_time: o.delivery?.time || "",
    delivery_instructions: o.delivery?.instructions || "",
    catalogue_items: o.catalogueItems || [],
    custom_items: o.customItems || "",
    special_instructions: o.order?.specialInstructions || "",
    subtotal: o.subtotal || 0,
    delivery_fee: o.deliveryFee || 0,
    grand_total: o.grandTotal || 0,
    order_type: o.orderType || "Standard",
    payment_status: o.paymentStatus || "Awaiting Pricing",
    payment_method: o.paymentMethod || null,
    transaction_ref: o.transactionRef || null,
    status: o.status || "Awaiting Pricing",
    timeline: o.timeline || [],
    custom_pricing: o.customPricing || null,
    admin_notes: o.adminNotes || "",
    updated_at: new Date().toISOString(),
  };
}

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [orders, setOrders] = useState(() => loadLocal("locoglovo:orders", []));
  const [catalogue, setCatalogue] = useState(() => loadLocal("locoglovo:catalogue", defaultCatalogue));
  const [settings, setSettings] = useState(() => loadLocal("locoglovo:adminSettings", { deliveryFee: 50, contactPhone: "+254 763 377 229", contactEmail: "hello@locoglovo.co.ke" }));
  const [loading, setLoading] = useState(true);

  /* ─── Persist to localStorage on changes (backup when Supabase unavailable) ─── */

  useEffect(() => { try { localStorage.setItem("locoglovo:orders", JSON.stringify(orders)); } catch {} }, [orders]);
  useEffect(() => { try { localStorage.setItem("locoglovo:catalogue", JSON.stringify(catalogue)); } catch {} }, [catalogue]);
  useEffect(() => { try { localStorage.setItem("locoglovo:adminSettings", JSON.stringify(settings)); } catch {} }, [settings]);

  /* ─── Initial fetch from Supabase ─── */

  useEffect(() => {
    const stored = localStorage.getItem("locoglovo:adminSession");
    if (stored) setAdmin(JSON.parse(stored));
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const catRes = await supabase.from("catalogue").select("*").order("name");
      if (catRes.data?.length) setCatalogue(catRes.data);
    } catch {}
    try {
      const ordersRes = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (ordersRes.data?.length) setOrders(ordersRes.data.map(orderFromRow));
    } catch {}
    try {
      const settingsRes = await supabase.from("admin_settings").select("*").eq("id", 1).single();
      if (settingsRes.data) {
        setSettings({
          deliveryFee: settingsRes.data.delivery_fee,
          contactPhone: settingsRes.data.contact_phone,
          contactEmail: settingsRes.data.contact_email,
        });
      }
    } catch {}
    setLoading(false);
  }

  /* ─── Auth ─── */

  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 min
  const MAX_LOGIN_ATTEMPTS = 3;
  const LOGIN_COOLDOWN = 15 * 1000; // 15 sec

  const [loginAttempts, setLoginAttempts] = useState(() => {
    const stored = loadLocal("locoglovo:loginAttempts", null);
    if (stored && Date.now() < stored.cooldownUntil) return stored;
    return { count: 0, cooldownUntil: 0 };
  });
  const [inactivityTimer, setInactivityTimer] = useState(null);

  /* Track user activity to reset inactivity timer */
  useEffect(() => {
    if (!admin) return;
    const reset = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      const t = setTimeout(() => { logout(); }, INACTIVITY_TIMEOUT);
      setInactivityTimer(t);
    };
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, [admin]);

  /* Supabase session listener */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAdmin({ email: session.user.email, name: "Admin", role: "superadmin", loggedInAt: session.user.created_at });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAdmin({ email: session.user.email, name: "Admin", role: "superadmin", loggedInAt: session.user.created_at });
      } else {
        setAdmin(null);
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  /* Persist login attempts for cooldown */
  useEffect(() => {
    try { localStorage.setItem("locoglovo:loginAttempts", JSON.stringify(loginAttempts)); } catch {}
  }, [loginAttempts]);

  const login = useCallback(async (email, password, captchaToken = null) => {
    if (loginAttempts.cooldownUntil > Date.now()) {
      const remaining = Math.ceil((loginAttempts.cooldownUntil - Date.now()) / 1000);
      throw new Error(`Too many attempts. Try again in ${remaining}s.`);
    }
    const options = captchaToken ? { captchaToken } : {};
    const { data, error } = await supabase.auth.signInWithPassword({ email, password }, options);
    console.log("Supabase login response:", { data, error });
    if (error) {
      const newCount = loginAttempts.count + 1;
      if (newCount >= MAX_LOGIN_ATTEMPTS) {
        setLoginAttempts({ count: 0, cooldownUntil: Date.now() + LOGIN_COOLDOWN });
      } else {
        setLoginAttempts((p) => ({ ...p, count: newCount }));
      }
      throw new Error(error.message || "Login failed");
    }
    setLoginAttempts({ count: 0, cooldownUntil: 0 });
    return true;
  }, [loginAttempts]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    if (inactivityTimer) clearTimeout(inactivityTimer);
  }, [inactivityTimer]);

  const isAuthenticated = admin !== null;

  const remainingCooldown = loginAttempts.cooldownUntil > Date.now()
    ? Math.ceil((loginAttempts.cooldownUntil - Date.now()) / 1000)
    : 0;

  /* ─── Catalogue helpers ─── */

  const getCatalogueItem = useCallback((name) => {
    const key = normalizeName(name);
    return catalogue.find((c) => c.enabled && normalizeName(c.name) === key) || null;
  }, [catalogue]);

  const matchCatalogueItems = useCallback((text) => {
    const lines = text.split(/[\n,]+/).map((l) => l.trim()).filter(Boolean);
    const matched = [];
    const unmatched = [];
    const usedIds = new Set();
    for (const line of lines) {
      const parts = line.match(/^(\d+)\s+(.+)/);
      const qty = parts ? parseInt(parts[1], 10) : 1;
      const itemName = parts ? parts[2].trim() : line;
      const item = getCatalogueItem(itemName);
      if (item && !usedIds.has(item.id)) {
        matched.push({ catalogueId: item.id, name: item.name, quantity: qty, unitPrice: item.price });
        usedIds.add(item.id);
      } else if (item && usedIds.has(item.id)) {
        const existing = matched.find((m) => m.catalogueId === item.id);
        if (existing) existing.quantity += qty;
      } else {
        unmatched.push(line);
      }
    }
    return { matched, unmatched };
  }, [getCatalogueItem]);

  /* ─── Orders ─── */

  const createOrder = useCallback(async (orderData) => {
    const isStandard = (orderData.orderType || "Standard") === "Standard";
    const timeline = isStandard
      ? [
          { status: "Order Submitted", timestamp: new Date().toISOString(), done: true },
          { status: "Payment Verified", timestamp: new Date().toISOString(), done: true },
          { status: "Accepted", timestamp: null, done: false },
          { status: "Shopping", timestamp: null, done: false },
          { status: "Out for Delivery", timestamp: null, done: false },
          { status: "Delivered", timestamp: null, done: false },
        ]
      : [
          { status: "Order Submitted", timestamp: new Date().toISOString(), done: true },
          { status: "Awaiting Pricing", timestamp: new Date().toISOString(), done: true },
          { status: "Priced", timestamp: null, done: false },
          { status: "Payment Verified", timestamp: null, done: false },
          { status: "Accepted", timestamp: null, done: false },
          { status: "Shopping", timestamp: null, done: false },
          { status: "Out for Delivery", timestamp: null, done: false },
          { status: "Delivered", timestamp: null, done: false },
        ];

    const orderId = generateId();
    const now = new Date().toISOString();
    const orderObj = {
      id: orderId,
      customer: orderData.customer,
      delivery: orderData.delivery,
      order: { items: orderData.customItems || "", specialInstructions: orderData.order?.specialInstructions || "" },
      catalogueItems: orderData.catalogueItems || [],
      customItems: orderData.customItems || "",
      subtotal: orderData.subtotal || 0,
      deliveryFee: orderData.deliveryFee || 0,
      grandTotal: orderData.grandTotal || 0,
      orderType: isStandard ? "Standard" : "Custom",
      paymentStatus: isStandard ? "Verified" : "Awaiting Pricing",
      paymentMethod: isStandard ? "M-Pesa" : null,
      transactionRef: isStandard ? `TXN${Date.now().toString().slice(-8)}` : null,
      status: isStandard ? "Pending" : "Awaiting Pricing",
      timeline,
      adminNotes: "",
      createdAt: now,
      updatedAt: now,
    };

    const row = rowFromOrder(orderObj);
    const { error } = await supabase.from("orders").insert(row).select().single();
    if (error) {
      console.error("Failed to create order", error);
      return null;
    }
    const inserted = orderFromRow({ ...row, id: row.order_id, created_at: now });
    setOrders((prev) => [inserted, ...prev]);
    return inserted;
  }, []);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    const prev = orders.find((o) => o.id === orderId);
    if (!prev) return;
    const timeline = prev.timeline.map((t) => {
      if (t.status === newStatus && !t.done) return { ...t, timestamp: new Date().toISOString(), done: true };
      return t;
    });
    const updates = { status: newStatus, timeline, updated_at: new Date().toISOString() };
    await supabase.from("orders").update(updates).eq("order_id", orderId);
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === orderId ? { ...o, status: newStatus, timeline, updatedAt: updates.updated_at } : o))
    );
  }, [orders]);

  const updateOrderNotes = useCallback(async (orderId, notes) => {
    const updates = { admin_notes: notes, updated_at: new Date().toISOString() };
    await supabase.from("orders").update(updates).eq("order_id", orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, adminNotes: notes, updatedAt: updates.updated_at } : o)));
  }, []);

  const getOrderById = useCallback((id) => orders.find((o) => o.id === id), [orders]);

  const priceCustomOrder = useCallback(async (orderId, pricedItems, totalPrice, deliveryFee) => {
    const customPricing = { items: pricedItems, totalPrice, deliveryFee, grandTotal: totalPrice + deliveryFee, pricedAt: new Date().toISOString() };
    const prev = orders.find((o) => o.id === orderId);
    const timeline = prev.timeline.map((t) => {
      if (t.status === "Priced" && !t.done) return { ...t, timestamp: new Date().toISOString(), done: true };
      return t;
    });
    const updates = { custom_pricing: customPricing, status: "Priced", timeline, updated_at: new Date().toISOString() };
    await supabase.from("orders").update(updates).eq("order_id", orderId);
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === orderId ? { ...o, customPricing, status: "Priced", timeline, updatedAt: updates.updated_at } : o))
    );
  }, [orders]);

  const verifyPayment = useCallback(async (orderId) => {
    const prev = orders.find((o) => o.id === orderId);
    const timeline = prev.timeline.map((t) => {
      if (t.status === "Payment Verified" && !t.done) return { ...t, timestamp: new Date().toISOString(), done: true };
      return t;
    });
    const updates = {
      payment_status: "Verified",
      payment_method: "M-Pesa",
      transaction_ref: `TXN${Date.now().toString().slice(-8)}`,
      status: "Pending",
      timeline,
      updated_at: new Date().toISOString(),
    };
    await supabase.from("orders").update(updates).eq("order_id", orderId);
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId
          ? { ...o, paymentStatus: "Verified", paymentMethod: "M-Pesa", transactionRef: updates.transaction_ref, status: "Pending", timeline, updatedAt: updates.updated_at }
          : o
      )
    );
  }, [orders]);

  /* ─── Stats ─── */

  const getStats = useCallback(() => {
    const today = new Date().toDateString();
    const verifiedOrders = orders.filter((o) => o.paymentStatus === "Verified");
    const todayOrders = verifiedOrders.filter((o) => new Date(o.createdAt).toDateString() === today);
    return {
      todayOrders: todayOrders.length,
      pending: verifiedOrders.filter((o) => o.status === "Pending").length,
      accepted: verifiedOrders.filter((o) => o.status === "Accepted").length,
      shopping: verifiedOrders.filter((o) => o.status === "Shopping").length,
      outForDelivery: verifiedOrders.filter((o) => o.status === "Out for Delivery").length,
      delivered: verifiedOrders.filter((o) => o.status === "Delivered").length,
      cancelled: verifiedOrders.filter((o) => o.status === "Cancelled").length,
      awaitingPricing: orders.filter((o) => o.status === "Awaiting Pricing").length,
      priced: orders.filter((o) => o.status === "Priced").length,
      total: orders.length,
    };
  }, [orders]);

  const getMostRequested = useCallback(() => {
    const counts = {};
    orders.filter((o) => o.paymentStatus === "Verified").forEach((o) => {
      (o.catalogueItems || []).forEach((item) => {
        const name = item.name.toLowerCase();
        counts[name] = (counts[name] || 0) + item.quantity;
      });
      const customText = (o.customItems || "").toLowerCase();
      customText.split(/[\n,]+/).forEach((w) => {
        const clean = w.trim().replace(/^\d+\s*/, "");
        if (clean.length > 2) counts[clean] = (counts[clean] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([item, count]) => ({ item, count }));
  }, [orders]);

  /* ─── Catalogue CRUD ─── */

  const updateCatalogueItem = useCallback(async (id, updates) => {
    const dbUpdates = {};
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.enabled !== undefined) dbUpdates.enabled = updates.enabled;
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    dbUpdates.updated_at = new Date().toISOString();
    await supabase.from("catalogue").update(dbUpdates).eq("id", id);
    setCatalogue((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const addCatalogueItem = useCallback(async (item) => {
    const newItem = { catalogue_id: `cat-${Date.now()}`, ...item, enabled: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const { data, error } = await supabase.from("catalogue").insert(newItem).select().single();
    if (error) { console.error("Failed to add catalogue item", error); return null; }
    setCatalogue((prev) => [...prev, data]);
    return data;
  }, []);

  const removeCatalogueItem = useCallback(async (id) => {
    await supabase.from("catalogue").delete().eq("id", id);
    setCatalogue((prev) => prev.filter((c) => c.id !== id));
  }, []);

  /* ─── Settings ─── */

  const setSettingsAndPersist = useCallback(async (newSettings) => {
    const db = {
      delivery_fee: newSettings.deliveryFee,
      contact_phone: newSettings.contactPhone,
      contact_email: newSettings.contactEmail,
      updated_at: new Date().toISOString(),
    };
    await supabase.from("admin_settings").update(db).eq("id", 1);
    setSettings(newSettings);
  }, []);

  /* ─── Context value ─── */

  const value = {
    admin, isAuthenticated, login, logout, updatePassword: supabase.auth.updateUser,
    orders, createOrder, updateOrderStatus, updateOrderNotes, getOrderById,
    getStats, getMostRequested, settings, setSettings: setSettingsAndPersist,
    catalogue, getCatalogueItem, matchCatalogueItems,
    updateCatalogueItem, addCatalogueItem, removeCatalogueItem,
    priceCustomOrder, verifyPayment, loading,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
