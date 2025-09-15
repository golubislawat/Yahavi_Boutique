import { type Customer, type InsertCustomer, type Order, type InsertOrder, type CustomerWithStats, type OrderWithCustomer, type UpdateOrderStatus } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Customer operations
  getCustomers(): Promise<CustomerWithStats[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByPhone(phone: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;
  searchCustomers(query: string): Promise<CustomerWithStats[]>;

  // Order operations
  getOrders(): Promise<OrderWithCustomer[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: UpdateOrderStatus): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;

  // Statistics
  getMonthlyStats(year: number, month: number): Promise<{
    totalSales: number;
    totalMaterialCosts: number;
    netProfit: number;
    totalOrders: number;
    completedOrders: number;
  }>;
  getOrderStatusCounts(): Promise<Record<string, number>>;
  getTopCustomers(limit?: number): Promise<CustomerWithStats[]>;
}

export class MemStorage implements IStorage {
  private customers: Map<string, Customer>;
  private orders: Map<string, Order>;

  constructor() {
    this.customers = new Map();
    this.orders = new Map();
  }

  // Customer operations
  async getCustomers(): Promise<CustomerWithStats[]> {
    const customers = Array.from(this.customers.values());
    return customers.map(customer => this.addCustomerStats(customer));
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomerByPhone(phone: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(customer => customer.phone === phone);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = {
      ...insertCustomer,
      id,
      measurements: insertCustomer.measurements || null,
      notes: insertCustomer.notes || null,
      createdAt: new Date(),
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, updateData: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;

    const updated = { ...customer, ...updateData };
    this.customers.set(id, updated);
    return updated;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    return this.customers.delete(id);
  }

  async searchCustomers(query: string): Promise<CustomerWithStats[]> {
    const lowerQuery = query.toLowerCase();
    const customers = Array.from(this.customers.values()).filter(customer =>
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.phone.includes(query)
    );
    return customers.map(customer => this.addCustomerStats(customer));
  }

  // Order operations
  async getOrders(): Promise<OrderWithCustomer[]> {
    const orders = Array.from(this.orders.values());
    return orders.map(order => this.addCustomerToOrder(order)).filter(Boolean) as OrderWithCustomer[];
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.customerId === customerId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status || "New",
      materialCost: insertOrder.materialCost || null,
      imagePath: insertOrder.imagePath || null,
      orderDate: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, updateData: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updated = { ...order, ...updateData };
    this.orders.set(id, updated);
    return updated;
  }

  async updateOrderStatus(id: string, statusUpdate: UpdateOrderStatus): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updated = { ...order, status: statusUpdate.status };
    this.orders.set(id, updated);
    return updated;
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.orders.delete(id);
  }

  // Statistics
  async getMonthlyStats(year: number, month: number): Promise<{
    totalSales: number;
    totalMaterialCosts: number;
    netProfit: number;
    totalOrders: number;
    completedOrders: number;
  }> {
    const orders = Array.from(this.orders.values()).filter(order => {
      const orderDate = new Date(order.orderDate!);
      return orderDate.getFullYear() === year && orderDate.getMonth() === month - 1;
    });

    const totalSales = orders.reduce((sum, order) => sum + order.price, 0);
    const totalMaterialCosts = orders.reduce((sum, order) => sum + (order.materialCost || 0), 0);
    const completedOrders = orders.filter(order => order.status === "Completed").length;

    return {
      totalSales,
      totalMaterialCosts,
      netProfit: totalSales - totalMaterialCosts,
      totalOrders: orders.length,
      completedOrders,
    };
  }

  async getOrderStatusCounts(): Promise<Record<string, number>> {
    const orders = Array.from(this.orders.values());
    const counts: Record<string, number> = {
      "New": 0,
      "Cutting": 0,
      "Stitching": 0,
      "Ready": 0,
      "Completed": 0,
    };

    orders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });

    return counts;
  }

  async getTopCustomers(limit = 5): Promise<CustomerWithStats[]> {
    const customers = await this.getCustomers();
    return customers
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }

  // Helper methods
  private addCustomerStats(customer: Customer): CustomerWithStats {
    const customerOrders = Array.from(this.orders.values()).filter(order => order.customerId === customer.id);
    const totalOrders = customerOrders.length;
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.price, 0);
    const lastOrder = customerOrders.sort((a, b) => new Date(b.orderDate!).getTime() - new Date(a.orderDate!).getTime())[0];

    return {
      ...customer,
      totalOrders,
      totalSpent,
      lastOrderDate: lastOrder?.orderDate?.toISOString(),
    };
  }

  private addCustomerToOrder(order: Order): OrderWithCustomer | null {
    const customer = this.customers.get(order.customerId);
    if (!customer) return null;

    return {
      ...order,
      customerName: customer.name,
      customerPhone: customer.phone,
    };
  }
}

export const storage = new MemStorage();
