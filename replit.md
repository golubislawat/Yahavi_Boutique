# Overview

Boutique Manager is a full-stack web application designed to help boutique owners manage their customer database and order tracking system. The application serves as a digital replacement for traditional paper-based record keeping, providing features for customer management, order tracking with status workflows, financial reporting, and business analytics. Built as a modern web application with plans for desktop deployment, it aims to streamline boutique business operations from basic record keeping to comprehensive business management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Routing**: Wouter for lightweight client-side routing without the complexity of React Router
- **State Management**: TanStack Query (React Query) for server state management and caching, eliminating the need for Redux or Zustand
- **UI Components**: Radix UI primitives with shadcn/ui design system providing accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Server Framework**: Express.js with TypeScript running on Node.js
- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Database**: PostgreSQL (via Neon Database service) for production reliability and scalability
- **File Uploads**: Multer middleware for handling order images with validation and size limits
- **API Design**: RESTful API with consistent error handling and request logging middleware

## Data Storage Solutions
- **Primary Database**: PostgreSQL with two main tables - customers and orders
- **File Storage**: Local filesystem storage for uploaded order images (configurable for cloud storage)
- **Schema Management**: Drizzle migrations for database versioning and schema evolution
- **Data Validation**: Zod schemas shared between frontend and backend for consistent validation

## Development and Build Architecture
- **Build Tool**: Vite for fast development and optimized production builds
- **Development Server**: Vite dev server with Express API proxy for seamless full-stack development
- **Code Quality**: TypeScript for static type checking across the entire codebase
- **Asset Management**: Vite handles static assets with automatic optimization and cache busting

## Application Structure
- **Monorepo Layout**: Single repository with separate client/, server/, and shared/ directories
- **Shared Types**: Common TypeScript types and Zod schemas in shared/ directory
- **Component Organization**: Feature-based organization with reusable UI components
- **Route Protection**: No authentication system implemented (private business tool assumption)

# External Dependencies

## Database and ORM
- **@neondatabase/serverless**: Serverless PostgreSQL database connection for production deployment
- **drizzle-orm**: Type-safe ORM with excellent TypeScript integration
- **drizzle-kit**: CLI tools for database migrations and schema management

## UI and Styling
- **@radix-ui/react-***: Complete set of accessible UI primitives for complex components
- **tailwindcss**: Utility-first CSS framework for rapid styling
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Modern icon library with consistent design

## Data Fetching and Forms
- **@tanstack/react-query**: Server state management with caching, background updates, and optimistic updates
- **react-hook-form**: Performant forms with easy validation integration
- **@hookform/resolvers**: Bridge between React Hook Form and Zod validation

## Development Tools
- **vite**: Fast build tool with hot module replacement
- **typescript**: Static type checking for better developer experience
- **@replit/vite-plugin-***: Replit-specific plugins for development environment integration

## File Handling
- **multer**: Node.js middleware for handling multipart/form-data and file uploads
- **@types/multer**: TypeScript definitions for Multer

## Utilities
- **date-fns**: Modern JavaScript date utility library for date formatting and manipulation
- **clsx**: Utility for constructing className strings conditionally
- **nanoid**: Small, secure, URL-friendly unique string ID generator