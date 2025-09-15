import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { customerApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import CustomerModal from "@/components/modals/customer-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomerWithStats } from "@shared/schema";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<CustomerWithStats | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["/api/customers", searchQuery],
    queryFn: () => customerApi.getAll(searchQuery || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: customerApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Success", description: "Customer deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete customer",
        variant: "destructive"
      });
    },
  });

  const handleViewCustomer = (customerId: string) => {
    setLocation(`/customers/${customerId}`);
  };

  const handleEditCustomer = (customer: CustomerWithStats) => {
    setEditingCustomer(customer);
  };

  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    if (window.confirm(`Are you sure you want to delete ${customerName}?`)) {
      deleteMutation.mutate(customerId);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

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

  return (
    <>
      <Header 
        title="Customers" 
        subtitle="Manage customer profiles and information"
        onSearch={setSearchQuery}
        showQuickAdd={true}
        quickAddType="customer"
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" data-testid="filter-button">
                <i className="fas fa-filter mr-2"></i>
                Filter
              </Button>
              <Button variant="outline" data-testid="export-button">
                <i className="fas fa-download mr-2"></i>
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <Card data-testid="customers-table">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="font-medium text-foreground">Customer</TableHead>
                    <TableHead className="font-medium text-foreground">Phone</TableHead>
                    <TableHead className="font-medium text-foreground">Total Orders</TableHead>
                    <TableHead className="font-medium text-foreground">Total Spent</TableHead>
                    <TableHead className="font-medium text-foreground">Last Order</TableHead>
                    <TableHead className="font-medium text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading customers...
                      </TableCell>
                    </TableRow>
                  ) : customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {searchQuery ? "No customers found matching your search" : "No customers yet"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <TableRow 
                        key={customer.id} 
                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleViewCustomer(customer.id)}
                        data-testid={`customer-row-${customer.id}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="font-medium text-primary text-sm">
                                {getInitials(customer.name)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{customer.name}</p>
                              <p className="text-sm text-muted-foreground">ID: #{customer.id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">{customer.phone}</TableCell>
                        <TableCell className="text-foreground">{customer.totalOrders}</TableCell>
                        <TableCell className="font-medium text-foreground">
                          {formatCurrency(customer.totalSpent)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(customer.lastOrderDate)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewCustomer(customer.id);
                              }}
                              data-testid={`view-customer-${customer.id}`}
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCustomer(customer);
                              }}
                              data-testid={`edit-customer-${customer.id}`}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCustomer(customer.id, customer.name);
                              }}
                              disabled={deleteMutation.isPending}
                              data-testid={`delete-customer-${customer.id}`}
                            >
                              <i className="fas fa-trash text-destructive"></i>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination placeholder */}
            {customers.length > 0 && (
              <div className="border-t border-border p-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {customers.length} customer{customers.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CustomerModal
        isOpen={!!editingCustomer}
        onClose={() => setEditingCustomer(null)}
        customer={editingCustomer || undefined}
        isEdit={true}
      />
    </>
  );
}
