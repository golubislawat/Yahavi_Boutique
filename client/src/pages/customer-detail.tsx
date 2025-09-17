import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useState } from "react";
import { customerApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import CustomerModal from "@/components/modals/customer-modal";
import OrderModal from "@/components/modals/order-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Customer } from "../types";

export default function CustomerDetail() {
  const [, params] = useRoute("/customers/:id");
  const [, setLocation] = useLocation();
  const customerId = params?.id;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customer, isLoading } = useQuery({
    queryKey: ["/api/customers", customerId],
    queryFn: () => customerApi.getById(customerId!),
    enabled: !!customerId,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/customers", customerId, "orders"],
    queryFn: () => customerApi.getOrders(customerId!),
    enabled: !!customerId,
  });

  const deleteMutation = useMutation({
    mutationFn: customerApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Success", description: "Customer deleted successfully" });
      setLocation("/customers");
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete customer",
        variant: "destructive"
      });
    },
  });

  if (!customerId) {
    setLocation("/customers");
    return null;
  }

  if (isLoading) {
    return (
      <>
        <Header title="Customer Details" subtitle="Loading..." />
        <div className="p-6">
          <div className="text-center">Loading customer details...</div>
        </div>
      </>
    );
  }

  if (!customer) {
    return (
      <>
        <Header title="Customer Not Found" subtitle="The requested customer could not be found" />
        <div className="p-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Customer not found</p>
              <Button onClick={() => setLocation("/customers")}>
                Back to Customers
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const handleDeleteCustomer = () => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      deleteMutation.mutate(customer.id);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      "New": "bg-red-100 text-red-800",
      "Cutting": "bg-chart-3/20 text-chart-3",
      "Stitching": "bg-chart-1/20 text-chart-1",
      "Ready": "bg-chart-2/20 text-chart-2",
      "Completed": "bg-green-100 text-green-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.price, 0);
  const memberSince = customer.createdAt ? formatDate(new Date(customer.createdAt)) : "Unknown";

  return (
    <>
      <Header title="Customer Details" subtitle="View and manage customer information" />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/customers")}
            data-testid="back-button"
          >
            <i className="fas fa-arrow-left text-lg mr-2"></i>
            Back to Customers
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Profile */}
          <Card data-testid="customer-profile">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-medium text-primary">
                    {getInitials(customer.name)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-serif font-semibold text-foreground">
                    {customer.name}
                  </h3>
                  <p className="text-muted-foreground">
                    Customer ID: #{customer.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <p className="text-foreground">{customer.phone}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Orders</label>
                  <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Spent</label>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(totalSpent)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <p className="text-foreground">{memberSince}</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => setShowOrderModal(true)}
                  data-testid="new-order-button"
                >
                  <i className="fas fa-plus mr-2"></i>
                  New Order
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowEditModal(true)}
                  data-testid="edit-profile-button"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-destructive hover:text-destructive"
                  onClick={handleDeleteCustomer}
                  disabled={deleteMutation.isPending}
                  data-testid="delete-customer-button"
                >
                  <i className="fas fa-trash mr-2"></i>
                  {deleteMutation.isPending ? "Deleting..." : "Delete Customer"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Measurements & Notes */}
          <Card data-testid="measurements-notes">
            <CardContent className="p-6">
              <h4 className="text-lg font-serif font-semibold text-foreground mb-4">
                Measurements & Notes
              </h4>
              
              <div className="space-y-4">
                {customer.measurements ? (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Measurements</label>
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <p className="text-foreground text-sm whitespace-pre-wrap">
                        {customer.measurements}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm">No measurements recorded</p>
                  </div>
                )}

                <Separator />

                {customer.notes ? (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Special Notes</label>
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <p className="text-foreground text-sm whitespace-pre-wrap">
                        {customer.notes}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm">No special notes</p>
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setShowEditModal(true)}
                data-testid="update-measurements-button"
              >
                <i className="fas fa-ruler mr-2"></i>
                Update Information
              </Button>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card data-testid="order-history">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-serif font-semibold text-foreground">Order History</h4>
                {orders.length > 3 && (
                  <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium p-0">
                    View All
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                {orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="p-3 bg-muted rounded-lg" data-testid={`order-${order.id}`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground text-sm">{order.description}</p>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{formatDate(new Date(order.orderDate!))}</span>
                        <span className="font-medium text-foreground">{formatCurrency(order.price)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">No orders yet</p>
                    <Button 
                      className="mt-4"
                      onClick={() => setShowOrderModal(true)}
                      data-testid="first-order-button"
                    >
                      Create First Order
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CustomerModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        customer={customer}
        isEdit={true}
      />

      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        customerId={customer.id}
      />
    </>
  );
}
