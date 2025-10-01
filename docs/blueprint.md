# **App Name**: DukaLite

## Core Features:

- Admin Authentication: Secure admin login using Firebase Authentication to protect store management functions.
- Product Management: Enable admins to add, update, and delete products with details like name, category, color, size, buying price, selling price and quantity.
- Image Hosting: Store and manage product images using Cloudinary. Images will be optimized.
- Inventory Display: Show a grid of products with images, name, category, color, size, and stock information for admin. Products are deduplicated in the storefront to prevent duplicates.
- WhatsApp Ordering: Allow users to order products by clicking a button that redirects to WhatsApp with a pre-filled message containing the product details.
- Category and Color Filtering: Enable filtering by category, color and size.
- Intelligent Alerting: LLM tool analyzes sales data and stock levels to decide on which products may need restocking soon, or are currently low. A low stock alert will show up on the inventory dashboard when determined.

## Style Guidelines:

- Primary color: A muted teal (#77D8D8) evoking trust and clarity, reflecting the reliable nature of e-commerce but steering clear of cliche.
- Background color: Very light teal (#F0FFFF), close to white, to provide a clean and airy backdrop, creating a sense of spaciousness and focus on the products.
- Accent color: Soft lavender (#B588D9) adds a touch of sophistication and directs attention to key interactive elements without overwhelming the user.
- Font pairing: 'Playfair' (serif) for headlines to convey elegance and readability; 'PT Sans' (sans-serif) for body text, ensuring a clean and modern reading experience. 
- Use simple, clear icons for navigation and product categories.
- Maintain a clean, mobile-first responsive grid layout to ensure optimal viewing on all devices.
- Subtle transition animations for loading states and button hovers to enhance user experience.