# 👗 Boutique Manager - Static Demo

A modern, responsive React application for managing boutique operations including customers, orders, and business analytics.

## 🚀 Features

- **Customer Management**: Add, view, edit, and manage customer profiles with measurements
- **Order Tracking**: Complete order lifecycle from creation to completion
- **Business Analytics**: Dashboard with charts and reports  
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🖥️ Demo Data

This is a static demo version that uses mock data including:
- 5 sample customers with realistic Indian names and phone numbers
- 6 sample orders with different statuses (New, Cutting, Stitching, Ready, Completed)
- Business analytics and reporting data

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Routing**: Wouter

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd BoutiqueManager
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```
   Static files will be generated in `dist/public/` directory.

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript type checking

## 🏗️ Project Structure

```
BoutiqueManager/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── layout/       # Layout components
│   │   │   └── modals/       # Modal components
│   │   ├── pages/            # Application pages
│   │   ├── lib/              # Utilities and mock data
│   │   ├── types/            # TypeScript type definitions
│   │   ├── hooks/            # Custom React hooks
│   │   └── App.tsx           # Main app component
│   └── index.html            # HTML entry point
├── attached_assets/          # Static assets
├── dist/                     # Production build output
└── package.json              # Dependencies and scripts
```

## 🎨 Key Pages

- **Dashboard** (`/`) - Overview with key metrics and charts
- **Customers** (`/customers`) - Customer management and search
- **Customer Detail** (`/customers/:id`) - Individual customer details and orders
- **Orders** (`/orders`) - Order management and status tracking  
- **Reports** (`/reports`) - Business analytics and insights

## 🔧 Development Notes

- Uses mock data with simulated API delays for realistic UX
- Fully responsive design with mobile-first approach
- Type-safe with TypeScript throughout
- Modern React patterns with hooks and functional components
- Optimized for performance with code splitting

## 📱 Mobile Support

The application is fully responsive and provides an optimal experience on:
- Desktop computers
- Tablets
- Mobile phones (iOS and Android)

## 🚀 Deployment

The built application is a static site that can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist/public` folder
- **GitHub Pages**: Upload the `dist/public` contents
- **Any web server**: Serve the `dist/public` directory

## 📄 License

MIT License - feel free to use this project for your boutique management needs!

---

**Note**: This is a demo version with mock data. For a production version, you would need to integrate with a real backend API for data persistence.