# Raj Mart - Quick Commerce Application

## Setup
1.  **Backend**:
    -   Navigate to `server` directory.
    -   Create a `.env` file with your MongoDB URI:
        ```
        MONGODB_URI=your_mongodb_atlas_connection_string
        PORT=5000
        ```
    -   Run `npm install` (if not done).
    -   Start server: `npm start` (or `node index.js`).

2.  **Frontend**:
    -   Navigate to `client` directory.
    -   Run `npm install` (if not done).
    -   Start client: `npm run dev`.

## Features
-   **Admin Panel** (`/admin`): Add products, manage orders.
-   **User Storefront**: Browse products (Grid view), Add to Cart (Quantity logic).
-   **Cart**: Free delivery logic (> ₹200), COD payment.
-   **Order Tracking**: Order status updates visible on success page (or admin).

## Tech Stack
-   MongoDB, Express, React, Node.js
-   TailwindCSS (v4)
-   Vite
