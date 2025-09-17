import { z } from "zod";

// Customer types
export interface Customer {
  id: string;
  name: string;
  phone: string;
  measurements?: string; // JSON string for flexibility
  notes?: string;
  createdAt: string;
}

export const insertCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  measurements: z.string().optional(),
  notes: z.string().optional(),
});

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

// Order types
export interface Order {
  id: string;
  customerId: string;
  description: string;
  price: number;
  materialCost?: number;
  orderDate: string;
  status: "New" | "Cutting" | "Stitching" | "Ready" | "Completed";
  imagePath?: string;
}

export const insertOrderSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  materialCost: z.number().min(0).optional(),
  status: z.enum(["New", "Cutting", "Stitching", "Ready", "Completed"]).default("New"),
  imagePath: z.string().optional(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum(["New", "Cutting", "Stitching", "Ready", "Completed"]),
});

export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;

// Customer with aggregated data
export interface CustomerWithStats extends Customer {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
}

// Order with customer data
export interface OrderWithCustomer extends Order {
  customerName: string;
  customerPhone: string;
}

// API Response types for Spring Boot
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Spring Boot specific types
export interface SpringBootCustomer {
  id: string;
  name: string;
  phone: string;
  measurements?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SpringBootOrder {
  id: string;
  customerId: string;
  description: string;
  price: number;
  materialCost?: number;
  orderDate: string;
  status: string;
  imagePath?: string;
  createdAt: string;
  updatedAt?: string;
}