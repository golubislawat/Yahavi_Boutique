import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/lib/api";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function Reports() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const { data: monthlyStats } = useQuery({
    queryKey: ["/api/reports/monthly", selectedYear, selectedMonth],
    queryFn: () => reportsApi.getMonthlyStats(selectedYear, selectedMonth),
  });

  const { data: topCustomers = [] } = useQuery({
    queryKey: ["/api/reports/top-customers"],
    queryFn: () => reportsApi.getTopCustomers(5),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);

  const profitMargin = monthlyStats?.totalSales ? 
    ((monthlyStats.netProfit / monthlyStats.totalSales) * 100).toFixed(1) : "0";

  return (
    <>
      <Header 
        title="Reports" 
        subtitle="Business performance and financial insights"
        showQuickAdd={false}
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select 
              value={selectedMonth.toString()} 
              onValueChange={(value) => setSelectedMonth(Number(value))}
            >
              <SelectTrigger className="w-40" data-testid="month-selector">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={selectedYear.toString()} 
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger className="w-32" data-testid="year-selector">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button data-testid="export-report-button">
            <i className="fas fa-download mr-2"></i>
            Export Report
          </Button>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card data-testid="total-sales-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Sales</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {monthlyStats ? formatCurrency(monthlyStats.totalSales) : "₹0"}
                  </p>
                </div>
                <div className="bg-chart-1 p-3 rounded-lg">
                  <i className="fas fa-rupee-sign text-white text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="material-costs-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Material Costs</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {monthlyStats ? formatCurrency(monthlyStats.totalMaterialCosts) : "₹0"}
                  </p>
                </div>
                <div className="bg-chart-3 p-3 rounded-lg">
                  <i className="fas fa-boxes text-white text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="net-profit-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Net Profit</p>
                  <p className="text-3xl font-bold text-chart-2 mt-1">
                    {monthlyStats ? formatCurrency(monthlyStats.netProfit) : "₹0"}
                  </p>
                </div>
                <div className="bg-chart-2 p-3 rounded-lg">
                  <i className="fas fa-chart-line text-white text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="profit-margin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Profit Margin</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{profitMargin}%</p>
                </div>
                <div className="bg-chart-4 p-3 rounded-lg">
                  <i className="fas fa-percentage text-white text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Overview */}
          <Card data-testid="sales-overview">
            <CardContent className="p-6">
              <h3 className="text-lg font-serif font-semibold text-foreground mb-4">
                Monthly Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Total Orders</p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {monthlyStats?.totalOrders || 0}
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Completed Orders</p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                  <p className="text-2xl font-bold text-chart-2">
                    {monthlyStats?.completedOrders || 0}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Average Order Value</p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {monthlyStats?.totalOrders ? 
                      formatCurrency(monthlyStats.totalSales / monthlyStats.totalOrders) : 
                      "₹0"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Performance */}
          <Card data-testid="order-performance">
            <CardContent className="p-6">
              <h3 className="text-lg font-serif font-semibold text-foreground mb-4">
                Order Performance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-chart-2 rounded-full"></div>
                    <span className="text-foreground">Completion Rate</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {monthlyStats?.totalOrders ? 
                      `${Math.round((monthlyStats.completedOrders / monthlyStats.totalOrders) * 100)}%` : 
                      "0%"
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-chart-4 rounded-full"></div>
                    <span className="text-foreground">Material Cost Ratio</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {monthlyStats?.totalSales ? 
                      `${Math.round((monthlyStats.totalMaterialCosts / monthlyStats.totalSales) * 100)}%` : 
                      "0%"
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-chart-1 rounded-full"></div>
                    <span className="text-foreground">Revenue per Customer</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {topCustomers.length > 0 ? 
                      formatCurrency(topCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / topCustomers.length) : 
                      "₹0"
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Customers */}
        <Card data-testid="top-customers">
          <CardContent className="p-6">
            <h3 className="text-lg font-serif font-semibold text-foreground mb-4">
              Top Customers This Month
            </h3>
            <div className="space-y-4">
              {topCustomers.length > 0 ? (
                topCustomers.map((customer) => (
                  <div 
                    key={customer.id} 
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    data-testid={`top-customer-${customer.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="font-medium text-primary text-sm">
                          {getInitials(customer.name)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.totalOrders} order{customer.totalOrders !== 1 ? 's' : ''} total
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{formatCurrency(customer.totalSpent)}</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No customer data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
