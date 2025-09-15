import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi, customerApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId?: string;
}

export default function OrderModal({ isOpen, onClose, customerId }: OrderModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    customerId: customerId || "",
    description: "",
    price: "",
    materialCost: "",
    status: "New",
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
    queryFn: () => customerApi.getAll(),
    enabled: isOpen && !customerId,
  });

  const createMutation = useMutation({
    mutationFn: ({ customerId, formData }: { customerId: string; formData: FormData }) => 
      orderApi.create(customerId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Success", description: "Order created successfully" });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create order",
        variant: "destructive"
      });
    },
  });

  const resetForm = () => {
    setFormData({
      customerId: customerId || "",
      description: "",
      price: "",
      materialCost: "",
      status: "New",
    });
    setSelectedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId) {
      toast({ 
        title: "Error", 
        description: "Please select a customer",
        variant: "destructive"
      });
      return;
    }

    const orderFormData = new FormData();
    orderFormData.append("description", formData.description);
    orderFormData.append("price", formData.price);
    orderFormData.append("materialCost", formData.materialCost);
    orderFormData.append("status", formData.status);
    
    if (selectedFile) {
      orderFormData.append("image", selectedFile);
    }

    createMutation.mutate({ customerId: formData.customerId, formData: orderFormData });
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="order-modal">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">Create New Order</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!customerId && (
            <div>
              <Label htmlFor="customer">Customer *</Label>
              <Select 
                value={formData.customerId} 
                onValueChange={(value) => setFormData({ ...formData, customerId: value })}
              >
                <SelectTrigger data-testid="select-customer">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the order (e.g., Custom wedding dress)"
              rows={3}
              data-testid="input-description"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                data-testid="input-price"
              />
            </div>
            
            <div>
              <Label htmlFor="materialCost">Material Cost</Label>
              <Input
                id="materialCost"
                type="number"
                min="0"
                step="0.01"
                value={formData.materialCost}
                onChange={(e) => setFormData({ ...formData, materialCost: e.target.value })}
                placeholder="0.00"
                data-testid="input-material-cost"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger data-testid="select-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Cutting">Cutting</SelectItem>
                <SelectItem value="Stitching">Stitching</SelectItem>
                <SelectItem value="Ready">Ready for Pickup</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="image">Order Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              data-testid="input-image"
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createMutation.isPending}
              data-testid="button-submit"
            >
              {createMutation.isPending ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
