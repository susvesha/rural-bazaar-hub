# Rural Bazaar Hub

A modern e-commerce platform connecting rural artisans, farmers, and local producers directly with customers. Rural Bazaar Hub empowers local entrepreneurs by providing a digital marketplace for authentic handmade and organic products.

## 🌟 Features

### Core Features
- **Product Marketplace** - Browse and discover authentic handmade and organic products from local artisans and farmers
- **User Authentication** - Secure sign-up and login with role-based access (Buyer/Seller/Admin)
- **Shopping Cart** - Add products to cart and manage quantities
- **Checkout System** - Secure payment processing and order placement
- **Real-time Chat** - Direct messaging between buyers and sellers with notifications
- **Order Management** - Track orders and manage delivery status
- **Seller Dashboard** - Manage products, inventory, and sales
- **Admin Panel** - Monitor the platform and manage users
- **User Profiles** - Complete profile management for buyers and sellers
- **Message Notifications** - Real-time toast notifications with unread message badge in navbar
- **Responsive Design** - Mobile-first design with seamless experience across all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library for building interactive interfaces
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/UI** - High-quality React components
- **Framer Motion** - Animation library
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Recharts** - Data visualization charts
- **Lucide Icons** - Icon library

### Backend & Database
- **Supabase** - PostgreSQL database with real-time capabilities
- **Authentication** - Supabase Auth for user management
- **Real-time Subscriptions** - Supabase Real-time for live updates

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility
- **TailwindCSS Plugins** - Typography and animation

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/UI components
│   ├── Navbar.tsx       # Navigation with message notifications
│   ├── Footer.tsx       # Footer component
│   └── ProductCard.tsx  # Product card component
├── pages/               # Page components
│   ├── Landing.tsx      # Landing/home page
│   ├── Products.tsx     # Products listing
│   ├── ProductDetails.tsx # Single product details
│   ├── Auth.tsx         # Authentication page
│   ├── Chat.tsx         # Real-time messaging
│   ├── Cart.tsx         # Shopping cart
│   ├── Checkout.tsx     # Payment checkout
│   ├── Orders.tsx       # Order history
│   ├── SellerDashboard.tsx # Seller management
│   ├── Admin.tsx        # Admin panel
│   ├── Profile.tsx      # User profile
│   ├── About.tsx        # About page
│   ├── Contact.tsx      # Contact page
│   └── NotFound.tsx     # 404 page
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── hooks/               # Custom React hooks
│   ├── use-toast.ts     # Toast notifications
│   └── use-mobile.tsx   # Mobile device detection
├── integrations/        # External integrations
│   └── supabase/        # Supabase client and types
├── lib/                 # Utility functions
│   └── utils.ts         # Common utilities
└── App.tsx              # Main app component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/susvesha/rural-bazaar-hub.git
   cd rural-bazaar-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env` file or create one with Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:8080`

## 📜 Available Scripts

```bash
# Start development server with hot module replacement
npm run dev

# Build for production
npm run build

# Build with development mode enabled
npm run build:dev

# Run ESLint to check code quality
npm lint

# Preview production build locally
npm run preview
```

## 🎯 Key Features Details

### Real-time Messaging
- **Live Chat** - Direct conversation between buyers and sellers
- **Message Notifications** - Toast notifications with sender name and message preview
- **Unread Badge** - Red badge on navbar showing unread message count
- **Auto-read** - Messages automatically marked as read when conversation is opened
- **Animated Badge** - Pulsing animation to highlight new messages

### User Roles
- **Buyer** - Browse products, add to cart, place orders, message sellers
- **Seller** - List products, manage inventory, fulfill orders, message buyers
- **Admin** - Manage users, products, and platform settings

### Database Schema
The Supabase database includes tables for:
- `profiles` - User profile information
- `products` - Product listings
- `cart_items` - Shopping cart items
- `orders` - Order history
- `order_items` - Order line items
- `conversations` - Chat conversations
- `messages` - Chat messages
- And more...

## 🔐 Security Features
- Secure authentication with Supabase Auth
- Row-level security (RLS) on database
- Protected routes based on user roles
- Input validation with Zod

## 🎨 Design Features
- Modern glassmorphism UI design
- Smooth animations with Framer Motion
- Dark mode support with next-themes
- Responsive grid layouts
- Gradient accents and interactive elements
- Mobile-optimized navigation

## 📱 Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Notes
- Database migrations are stored in `supabase/migrations/`
- All UI components are built with Radix UI primitives and styled with TailwindCSS
- Real-time features use Supabase's PostgreSQL Change Data Capture (CDC)
- Form handling uses React Hook Form with Zod validation

## 🔗 Links
- **GitHub Repository**: https://github.com/susvesha/rural-bazaar-hub
- **Supabase Documentation**: https://supabase.com/docs
- **React Documentation**: https://react.dev
- **TailwindCSS Documentation**: https://tailwindcss.com/docs

## 📧 Support
For issues and questions, please open an issue on the GitHub repository.

---

**Rural Bazaar Hub** - Empowering Rural Entrepreneurs Through Digital Commerce  "# rural-bazaar-hub" 
