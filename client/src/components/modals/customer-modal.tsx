import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { InsertCustomer } from "../../types";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: InsertCustomer & { id?: string };
  isEdit?: boolean;
}

export default function CustomerModal({ isOpen, onClose, customer, isEdit = false }: CustomerModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<InsertCustomer>({
    name: customer?.name || "",
    phone: customer?.phone || "",
    measurements: customer?.measurements || "",
    notes: customer?.notes || "",
  });

  const createMutation = useMutation({
    mutationFn: customerApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Success", description: "Customer created successfully" });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create customer",
        variant: "destructive"
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertCustomer> }) => 
      customerApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Success", description: "Customer updated successfully" });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update customer",
        variant: "destructive"
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      measurements: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && customer?.id) {
      updateMutation.mutate({ id: customer.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleClose = () => {
    onClose();
    if (!customer) resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="customer-modal">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">
            {isEdit ? "Edit Customer" : "Add New Customer"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter customer name"
              data-testid="input-name"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
              data-testid="input-phone"
            />
          </div>
          
          <div>
            <Label htmlFor="measurements">Measurements</Label>
            <Textarea
              id="measurements"
              value={formData.measurements || ""}
              onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
              placeholder="Chest: 36&quot;, Waist: 28&quot;, etc."
              rows={3}
              data-testid="input-measurements"
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special notes or preferences"
              rows={3}
              data-testid="input-notes"
            />
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
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-submit"
            >
              {createMutation.isPending || updateMutation.isPending 
                ? "Saving..." 
                : isEdit ? "Update Customer" : "Add Customer"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
