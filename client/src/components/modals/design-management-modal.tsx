import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  PhotoIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

interface Design {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  isNew: boolean;
  isPopular: boolean;
}

interface DesignManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  designs: Design[];
  onDesignsChange: (designs: Design[]) => void;
}

export default function DesignManagementModal({ 
  isOpen, 
  onClose, 
  designs, 
  onDesignsChange 
}: DesignManagementModalProps) {
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
    isNew: false,
    isPopular: false
  });

  const categories = ["Formal Wear", "Ethnic Wear", "Casual Wear", "Wedding Wear", "Party Wear"];

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingDesign(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      image: "",
      description: "",
      isNew: false,
      isPopular: false
    });
  };

  const handleEdit = (design: Design) => {
    setEditingDesign(design);
    setIsAddingNew(false);
    setFormData({
      name: design.name,
      category: design.category,
      price: design.price.toString(),
      image: design.image,
      description: design.description,
      isNew: design.isNew,
      isPopular: design.isPopular
    });
  };

  const handleDelete = (id: number) => {
    const updatedDesigns = designs.filter(design => design.id !== id);
    onDesignsChange(updatedDesigns);
  };

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.price || !formData.image) {
      alert("Please fill in all required fields");
      return;
    }

    const newDesign: Design = {
      id: editingDesign ? editingDesign.id : Date.now(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      image: formData.image,
      description: formData.description,
      isNew: formData.isNew,
      isPopular: formData.isPopular
    };

    let updatedDesigns;
    if (editingDesign) {
      updatedDesigns = designs.map(design => 
        design.id === editingDesign.id ? newDesign : design
      );
    } else {
      updatedDesigns = [...designs, newDesign];
    }

    onDesignsChange(updatedDesigns);
    handleCancel();
  };

  const handleCancel = () => {
    setEditingDesign(null);
    setIsAddingNew(false);
    setFormData({
      name: "",
      category: "",
      price: "",
      image: "",
      description: "",
      isNew: false,
      isPopular: false
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-serif font-bold">Manage Design Showcase</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <XMarkIcon className="h-4 w-4" />
              Close
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Design Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Design Gallery ({designs.length} designs)</h3>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Add New Design
            </Button>
          </div>

          {/* Design Form */}
          {(isAddingNew || editingDesign) && (
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-4">
                  {editingDesign ? "Edit Design" : "Add New Design"}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Design Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter design name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="Enter price"
                      />
                    </div>

                    <div>
                      <Label htmlFor="image">Image URL *</Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        placeholder="Enter image URL"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Enter design description"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Status</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.isNew}
                            onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                            className="rounded"
                          />
                          <span className="text-sm">New</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.isPopular}
                            onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                            className="rounded"
                          />
                          <span className="text-sm">Popular</span>
                        </label>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {formData.image && (
                      <div>
                        <Label>Preview</Label>
                        <div className="mt-2 w-full h-48 bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={formData.image} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={handleSave}>
                    {editingDesign ? "Update Design" : "Add Design"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Design Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {designs.map((design) => (
              <Card key={design.id} className="group">
                <div className="relative">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      src={design.image} 
                      alt={design.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {design.isNew && (
                      <Badge className="bg-green-500 text-white text-xs">New</Badge>
                    )}
                    {design.isPopular && (
                      <Badge className="bg-orange-500 text-white text-xs">Popular</Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(design)}
                        className="h-8 w-8 p-0"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(design.id)}
                        className="h-8 w-8 p-0"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-3">
                  <h5 className="font-semibold text-sm truncate">{design.name}</h5>
                  <p className="text-xs text-muted-foreground">{design.category}</p>
                  <p className="text-sm font-bold text-primary">{formatCurrency(design.price)}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {designs.length === 0 && (
            <div className="text-center py-8">
              <PhotoIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No designs yet. Add your first design to get started!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
