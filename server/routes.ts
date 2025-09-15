import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCustomerSchema, insertOrderSchema, updateOrderStatusSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Customer routes
  app.get("/api/customers", async (req, res) => {
    try {
      const { search } = req.query;
      let customers;
      
      if (search && typeof search === "string") {
        customers = await storage.searchCustomers(search);
      } else {
        customers = await storage.getCustomers();
      }
      
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      
      // Check if phone already exists
      const existingCustomer = await storage.getCustomerByPhone(validatedData.phone);
      if (existingCustomer) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, validatedData);
      
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      res.json(customer);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update customer" });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCustomer(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/customers/:id/orders", async (req, res) => {
    try {
      const orders = await storage.getOrdersByCustomer(req.params.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer orders" });
    }
  });

  app.post("/api/customers/:id/orders", upload.single('image'), async (req, res) => {
    try {
      const orderData = {
        ...req.body,
        customerId: req.params.id,
        price: parseFloat(req.body.price),
        materialCost: req.body.materialCost ? parseFloat(req.body.materialCost) : 0,
        imagePath: req.file?.path,
      };
      
      const validatedData = insertOrderSchema.parse(orderData);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const validatedData = updateOrderStatusSchema.parse(req.body);
      const order = await storage.updateOrderStatus(req.params.id, validatedData);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid status data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const orderData = {
        ...req.body,
        price: req.body.price ? parseFloat(req.body.price) : undefined,
        materialCost: req.body.materialCost ? parseFloat(req.body.materialCost) : undefined,
      };
      
      const validatedData = insertOrderSchema.partial().parse(orderData);
      const order = await storage.updateOrder(req.params.id, validatedData);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteOrder(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete order" });
    }
  });

  // Statistics and reports
  app.get("/api/reports/monthly", async (req, res) => {
    try {
      const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;
      const stats = await storage.getMonthlyStats(Number(year), Number(month));
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch monthly stats" });
    }
  });

  app.get("/api/reports/status-counts", async (req, res) => {
    try {
      const counts = await storage.getOrderStatusCounts();
      res.json(counts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch status counts" });
    }
  });

  app.get("/api/reports/top-customers", async (req, res) => {
    try {
      const { limit = 5 } = req.query;
      const customers = await storage.getTopCustomers(Number(limit));
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top customers" });
    }
  });

  // Serve uploaded images
  app.use('/api/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}
