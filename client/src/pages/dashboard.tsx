import { useQuery } from "@tanstack/react-query";
import { reportsApi, orderApi } from "@/lib/api";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: monthlyStats } = useQuery({
    queryKey: ["/api/reports/monthly"],
    queryFn: () => reportsApi.getMonthlyStats(),
  });

  const { data: statusCounts } = useQuery({
    queryKey: ["/api/reports/status-counts"],
    queryFn: () => reportsApi.getStatusCounts(),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: () => orderApi.getAll(),
  });

  const recentOrders = orders.slice(0, 3);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Header 
        title="Dashboard" 
        subtitle="Overview of your boutique business"
        showQuickAdd={true}
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card data-testid="stat-total-customers">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Customers</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {orders.length > 0 ? new Set(orders.map(o => o.customerId)).size : 0}
                  </p>
                </div>
                <div className="bg-chart-1 p-3 rounded-lg">
                  <i className="fas fa-users text-white text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-active-orders">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Orders</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {orders.filter(o => o.status !== "Completed").length}
                  </p>
                </div>
                <div className="bg-chart-3 p-3 rounded-lg">
                  <i className="fas fa-shopping-bag text-white text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-monthly-revenue">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {monthlyStats ? formatCurrency(monthlyStats.totalSales) : "₹0"}
                  </p>
                </div>
                <div className="bg-chart-2 p-3 rounded-lg">
                  <i className="fas fa-rupee-sign text-white text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-net-profit">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Net Profit</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {monthlyStats ? formatCurrency(monthlyStats.netProfit) : "₹0"}
                  </p>
                </div>
                <div className="bg-chart-4 p-3 rounded-lg">
                  <i className="fas fa-chart-line text-white text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card data-testid="recent-orders">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif font-semibold text-foreground">Recent Orders</h3>
                  <Button variant="link" className="text-primary hover:text-primary/80 font-medium text-sm p-0">
                    View All
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-muted rounded-lg" data-testid={`order-${order.id}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                            <i className="fas fa-shirt text-primary"></i>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{order.description}</p>
                            <p className="text-sm text-muted-foreground">{order.customerName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{formatCurrency(order.price)}</p>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Status Summary */}
          <Card data-testid="order-status-summary">
            <CardContent className="p-6">
              <h3 className="text-xl font-serif font-semibold text-foreground mb-6">Order Status</h3>
              
              <div className="space-y-4">
                {statusCounts && Object.entries(statusCounts).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between" data-testid={`status-${status.toLowerCase()}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        status === "New" ? "bg-red-500" :
                        status === "Cutting" ? "bg-chart-3" :
                        status === "Stitching" ? "bg-chart-1" :
                        status === "Ready" ? "bg-chart-2" :
                        "bg-green-500"
                      }`}></div>
                      <span className="text-foreground">{status}</span>
                    </div>
                    <span className="font-medium text-foreground">{count}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <Button className="w-full" data-testid="new-order-button">
                  <i className="fas fa-plus mr-2"></i>
                  New Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
