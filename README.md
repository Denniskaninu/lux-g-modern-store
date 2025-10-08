# LUX MODERN COLLECTION - Admin Dashboard & Storefront

This is a full-stack e-commerce application built for "LUX MODERN COLLECTION", a modern men's fashion retailer. The application features a public-facing storefront to display products and a secure admin dashboard for comprehensive store management.

---

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Admin Access](#admin-access)

---

## Key Features

### Admin Dashboard (`/admin`)
A secure, feature-rich panel for store owners to manage operations.

-   **Authentication**: Secure login using authorized Google accounts.
-   **Dashboard Overview**: At-a-glance view of total revenue, profit, and sales volume.
-   **Product Management**: Full CRUD (Create, Read, Update, Delete) functionality for products, including image uploads to Cloudinary.
-   **Sales Tracking**: Record sales transactions, automatically updating inventory levels.
-   **Sales Analysis**: View sales reports filtered by time periods (Today, Week, Month, Year) and download professional PDF summaries.
-   **Intelligent Alerts**: AI-powered alerts (using Google's Gemini model via Genkit) to notify admins of low-stock products.
-   **Store Settings**: Manage site-wide settings, such as the location image displayed in the footer.
-   **Data Reset**: A secure option to reset all sales data without affecting product inventory.

### Public Storefront (`/`)
A clean, modern, and responsive customer-facing site.

-   **Hero Section**: An engaging introduction with animated marketing text.
-   **Product Collection**: A filterable gallery of all products. Users can filter by category, color, and size, or use the search bar.
-   **Direct Ordering**: Each product has an "Order Now" button that opens WhatsApp with a pre-filled message including the product details and price.
-   **Customer Testimonials**: A section showcasing positive customer feedback to build trust.
-   **Contact & Location**: A detailed footer with contact information (WhatsApp, Phone, Email) and a map image of the physical store location.

---

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Database**: [Google Firestore](https://firebase.google.com/docs/firestore)
-   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) (Google Provider)
-   **Image Management**: [Cloudinary](https://cloudinary.com/) for image hosting and management.
-   **Generative AI**: [Google AI (Gemini)](https://ai.google/) via [Genkit](https://firebase.google.com/docs/genkit) for intelligent alerts.
-   **PDF Generation**: `jspdf` & `jspdf-autotable` for creating sales reports.

---

## Project Structure

-   `src/app/`: Contains all the application routes.
    -   `src/app/admin/`: All routes related to the admin dashboard.
    -   `src/app/api/`: API routes for server-side logic, like image uploads and deletions.
    -   `src/app/page.tsx`: The main storefront page.
-   `src/components/`: Reusable React components.
    -   `src/components/admin/`: Components specific to the admin dashboard.
    -   `src/components/ui/`: UI components from ShadCN.
-   `src/lib/`: Core utilities, Firebase configuration, and data management functions.
-   `src/ai/`: Contains the Genkit flows for AI functionality.
-   `public/`: Static assets.
-   `ADMIN_GUIDE.md`: A detailed guide for the store admin on how to use the dashboard.

---

## Getting Started

To run this project locally, you will need to have Node.js and npm installed.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    This project requires a few environment variables to connect to its services. Create a `.env.local` file in the root of the project and add the following:

    ```
    # Firebase Configuration (replace with your own)
    NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
    NEXT_PUBLIC_FIREBASE_APP_ID="1:..."

    # Cloudinary Configuration (replace with your own)
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
    NEXT_PUBLIC_CLOUDINARY_API_KEY="..."
    CLOUDINARY_API_SECRET="..." # Note: This one is not prefixed with NEXT_PUBLIC_

    # Google AI (for Genkit)
    GEMINI_API_KEY="AIza..."

    # Store Configuration
    NEXT_PUBLIC_WHATSAPP_NUMBER="254..."
    NEXT_PUBLIC_ADMIN_EMAILS="admin1@example.com,admin2@example.com"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

---

## Admin Access

-   Admin access is restricted to the Google accounts listed in the `NEXT_PUBLIC_ADMIN_EMAILS` environment variable.
-   The default authorized email is `symonmacharia399@gmail.com`.
-   To log in, navigate to `/login` and use the "Login with Google" button.
