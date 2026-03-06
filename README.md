# ShopFlow Frontend — Next.js E-Commerce Storefront

A premium dark-themed e-commerce storefront built with Next.js 14 (App Router), Tailwind CSS, and React Context for state management. Connects to the ShopFlow backend microservices via the API Gateway.

> **Backend repo:** [shopflow](../shopflow)

---

## Table of Contents

- [Screenshots & Design](#screenshots--design)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Pages](#pages)
  - [Home](#home-page--)
  - [Products](#products-page--products)
  - [Product Detail](#product-detail-page--productsid)
  - [Cart](#cart-page--cart)
  - [Checkout](#checkout-page--checkout)
  - [Orders](#orders-page--orders)
  - [Login](#login-page--authlogin)
  - [Register](#register-page--authregister)
- [Components](#components)
  - [Layout Components](#layout-components)
  - [Product Components](#product-components)
  - [Cart Components](#cart-components)
- [State Management](#state-management)
  - [AuthContext](#authcontext)
  - [CartContext](#cartcontext)
- [API Client](#api-client)
- [Hooks](#hooks)
- [Styling & Theming](#styling--theming)
- [User Guide](#user-guide)
- [Docker Deployment](#docker-deployment)

---

## Screenshots & Design

The app uses a **premium dark theme** inspired by high-end tech product stores:

- **Background:** Deep navy/charcoal (`#0a0f1c`, `#111827`)
- **Text:** Crisp white/gray
- **Accent:** Electric blue (`#3b82f6`) for CTAs and highlights
- **Typography:** DM Sans (body) + Syne (headings) from Google Fonts
- **Cards:** Semi-transparent dark backgrounds with subtle borders
- **Hover effects:** Lift animations with shadow transitions

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | >= 20.x | Runtime |
| npm | >= 9.x | Package manager |
| Backend running | — | The ShopFlow backend must be up at `http://localhost:4000` |

---

## Quick Start

### Local Development

```bash
# 1. Clone and enter
git clone <frontend-repo-url>
cd shopflow-frontend

# 2. Set up environment
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev

# 5. Open in browser
open http://localhost:3000
```

### With Docker

```bash
# Make sure the backend is already running (docker compose up -d in shopflow/)
cp .env.example .env
docker compose up -d
open http://localhost:3000
```

---

## Project Structure

```
shopflow-frontend/
├── .env.example              # Environment template
├── docker-compose.yml        # Frontend container config
├── Dockerfile                # Multi-stage build for Next.js standalone
├── jsconfig.json             # Path aliases (@/ → ./src/)
├── next.config.js            # Next.js config (standalone output)
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS + Tailwind
├── tailwind.config.js        # Custom theme (colors, fonts)
├── public/                   # Static assets
└── src/
    ├── app/                  # Next.js App Router pages
    │   ├── layout.js         # Root layout (providers, navbar, footer)
    │   ├── globals.css       # Tailwind directives + global styles
    │   ├── page.js           # Home page
    │   ├── products/
    │   │   ├── page.js       # Product listing with filters
    │   │   └── [id]/page.js  # Product detail (dynamic route)
    │   ├── cart/page.js      # Shopping cart
    │   ├── checkout/page.js  # Checkout form
    │   ├── orders/page.js    # Order history
    │   └── auth/
    │       ├── login/page.js
    │       └── register/page.js
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx    # Top navigation bar
    │   │   └── Footer.jsx    # Site footer
    │   ├── product/
    │   │   ├── ProductCard.jsx    # Single product card
    │   │   ├── ProductGrid.jsx    # Responsive product grid
    │   │   └── ProductDetail.jsx  # Full product view
    │   └── cart/
    │       ├── CartDrawer.jsx     # Slide-in cart panel
    │       └── CartItem.jsx       # Cart line item
    ├── context/
    │   ├── AuthContext.jsx   # Authentication state
    │   └── CartContext.jsx   # Shopping cart state
    ├── hooks/
    │   └── useApi.js         # API call hook
    └── lib/
        └── api.js            # HTTP client wrapper
```

---

## Configuration

### `next.config.js`

```js
output: 'standalone'    // Enables Docker-optimized build
env: {
  NEXT_PUBLIC_API_URL   // Backend API Gateway URL
}
```

### `jsconfig.json`

Enables the `@/` import alias:

```js
import api from '@/lib/api';              // → ./src/lib/api.js
import { useAuth } from '@/context/AuthContext';  // → ./src/context/AuthContext.jsx
```

### `tailwind.config.js`

Custom theme extensions:

| Token | Value | Usage |
|-------|-------|-------|
| `navy-900` | `#0a0f1c` | Page background |
| `navy-800` | `#111827` | Card backgrounds |
| `navy-700` | `#1f2937` | Secondary backgrounds |
| `electric` | `#3b82f6` | Primary accent (buttons, links) |
| `amber` | `#f59e0b` | Star ratings |
| `font-sans` | DM Sans | Body text |
| `font-display` | Syne | Headings |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Backend API Gateway URL |

---

## Pages

### Home Page (`/`)

**File:** `src/app/page.js`

The landing page has four sections:

1. **Hero Section** — Full-width gradient background with headline "Everything you need, delivered fast", subtitle, and "Shop Now" CTA button linking to `/products`

2. **Category Cards** — Four clickable cards for Electronics, Clothing, Books, and Home & Garden. Each has an icon and gradient hover effect. Clicking navigates to `/products?category=<name>`

3. **Featured Products** — Fetches 8 products from the API (`GET /api/products?limit=8`) and displays them in a `ProductGrid`. Shows skeleton loading animation while fetching.

4. **Value Propositions** — Three-column strip highlighting Free Shipping (on orders over $100), Secure Payments, and 30-Day Returns.

---

### Products Page (`/products`)

**File:** `src/app/products/page.js`

Full-featured product listing with:

**Sidebar Filters (desktop) / Drawer (mobile):**
- Category checkboxes (Electronics, Clothing, Books, Home & Garden)
- Price range inputs (min/max)
- "Clear Filters" button

**Top Bar:**
- Search input with 300ms debounce
- Sort dropdown: Newest, Price Low→High, Price High→Low

**Product Grid:**
- 3 columns on desktop, 2 on tablet, 1 on mobile
- 12 products per page
- Skeleton loading animation during fetch

**Pagination:**
- Previous/Next buttons
- "Page X of Y" indicator

**URL Integration:** Reading `?category=` from URL on initial load (from category card clicks on home page).

**API Call:** `GET /api/products?page=&limit=12&category=&search=&minPrice=&maxPrice=&sort=`

---

### Product Detail Page (`/products/[id]`)

**File:** `src/app/products/[id]/page.js`

Dynamic route that fetches a single product by ID.

**Content:**
- Large gradient image placeholder (color based on category)
- Product name, SKU, price (large)
- Star rating display (filled/empty stars based on `ratings.average`)
- Stock badge: "In stock" (green), "Low stock — X left" (yellow, when < 10), "Out of stock" (red)
- Quantity selector (+/- buttons)
- "Add to Cart" button with loading spinner → success checkmark animation (2s)
- Product description

**Back navigation:** "← Back to Products" link at the top.

**Error handling:** Shows "Product Not Found" state with a back button if the product doesn't exist.

---

### Cart Page (`/cart`)

**File:** `src/app/cart/page.js`

**Left side (2/3 width):**
- List of cart items, each showing:
  - Category-colored gradient thumbnail
  - Product name
  - Unit price
  - Quantity controls (+/- buttons)
  - Remove button (trash icon)
  - Line total

**Right side (1/3 width) — Order Summary:**
- Subtotal
- Shipping: **$9.99** if subtotal < $100, or **FREE** (green badge) if ≥ $100
- Total (subtotal + shipping)
- "Proceed to Checkout" button (disabled if cart is empty)

**Empty state:** Shopping bag icon with "Your cart is empty" message and "Start Shopping" link.

---

### Checkout Page (`/checkout`)

**File:** `src/app/checkout/page.js`

**Requires authentication** — redirects to `/auth/login` if not logged in.

**Left side:**

*Shipping Address Form:*
- First Name, Last Name (pre-filled from user profile)
- Address, City, State, ZIP Code, Country
- All fields required

*Payment Details (demo only):*
- Card Number, Expiry, CVC inputs
- Note: "Demo only — no real charges"
- These fields are UI-only and not sent to the backend

**Right side — Order Summary:**
- Scrollable list of cart items
- Subtotal, Shipping, Total
- "Place Order" button with loading state

**On Submit:**
1. Creates the order: `POST /api/orders` with items and shipping address
2. Initiates payment: `POST /api/payments/initiate` with orderId and amount
3. Clears the cart
4. Redirects to `/orders`

---

### Orders Page (`/orders`)

**File:** `src/app/orders/page.js`

**Requires authentication** — redirects to `/auth/login` if not logged in.

Displays all orders for the authenticated user fetched from `GET /api/orders`.

**Each order card shows:**
- Order ID (first 8 characters)
- Date (formatted as "Mar 6, 2026")
- Status badge (color-coded):

| Status | Color |
|--------|-------|
| `pending` | Yellow |
| `confirmed` | Blue |
| `processing` | Indigo |
| `shipped` | Purple |
| `delivered` | Green |
| `cancelled` | Red |

- Total amount
- Item count

**Expandable:** Click to expand and see:
- List of order items (product name, quantity, price)
- **"Cancel Order" button** — appears only for orders with `pending` status. Shows confirmation dialog, then calls `PATCH /api/orders/:id/cancel`. Status updates to "cancelled" in real-time.

**Empty state:** "No orders yet" with a "Start Shopping" button.

---

### Login Page (`/auth/login`)

**File:** `src/app/auth/login/page.js`

Centered card on dark background with:
- "Welcome back" heading
- Email input
- Password input
- "Sign In" button with loading spinner
- Error message display (red)
- "Don't have an account? Register" link

Calls `useAuth().login(email, password)`. On success, redirects to `/`. Already-logged-in users are automatically redirected to `/`.

---

### Register Page (`/auth/register`)

**File:** `src/app/auth/register/page.js`

Centered card with:
- "Create your account" heading
- First Name, Last Name inputs
- Email input
- Password input (minimum 6 characters)
- "Create Account" button with loading spinner
- Error message display
- "Already have an account? Sign in" link

Calls `useAuth().register(firstName, lastName, email, password)`. On success, user is automatically logged in and redirected to `/`.

---

## Components

### Layout Components

#### `Navbar.jsx`

**File:** `src/components/layout/Navbar.jsx`

Fixed top navigation bar with glassmorphism effect (`bg-gray-900/95 backdrop-blur-md`).

| Section | Content |
|---------|---------|
| Left | "ShopFlow" logo (Syne font, electric blue) |
| Center | Products link (always), Orders link (when logged in) |
| Right — logged out | Cart icon + "Sign In" button |
| Right — logged in | Cart icon with item count badge, user avatar (first letter) with dropdown |

**Cart icon:** Clicking triggers `onCartOpen` prop to open the CartDrawer. Badge shows total item count from `useCart().itemCount`.

**User dropdown:** Profile link (future) and Logout button.

**Mobile:** Hamburger menu that toggles a mobile nav panel.

**Props:** `onCartOpen` — function to open the cart drawer.

---

#### `Footer.jsx`

**File:** `src/components/layout/Footer.jsx`

Three-column dark footer:
- **Branding:** ShopFlow logo + description
- **Shop:** Links to All Products, Electronics, Clothing, Books
- **Account:** Links to Sign In, Create Account, Order History, Cart
- Copyright line at bottom

---

### Product Components

#### `ProductCard.jsx`

**File:** `src/components/product/ProductCard.jsx`

Card component for product grids. Entire card is wrapped in a `<Link>` to the product detail page.

| Feature | Detail |
|---------|--------|
| Image area | Gradient background based on category (blue=Electronics, pink=Clothing, green=Books, amber=Home & Garden) with first letter of product name |
| Category badge | Top-left pill overlay |
| Stock indicator | Green/yellow/red dot with "In stock" / "Low stock" / "Out of stock" |
| Price | Large bold text |
| Add to Cart | Button at bottom, disabled when out of stock, calls `useCart().addItem(product)` |
| Hover effect | `translateY(-4px)` lift with `shadow-xl` transition |

**Props:** `product` — product object from the API.

---

#### `ProductGrid.jsx`

**File:** `src/components/product/ProductGrid.jsx`

Responsive grid that renders `ProductCard` for each product.

| Breakpoint | Columns |
|------------|---------|
| Mobile | 1 |
| Tablet (`sm`) | 2 |
| Desktop (`lg`) | 3 |

Shows "No products found" empty state when the array is empty.

**Props:** `products` — array of product objects.

---

#### `ProductDetail.jsx`

**File:** `src/components/product/ProductDetail.jsx`

Full product detail view with two-column layout (image | info).

| Feature | Detail |
|---------|--------|
| Image | Large gradient placeholder (aspect-square) with category badge |
| Name | Large heading (Syne font) |
| SKU | Uppercase gray text |
| Ratings | 5-star display (filled amber / empty gray) with count |
| Price | Extra-large bold text |
| Stock badge | Pill with stock count for low stock |
| Quantity | +/- buttons with min 1 / max stock |
| Add to Cart | Button with three states: default → spinner (400ms) → "✓ Added to Cart" (2s) |
| Description | Body text below |

**Props:** `product` — single product object.

---

### Cart Components

#### `CartDrawer.jsx`

**File:** `src/components/cart/CartDrawer.jsx`

Slide-in panel from the right side of the screen.

| Feature | Detail |
|---------|--------|
| Overlay | Semi-transparent black backdrop with blur |
| Animation | CSS `translateX` transition (300ms) |
| Header | "Your Cart" + close (X) button |
| Body | List of `CartItem` components, scrollable |
| Footer | Subtotal, "View Cart" button → `/cart`, "Checkout" button → `/checkout` |
| Empty state | Shopping bag icon + "Your cart is empty" + "Browse Products" link |

**Props:** `isOpen` (boolean), `onClose` (function).

---

#### `CartItem.jsx`

**File:** `src/components/cart/CartItem.jsx`

Single cart line item displayed in both the CartDrawer and Cart page.

| Element | Detail |
|---------|--------|
| Thumbnail | Small gradient square matching product category |
| Name | Truncated to one line |
| Price | Per unit |
| Quantity | −/+ buttons |
| Remove | Trash icon button |

Uses `useCart().updateQuantity()` and `useCart().removeItem()`.

**Props:** `item` — cart item object `{ id, name, price, quantity, category }`.

---

## State Management

The app uses two React Context providers, both wrapping the entire app in `layout.js`. Both persist to `localStorage` for session survival across page reloads.

### AuthContext

**File:** `src/context/AuthContext.jsx`

**Provider:** `<AuthProvider>`

**Hook:** `useAuth()`

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `user` | object \| null | `{ id, email, firstName, lastName, role }` |
| `token` | string \| null | JWT access token |
| `loading` | boolean | `true` during initial hydration from localStorage |
| `login(email, password)` | async function | Calls `POST /api/users/login`, stores tokens |
| `register(firstName, lastName, email, password)` | async function | Calls `POST /api/users/register`, stores tokens |
| `logout()` | function | Clears state + localStorage, redirects to `/` |

**Storage keys:** `token`, `user`, `refreshToken`

**Flow:**
1. On mount: reads `token` and `user` from localStorage
2. On login/register: saves `token`, `user`, `refreshToken` to state + localStorage
3. On logout: clears everything and redirects

---

### CartContext

**File:** `src/context/CartContext.jsx`

**Provider:** `<CartProvider>`

**Hook:** `useCart()`

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `items` | array | `[{ id, name, price, quantity, category, image }]` |
| `addItem(product, quantity?)` | function | Adds product or increments existing item's quantity |
| `removeItem(productId)` | function | Removes item from cart |
| `updateQuantity(productId, qty)` | function | Sets quantity; removes if ≤ 0 |
| `clearCart()` | function | Empties the cart |
| `total` | number | Computed subtotal (sum of price × quantity) |
| `itemCount` | number | Computed total item count |

**Storage key:** `cart`

**Flow:**
1. On mount: reads `cart` from localStorage
2. On any change: writes updated `items` to localStorage
3. `addItem` handles both MongoDB `_id` and `id` fields

---

## API Client

**File:** `src/lib/api.js`

Centralized HTTP client that all pages and components use.

```js
import api from '@/lib/api';

const { data, error } = await api.get('/api/products?limit=12');
const { data, error } = await api.post('/api/users/login', { email, password });
const { data, error } = await api.patch(`/api/orders/${id}/cancel`);
```

| Method | Signature |
|--------|-----------|
| `api.get(path)` | GET request |
| `api.post(path, body)` | POST with JSON body |
| `api.put(path, body)` | PUT with JSON body |
| `api.patch(path, body)` | PATCH with JSON body |
| `api.delete(path)` | DELETE request |

**Features:**
- Prepends `NEXT_PUBLIC_API_URL` to all paths
- Auto-attaches `Authorization: Bearer <token>` from localStorage
- On **401 response:** clears `token` and `user` from localStorage, redirects to `/auth/login`
- Returns `{ data, error }` — `data` is the parsed JSON body, `error` is a string message

---

## Hooks

### `useApi`

**File:** `src/hooks/useApi.js`

Generic hook for managing API call state.

```js
const { data, error, loading, execute } = useApi();

await execute(() => api.get('/api/products'));
```

| Return | Type | Description |
|--------|------|-------------|
| `data` | any | Response data |
| `error` | string \| null | Error message |
| `loading` | boolean | Request in progress |
| `execute(fn)` | async function | Runs the API call, manages state |

---

## Styling & Theming

### Tailwind CSS Custom Classes

The app extends Tailwind with custom design tokens:

```css
/* Backgrounds */
bg-navy-900        /* #0a0f1c — main page background */
bg-gray-800/50     /* semi-transparent card backgrounds */
bg-electric        /* #3b82f6 — primary buttons */

/* Text */
text-electric      /* blue accent text */
font-display       /* Syne headings */
font-sans          /* DM Sans body */

/* Borders */
border-white/5     /* very subtle borders on dark cards */
border-white/10    /* hover state borders */

/* Product category gradients */
from-blue-600 to-cyan-500       /* Electronics */
from-pink-500 to-rose-400       /* Clothing */
from-emerald-600 to-teal-400    /* Books */
from-amber-500 to-orange-400    /* Home & Garden */
```

### Global CSS (`globals.css`)

- Tailwind base/components/utilities directives
- Dark body background
- Smooth scrolling
- Custom scrollbar styling (thin, dark)

---

## User Guide

### As a New Customer

1. **Browse products** — Visit `/products` to see all available products. Use the search bar, category filters, and price range to narrow results.

2. **View product details** — Click any product card to see full details including description, ratings, stock level, and SKU.

3. **Register an account** — Click "Sign In" in the navbar → "Register" link → fill in your details. You're automatically logged in after registration.

4. **Add items to cart** — Click "Add to Cart" on any product card or detail page. The cart icon in the navbar shows your item count.

5. **Review your cart** — Click the cart icon to open the slide-in drawer, or navigate to `/cart` for the full cart page. Adjust quantities or remove items.

6. **Checkout** — Click "Proceed to Checkout", fill in your shipping address, and click "Place Order". The payment section is demo-only (no real charges).

7. **Track orders** — Navigate to `/orders` to see all your orders with their status. Expand any order to see the items.

8. **Cancel orders** — On the Orders page, expand a pending order and click "Cancel Order". Only orders with `pending` status can be cancelled.

### Order Status Flow

Your order progresses through these stages:

```
pending → confirmed → processing → shipped → delivered
    │
    └──→ cancelled (if you cancel, or payment fails)
```

- **Pending** — Order just placed, awaiting payment processing
- **Confirmed** — Payment successful (happens automatically within seconds)
- **Processing** — Being prepared for shipment
- **Shipped** — On the way
- **Delivered** — Successfully received
- **Cancelled** — You cancelled it, or the payment failed

---

## Docker Deployment

### Dockerfile

Uses a three-stage build optimized for Next.js:

```dockerfile
# Stage 1: Install all dependencies
FROM node:20-alpine AS deps

# Stage 2: Build the Next.js app
FROM node:20-alpine AS builder
RUN npm run build

# Stage 3: Production runtime (standalone output)
FROM node:20-alpine AS runner
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### docker-compose.yml

```bash
# Start (after backend is running)
docker compose up -d

# Stop
docker compose down
```

The frontend container joins the backend's Docker network (`shopflow_shopflow-network`) so it can resolve internal service names if needed.

### Scripts

```bash
npm run dev       # Development server with hot reload
npm run build     # Production build (standalone output)
npm run start     # Start production server
```
