import { apiRequest } from "./queryClient";
import type { Customer, InsertCustomer, Order, InsertOrder, UpdateOrderStatus, CustomerWithStats, OrderWithCustomer } from "@shared/schema";

// Customer API functions
export const customerApi = {
  getAll: async (search?: string): Promise<CustomerWithStats[]> => {
    const url = search ? `/api/customers?search=${encodeURIComponent(search)}` : "/api/customers";
    const res = await apiRequest("GET", url);
    return res.json();
  },

  getById: async (id: string): Promise<Customer> => {
    const res = await apiRequest("GET", `/api/customers/${id}`);
    return res.json();
  },

  create: async (customer: InsertCustomer): Promise<Customer> => {
    const res = await apiRequest("POST", "/api/customers", customer);
    return res.json();
  },

  update: async (id: string, customer: Partial<InsertCustomer>): Promise<Customer> => {
    const res = await apiRequest("PUT", `/api/customers/${id}`, customer);
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest("DELETE", `/api/customers/${id}`);
  },

  getOrders: async (customerId: string): Promise<Order[]> => {
    const res = await apiRequest("GET", `/api/customers/${customerId}/orders`);
    return res.json();
  },
};

// Order API functions
export const orderApi = {
  getAll: async (): Promise<OrderWithCustomer[]> => {
    const res = await apiRequest("GET", "/api/orders");
    return res.json();
  },

  create: async (customerId: string, orderData: FormData): Promise<Order> => {
    const res = await fetch(`/api/customers/${customerId}/orders`, {
      method: "POST",
      body: orderData,
      credentials: "include",
    });
    
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || res.statusText);
    }
    
    return res.json();
  },

  updateStatus: async (id: string, status: UpdateOrderStatus): Promise<Order> => {
    const res = await apiRequest("PUT", `/api/orders/${id}/status`, status);
    return res.json();
  },

  update: async (id: string, order: Partial<InsertOrder>): Promise<Order> => {
    const res = await apiRequest("PUT", `/api/orders/${id}`, order);
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest("DELETE", `/api/orders/${id}`);
  },
};

// Reports API functions
export const reportsApi = {
  getMonthlyStats: async (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    
    const url = `/api/reports/monthly${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await apiRequest("GET", url);
    return res.json();
  },

  getStatusCounts: async (): Promise<Record<string, number>> => {
    const res = await apiRequest("GET", "/api/reports/status-counts");
    return res.json();
  },

  getTopCustomers: async (limit?: number): Promise<CustomerWithStats[]> => {
    const url = limit ? `/api/reports/top-customers?limit=${limit}` : "/api/reports/top-customers";
    const res = await apiRequest("GET", url);
    return res.json();
  },
};
