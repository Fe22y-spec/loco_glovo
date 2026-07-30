import React, { useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import BottomNav from "./components/layout/BottomNav.jsx";
import FloatingWhatsApp from "./components/layout/FloatingWhatsApp.jsx";

import Hero from "./components/hero/Hero.jsx";
import Categories from "./components/categories/Categories.jsx";
import PopularCarousel from "./components/products/PopularCarousel.jsx";
import ProductGrid from "./components/products/ProductGrid.jsx";
import FrequentlyOrdered from "./components/products/FrequentlyOrdered.jsx";
import OffersBanner from "./components/offers/OffersBanner.jsx";
import DeliveryRates from "./components/delivery/DeliveryRates.jsx";
import Contact from "./components/contact/Contact.jsx";
import RequestSection from "./components/request/RequestSection.jsx";
import RequestItemModal from "./components/request/RequestItemModal.jsx";
import ManualOrderSection from "./components/order/ManualOrderSection.jsx";
import AdminLogin from "./components/admin/AdminLogin.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AdminOrders from "./components/admin/AdminOrders.jsx";
import OrderDetail from "./components/admin/OrderDetail.jsx";
import AdminSettings from "./components/admin/AdminSettings.jsx";
import { useOrder } from "./context/OrderContext.jsx";
import { useAdmin } from "./context/AdminContext.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdmin();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}

function CustomerPage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestItem, setRequestItem] = useState("");
  const [orderItems, setOrderItems] = useState("");
  const [catalogueItems, setCatalogueItems] = useState([]);

  const handleHeroSearch = (q) => {
    setSearchTerm(q || "");
    setActiveCategory(null);
  };

  const handleRequestItem = useCallback((item) => {
    setRequestItem(item || "");
    setRequestOpen(true);
  }, []);

  const addToOrder = useCallback((name, qty = 1, unitPrice = null) => {
    if (unitPrice != null) {
      setCatalogueItems((prev) => {
        const existing = prev.find((c) => c.name === name);
        if (existing) {
          return prev.map((c) =>
            c.name === name ? { ...c, quantity: c.quantity + qty } : c
          );
        }
        return [...prev, { name, quantity: qty, unitPrice, catalogueId: name }];
      });
    }
  }, []);

  const removeCatalogueItem = useCallback((name) => {
    setCatalogueItems((prev) => prev.filter((c) => c.name !== name));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Hero onSearch={handleHeroSearch} />
        <ManualOrderSection
          orderItems={orderItems}
          setOrderItems={setOrderItems}
          catalogueItems={catalogueItems}
          setCatalogueItems={setCatalogueItems}
          onRemoveCatalogueItem={removeCatalogueItem}
        />
        <Categories activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
        <PopularCarousel onAddToOrder={addToOrder} />
        <ProductGrid
          activeCategory={activeCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRequestItem={handleRequestItem}
          onAddToOrder={addToOrder}
        />
        <FrequentlyOrdered onRequestItem={handleRequestItem} />
        <OffersBanner />
        <RequestSection onRequest={handleRequestItem} />
        <DeliveryRates />
        <Contact />
      </main>

      <Footer />
      <BottomNav />
      <FloatingWhatsApp />

      <RequestItemModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        initialItem={requestItem}
      />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <AdminLayout><AdminOrders /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute>
            <AdminLayout><OrderDetail /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <AdminLayout><AdminSettings /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
