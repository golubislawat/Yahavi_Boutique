import type { Customer, Order, CustomerWithStats, OrderWithCustomer } from "../types";

// Mock customers data - Empty for design showcase
export const mockCustomers: CustomerWithStats[] = [];

// Mock orders data - Empty for design showcase
export const mockOrders: OrderWithCustomer[] = [];

// Mock reports data - Empty for design showcase
export const mockMonthlyStats = {
  totalRevenue: 0,
  totalSales: 0,
  totalOrders: 0,
  completedOrders: 0,
  pendingOrders: 0,
  totalMaterialCosts: 0,
  netProfit: 0,
  monthlyData: [
    { month: "Jan", revenue: 0, orders: 0 },
    { month: "Feb", revenue: 0, orders: 0 },
    { month: "Mar", revenue: 0, orders: 0 },
    { month: "Apr", revenue: 0, orders: 0 },
    { month: "May", revenue: 0, orders: 0 },
    { month: "Jun", revenue: 0, orders: 0 },
    { month: "Jul", revenue: 0, orders: 0 },
    { month: "Aug", revenue: 0, orders: 0 },
    { month: "Sep", revenue: 0, orders: 0 }
  ]
};

export const mockStatusCounts = {
  "New": 0,
  "Cutting": 0,
  "Stitching": 0,
  "Ready": 0,
  "Completed": 0
};

// Helper functions to simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const simulateApiCall = async <T>(data: T, delayMs: number = 500): Promise<T> => {
  await delay(delayMs);
  return data;
};