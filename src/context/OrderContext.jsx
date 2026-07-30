import React, { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const OrderContext = createContext(null);

const defaultDetails = {
  hostel: "", // "Qwetu" | "Qejani"
  floor: "",
  room: "",
  phone: "",
  customerName: "",
  onboarded: false, // has the residence + details modal flow been completed
};

export function OrderProvider({ children }) {
  const [details, setDetails] = useLocalStorage("locoglovo:orderDetails", defaultDetails);
  const [deliverySlot, setDeliverySlot] = useLocalStorage("locoglovo:deliverySlot", null);
  const [activeOrder, setActiveOrder] = useLocalStorage("locoglovo:activeOrder", null);

  const setHostel = (hostel) => setDetails((d) => ({ ...d, hostel }));

  const setDeliveryDetails = (partial) =>
    setDetails((d) => ({ ...d, ...partial, onboarded: true }));

  const resetOnboarding = () => setDetails(defaultDetails);

  const buildOrderPayload = (items, deliveryFee, total) => ({
    customerName: details.customerName || "",
    phone: details.phone || "",
    hostel: details.hostel || "",
    floor: details.floor || "",
    room: details.room || "",
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
    deliverySlot: deliverySlot ? `${deliverySlot.window} (${deliverySlot.deliveredBy})` : "",
    deliveryFee,
    total,
    paymentStatus: "Paid",
  });

  const value = {
    details,
    setHostel,
    setDeliveryDetails,
    resetOnboarding,
    deliverySlot,
    setDeliverySlot,
    activeOrder,
    setActiveOrder,
    buildOrderPayload,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}
