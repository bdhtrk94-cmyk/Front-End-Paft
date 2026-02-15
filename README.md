# PAFT System - Frontend

![PAFT Logo](public/paft-logo.png)

## 🌟 Overview

PAFT System Frontend is a modern web application built with Next.js 16 for PAFT Plastic Pallets, a leading manufacturer of premium plastic pallets in Egypt. The application provides a comprehensive platform for customers and administrators to manage products, orders, and content.

## 🚀 Features

- **Modern UI/UX**: Built with Next.js 16 App Router and Tailwind CSS
- **Product Catalog**: Browse 6+ categories of plastic pallets
- **Admin Dashboard**: Complete CMS for product and content management
- **E-commerce**: Shopping cart and order management
- **Interactive Maps**: Market coverage visualization with Leaflet
- **Responsive Design**: Mobile-first approach
- **Multi-language Support**: English and Arabic
- **Authentication**: JWT-based secure authentication
- **Dynamic Content**: Database-driven content management

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom React components with Lucide React icons
- **Maps**: Leaflet with React Leaflet
- **Fonts**: Geist Sans and Geist Mono
- **Build System**: Next.js built-in bundler
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 18+ LTS
- npm or yarn
- Backend API running (see [Backend Repository](https://github.com/Tarqumi/Paft-System-backend))

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Tarqumi/PAFT_System.git
cd PAFT_System
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Development Settings
NEXT_PRIVATE_TURBO=false
FAST_REFRESH=false
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── products/          # Product catalog
│   ├── shop/              # E-commerce pages
│   ├── about/             # Company information
│   ├── contact/           # Contact form
│   └── company/           # Company pages
├── components/            # Reusable React components
│   ├── admin/             # Admin-specific components
│   ├── auth/              # Authentication components
│   ├── maps/              # Map components
│   └── shop/              # E-commerce components
├── context/               # React Context providers
├── lib/                   # Utility functions and data
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🌐 Key Pages

- **Homepage** (`/`): Company overview and featured products
- **Products** (`/products`): Product catalog with categories
- **Shop** (`/shop`): E-commerce functionality
- **Admin** (`/admin`): Complete admin dashboard
- **About** (`/about`): Company information
- **Contact** (`/contact`): Contact form and information

## 🔐 Admin Features

- Product management (CRUD operations)
- Content management system
- Order management
- User management
- Page content editing
- Site settings

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Design System

- **Colors**: Custom color palette with light/dark theme support
- **Typography**: Geist Sans and Geist Mono fonts
- **Components**: Consistent design system with Tailwind CSS
- **Icons**: Lucide React icon library
- **Animations**: Smooth transitions and micro-interactions

## 🔗 API Integration

The frontend communicates with the backend API for:
- Authentication and authorization
- Product data management
- Order processing
- Content management
- File uploads

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NODE_ENV=production
```

### Deployment Options
- **Vercel**: Automatic deployment from GitHub
- **Netlify**: Static site deployment
- **IIS**: Windows Server deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by PAFT Plastic Pallets.

## 📞 Support

For support and inquiries:
- **Website**: [paft.eg](https://paft.eg)
- **Email**: info@paft.eg
- **Phone**: +20 XXX XXX XXXX

## 🏢 About PAFT

PAFT is a leading manufacturer of premium plastic pallets in Egypt, established in 2010. We specialize in durable, eco-friendly, and cost-effective logistics solutions for various industries including pharmaceutical, food, and export operations.

**Certifications**: ISO 9001, ISO 14001, HACCP
**Employees**: 50+
**Business Hours**: Sunday - Thursday, 9:00 AM - 6:00 PM (Egypt timezone)

---

Made with ❤️ by PAFT Team