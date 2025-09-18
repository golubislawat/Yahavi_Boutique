import { useState } from "react";
import Header from "@/components/layout/header";
import DesignManagementModal from "@/components/modals/design-management-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  PhotoIcon,
  EyeIcon
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

// Initial designs data
const initialDesigns: Design[] = [
  {
    id: 1,
    name: "Elegant Evening Gown",
    category: "Formal Wear",
    price: 15000,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center",
    description: "Beautiful silk evening gown with intricate embroidery",
    isNew: true,
    isPopular: true
  },
  {
    id: 2,
    name: "Traditional Saree",
    category: "Ethnic Wear",
    price: 12000,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=600&fit=crop&crop=center",
    description: "Handwoven silk saree with golden border",
    isNew: false,
    isPopular: true
  },
  {
    id: 3,
    name: "Modern Blazer Set",
    category: "Formal Wear",
    price: 8000,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
    description: "Contemporary blazer with matching trousers",
    isNew: true,
    isPopular: false
  },
  {
    id: 4,
    name: "Designer Kurta",
    category: "Casual Wear",
    price: 5000,
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&h=600&fit=crop&crop=center",
    description: "Comfortable cotton kurta with modern prints",
    isNew: false,
    isPopular: true
  },
  {
    id: 5,
    name: "Bridal Lehenga",
    category: "Wedding Wear",
    price: 25000,
    image: "https://images.unsplash.com/photo-1594736797933-d0c29c3b8a0a?w=400&h=600&fit=crop&crop=center",
    description: "Exquisite bridal lehenga with heavy work",
    isNew: true,
    isPopular: true
  },
  {
    id: 6,
    name: "Office Suit",
    category: "Formal Wear",
    price: 7000,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
    description: "Professional office suit for business meetings",
    isNew: false,
    isPopular: false
  }
];

export default function Designs() {
  const [designs, setDesigns] = useState<Design[]>(initialDesigns);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDesignsChange = (newDesigns: Design[]) => {
    setDesigns(newDesigns);
  };

  const handleDelete = (id: number) => {
    const updatedDesigns = designs.filter(design => design.id !== id);
    setDesigns(updatedDesigns);
  };

  return (
    <>
      <Header 
        title="Design Gallery" 
        subtitle="Manage your boutique's design showcase"
        showQuickAdd={false}
      />
      
      <div className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground">Design Showcase</h2>
            <p className="text-muted-foreground mt-1">
              Manage your design collection ({designs.length} designs)
            </p>
          </div>
          <Button 
            onClick={() => setIsManagementModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Manage Designs
          </Button>
        </div>

        {/* Design Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {designs.map((design) => (
            <Card key={design.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={design.image} 
                    alt={design.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center hidden">
                    <PhotoIcon className="w-16 h-16 text-primary/30" />
                  </div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {design.isNew && (
                    <Badge className="bg-green-500 text-white text-xs">New</Badge>
                  )}
                  {design.isPopular && (
                    <Badge className="bg-orange-500 text-white text-xs">Popular</Badge>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="text-xs">
                    {design.category}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="flex items-center gap-1">
                      <EyeIcon className="w-4 h-4" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="flex items-center gap-1"
                      onClick={() => handleDelete(design.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {design.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {design.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(design.price)}
                    </span>
                    <Button size="sm" className="text-xs">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {designs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <PhotoIcon className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Designs Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start building your design showcase by adding your first design.
              </p>
              <Button onClick={() => setIsManagementModalOpen(true)}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Your First Design
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Summary */}
        {designs.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Design Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{designs.length}</p>
                  <p className="text-sm text-muted-foreground">Total Designs</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {designs.filter(d => d.isNew).length}
                  </p>
                  <p className="text-sm text-muted-foreground">New Designs</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {designs.filter(d => d.isPopular).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Popular</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {new Set(designs.map(d => d.category)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Design Management Modal */}
      <DesignManagementModal
        isOpen={isManagementModalOpen}
        onClose={() => setIsManagementModalOpen(false)}
        designs={designs}
        onDesignsChange={handleDesignsChange}
      />
    </>
  );
}
