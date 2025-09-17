import type { Customer, InsertCustomer, Order, InsertOrder, UpdateOrderStatus, CustomerWithStats, OrderWithCustomer } from "../types";
import { mockCustomers, mockOrders, mockMonthlyStats, mockStatusCounts, simulateApiCall } from "./mockData";

// Customer API functions (using mock data)
export const customerApi = {
  getAll: async (search?: string): Promise<CustomerWithStats[]> => {
    let customers = mockCustomers;
    if (search) {
      customers = customers.filter(customer => 
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search)
      );
    }
    return simulateApiCall(customers);
  },

  getById: async (id: string): Promise<Customer> => {
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return simulateApiCall(customer);
  },

  create: async (customer: InsertCustomer): Promise<Customer> => {
    const newCustomer: Customer = {
      id: (mockCustomers.length + 1).toString(),
      ...customer,
      createdAt: new Date().toISOString()
    };
    return simulateApiCall(newCustomer);
  },

  update: async (id: string, customer: Partial<InsertCustomer>): Promise<Customer> => {
    const existing = mockCustomers.find(c => c.id === id);
    if (!existing) {
      throw new Error('Customer not found');
    }
    const updated = { ...existing, ...customer };
    return simulateApiCall(updated);
  },

  delete: async (id: string): Promise<void> => {
    return simulateApiCall(undefined as any, 300);
  },

  getOrders: async (customerId: string): Promise<Order[]> => {
    const customerOrders = mockOrders.filter(order => order.customerId === customerId);
    return simulateApiCall(customerOrders);
  },
};

// Order API functions (using mock data)
export const orderApi = {
  getAll: async (): Promise<OrderWithCustomer[]> => {
    return simulateApiCall(mockOrders);
  },

  create: async (customerId: string, orderData: FormData): Promise<Order> => {
    const description = orderData.get('description') as string;
    const price = parseFloat(orderData.get('price') as string);
    const materialCost = parseFloat(orderData.get('materialCost') as string) || 0;
    
    const newOrder: Order = {
      id: (mockOrders.length + 1).toString(),
      customerId,
      description,
      price,
      materialCost,
      orderDate: new Date().toISOString(),
      status: "New",
      imagePath: undefined
    };
    
    return simulateApiCall(newOrder);
  },

  updateStatus: async (id: string, status: UpdateOrderStatus): Promise<Order> => {
    const order = mockOrders.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    const updated = { ...order, status: status.status };
    return simulateApiCall(updated);
  },

  update: async (id: string, orderUpdate: Partial<InsertOrder>): Promise<Order> => {
    const order = mockOrders.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    const updated = { ...order, ...orderUpdate };
    return simulateApiCall(updated);
  },

  delete: async (id: string): Promise<void> => {
    return simulateApiCall(undefined as any, 300);
  },
};

// Reports API functions (using mock data)
export const reportsApi = {
  getMonthlyStats: async (year?: number, month?: number) => {
    // In a real app, you would filter by year/month
    return simulateApiCall(mockMonthlyStats);
  },

  getStatusCounts: async (): Promise<Record<string, number>> => {
    return simulateApiCall(mockStatusCounts);
  },

  getTopCustomers: async (limit?: number): Promise<CustomerWithStats[]> => {
    const sortedCustomers = [...mockCustomers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit || 10);
    return simulateApiCall(sortedCustomers);
  },
};
