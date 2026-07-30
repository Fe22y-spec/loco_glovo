# LocoGlovo

Fast delivery, exclusively for Qwetu & Qejani hostel residents.
*Anything. Anywhere. We Deliver.*

A premium, animated React storefront: guest ordering (no login), category
browsing, live search, a cart with delivery-slot pricing, and a full
checkout flow that simulates an IntaSend M-Pesa payment end to end.

## Running it locally

You'll need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

## ⚠️ Before you ship this, do these two things

### 1. Swap in the real Qwetu / Qejani logos
No logo files were attached when this was built, so the residence-picker
modal currently uses placeholder badges. Replace these two files with the
real artwork (same filenames, any square-ish aspect ratio works):

```
public/qwetu-logo-placeholder.svg
public/qejani-logo-placeholder.svg
```

If you rename them, update the `logo` paths in
`src/components/modals/ResidenceModal.jsx`.

### 2. Connect a real backend for payments & orders
There's no backend yet — per spec, this repo only *prepares* the frontend.
Right now:
- `src/lib/intasend.js` **simulates** an IntaSend STK push (a 2.2s delay,
  ~92% simulated success rate). Replace `requestStkPush` with a real call
  to your backend, which should call IntaSend's API using your **secret**
  key server-side. Never put a secret key in frontend code — the STK push
  must be initiated from a server.
- Once payment succeeds, `CheckoutFlow.jsx` builds the exact order JSON
  from the spec and currently just logs it (`console.info("Order ready for
  backend:", ...)`) and stores it in `localStorage` via `OrderContext`.
  Swap that `console.info` line for a real `fetch("/api/orders", ...)` POST
  once the backend exists. The payload shape is:

```json
{
  "customerName": "",
  "phone": "",
  "hostel": "",
  "floor": "",
  "room": "",
  "items": [],
  "deliverySlot": "",
  "deliveryFee": 0,
  "total": 0,
  "paymentStatus": "Paid"
}
```

## Project structure

```
src/
  components/
    layout/       Navbar, Footer, mobile BottomNav, FloatingWhatsApp
    modals/        First-time residence picker + delivery-details modal
    hero/          Hero section, animated SVG scooter, floating icons
    categories/    Category chips/cards
    products/      Product cards, search, grid, popular carousel, "you might also like"
    offers/        Today's Special banner
    delivery/      Delivery time-slot pricing cards
    cart/          Slide-in cart drawer, cart items, floating cart button
    checkout/      Order summary → M-Pesa payment → confetti success → live tracker
    contact/       WhatsApp / call / social contact section
    common/        Reusable Button, GlowCard, SectionHeading, Skeleton
  context/         CartContext, OrderContext, ThemeContext (dark mode)
  data/            Product catalogue, categories, delivery slots (edit these!)
  hooks/           useLocalStorage
  lib/             intasend.js — payment integration stub, see above
```

## Editing the menu

All products live in `src/data/products.js` — each is a plain object with
`id`, `name`, `category`, `price`, `description`, `image` (a URL), and
optional `popular: true` / `tags`. Add, remove, or edit items there; the
grid, search, carousels, and recommendations all read from this one file.

Delivery time slots and their fees live in `src/data/deliverySlots.js`,
matching the rates you provided:

| Window | Delivered by | Fee |
|---|---|---|
| 10:00–10:30 AM | 11:00 AM | KSh 50 |
| 11:00–11:30 AM | 12:00 PM | KSh 50 |
| 7:00–7:30 PM | 8:00 PM | KSh 50 |
| 8:00–8:30 PM | 9:00 PM | KSh 70 |
| Past 9:00 PM | after 9:00 PM | KSh 90 |

## Tech stack

React 18 · Vite · Tailwind CSS · Framer Motion · React Router · Lucide Icons

## Notes

- All state (residence, delivery details, cart, favourites, theme, active
  order) persists to `localStorage` — there's no login, by design.
- Dark mode toggles a `.dark` class on `<html>`; Tailwind's `darkMode:
  "class"` picks it up everywhere.
- Reduced-motion is respected globally (see `src/index.css`).
- Every JS/JSX file in this project has been syntax-checked and the full
  dependency graph bundle-tested; you still need `npm install` since no
  packages are vendored here.
