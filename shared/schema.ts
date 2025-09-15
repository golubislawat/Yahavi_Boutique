import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  measurements: text("measurements"), // JSON string for flexibility
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  description: text("description").notNull(),
  price: real("price").notNull(),
  materialCost: real("material_cost").default(0),
  orderDate: timestamp("order_date").defaultNow(),
  status: text("status").notNull().default("New"), // New, Cutting, Stitching, Ready, Completed
  imagePath: text("image_path"),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderDate: true,
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["New", "Cutting", "Stitching", "Ready", "Completed"]),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;

// Customer with aggregated data
export type CustomerWithStats = Customer & {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
};

// Order with customer data
export type OrderWithCustomer = Order & {
  customerName: string;
  customerPhone: string;
};
