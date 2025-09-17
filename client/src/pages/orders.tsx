import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import OrderModal from "@/components/modals/order-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UpdateOrderStatus } from "../types";

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: () => orderApi.getAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UpdateOrderStatus }) => 
      orderApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Success", description: "Order status updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update order status",
        variant: "destructive"
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: orderApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Success", description: "Order deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete order",
        variant: "destructive"
      });
    },
  });

  const filteredOrders = orders.filter(order => 
    statusFilter === "all" || order.status === statusFilter
  );

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

  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow = {
      "New": "Cutting",
      "Cutting": "Stitching",
      "Stitching": "Ready",
      "Ready": "Completed",
      "Completed": null,
    };
    return statusFlow[currentStatus as keyof typeof statusFlow] || null;
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
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ 
      id: orderId, 
      status: { status: newStatus as any } 
    });
  };

  const handleDeleteOrder = (orderId: string, orderDescription: string) => {
    if (window.confirm(`Are you sure you want to delete "${orderDescription}"?`)) {
      deleteMutation.mutate(orderId);
    }
  };

  const calculateProfit = (price: number, materialCost: number = 0) => {
    return price - materialCost;
  };

  return (
    <>
      <Header 
        title="Orders" 
        subtitle="Track and manage all customer orders"
        showQuickAdd={true}
        quickAddType="order"
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setShowOrderModal(true)}
              data-testid="new-order-button"
            >
              <i className="fas fa-plus mr-2"></i>
              New Order
            </Button>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40" data-testid="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Cutting">Cutting</SelectItem>
                  <SelectItem value="Stitching">Stitching</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground mb-4">
                {statusFilter === "all" ? "No orders yet" : `No ${statusFilter.toLowerCase()} orders`}
              </p>
              <Button onClick={() => setShowOrderModal(true)}>
                <i className="fas fa-plus mr-2"></i>
                Create First Order
              </Button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card 
                key={order.id} 
                className="hover:shadow-lg transition-shadow"
                data-testid={`order-card-${order.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      Order #{order.id.slice(0, 8)}
                    </span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>

                  {/* Order image placeholder */}
                  <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                    {order.imagePath ? (
                      <img 
                        src={`/api/uploads/${order.imagePath.split('/').pop()}`} 
                        alt="Order" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <i className="fas fa-image text-muted-foreground text-2xl"></i>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-serif font-semibold text-foreground">
                        {order.description}
                      </h3>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(order.price)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(new Date(order.orderDate!))}
                      </span>
                    </div>

                    <div className="border-t border-border pt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Material Cost:</span>
                        <span className="text-foreground">{formatCurrency(order.materialCost || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Profit:</span>
                        <span className="font-medium text-chart-2">
                          {formatCurrency(calculateProfit(order.price, order.materialCost || 0))}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      {getNextStatus(order.status) ? (
                        <Button 
                          className="flex-1 text-sm"
                          onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status)!)}
                          disabled={updateStatusMutation.isPending}
                          data-testid={`update-status-${order.id}`}
                        >
                          {order.status === "Ready" ? (
                            <>
                              <i className="fas fa-paper-plane mr-1"></i>
                              Complete
                            </>
                          ) : (
                            `Move to ${getNextStatus(order.status)}`
                          )}
                        </Button>
                      ) : order.status === "Ready" ? (
                        <Button 
                          className="flex-1 text-sm bg-chart-2 hover:bg-chart-2/90"
                          data-testid={`notify-customer-${order.id}`}
                        >
                          <i className="fas fa-paper-plane mr-1"></i>
                          Notify Customer
                        </Button>
                      ) : (
                        <div className="flex-1 text-center text-sm text-muted-foreground py-2">
                          Completed
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-testid={`view-order-${order.id}`}
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-testid={`edit-order-${order.id}`}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id, order.description)}
                        disabled={deleteMutation.isPending}
                        data-testid={`delete-order-${order.id}`}
                      >
                        <i className="fas fa-trash text-destructive"></i>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
      />
    </>
  );
}
