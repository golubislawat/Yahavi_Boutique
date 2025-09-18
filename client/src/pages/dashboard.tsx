import { useState } from "react";
import { 
  CubeIcon,
  PlusIcon,
  EyeIcon,
  HeartIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Mock product designs data with real image URLs
const productDesigns = [
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
  },
  {
    id: 7,
    name: "Designer Dress",
    category: "Party Wear",
    price: 18000,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center",
    description: "Stylish party dress with elegant design",
    isNew: true,
    isPopular: true
  },
  {
    id: 8,
    name: "Casual Shirt",
    category: "Casual Wear",
    price: 3500,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
    description: "Comfortable casual shirt for everyday wear",
    isNew: false,
    isPopular: false
  }
];

export default function Dashboard() {
  const [selectedDesign, setSelectedDesign] = useState<typeof productDesigns[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDesign = (design: typeof productDesigns[0]) => {
    setSelectedDesign(design);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDesign(null);
  };

  return (
    <>
      <Header 
        title="Our Designs" 
        subtitle="Discover our beautiful collection of boutique designs"
        showQuickAdd={true}
      />
      
      <div className="p-6 space-y-6">
        {/* Product Designs Showcase */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground">Our Latest Designs</h2>
              <p className="text-muted-foreground mt-1">Discover our beautiful collection of boutique designs</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <EyeIcon className="w-4 h-4" />
              View All Designs
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productDesigns.map((design) => (
              <Card key={design.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300" data-testid={`design-${design.id}`}>
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
                      <CubeIcon className="w-16 h-16 text-primary/30" />
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

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="flex items-center gap-1"
                        onClick={() => handleViewDesign(design)}
                      >
                        <EyeIcon className="w-4 h-4" />
                        View
                      </Button>
                      <Button size="sm" variant="secondary" className="flex items-center gap-1">
                        <HeartIcon className="w-4 h-4" />
                        Like
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
                        Order Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                Ready to Create Your Dream Outfit?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Let our expert designers bring your vision to life. From traditional wear to modern fashion, 
                we create unique pieces that reflect your personal style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="flex items-center gap-2">
                  <PlusIcon className="w-5 h-5" />
                  Start New Order
                </Button>
                <Button size="lg" variant="outline" className="flex items-center gap-2">
                  <EyeIcon className="w-5 h-5" />
                  Browse Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Design Image Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="text-xl font-serif font-bold">{selectedDesign?.name}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCloseModal}
                    className="flex items-center gap-2"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Close
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {selectedDesign && (
              <div className="space-y-6">
                {/* Large Image */}
                <div className="relative">
                  <img 
                    src={selectedDesign.image} 
                    alt={selectedDesign.name}
                    className="w-full h-[500px] object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-[500px] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center rounded-lg hidden">
                    <CubeIcon className="w-32 h-32 text-primary/30" />
                  </div>
                </div>

                {/* Design Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                        {selectedDesign.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {selectedDesign.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="text-sm">
                        {selectedDesign.category}
                      </Badge>
                      {selectedDesign.isNew && (
                        <Badge className="bg-green-500 text-white">New</Badge>
                      )}
                      {selectedDesign.isPopular && (
                        <Badge className="bg-orange-500 text-white">Popular</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary mb-4">
                        {formatCurrency(selectedDesign.price)}
                      </p>
                      <div className="space-y-2">
                        <Button className="w-full" size="lg">
                          <PlusIcon className="w-5 h-5 mr-2" />
                          Order This Design
                        </Button>
                        <Button variant="outline" className="w-full" size="lg">
                          <HeartIcon className="w-5 h-5 mr-2" />
                          Add to Favorites
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-foreground mb-3">Design Features</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="font-medium">Material</p>
                      <p className="text-muted-foreground">Premium Quality</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="font-medium">Delivery</p>
                      <p className="text-muted-foreground">7-10 Days</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="font-medium">Customization</p>
                      <p className="text-muted-foreground">Available</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="font-medium">Warranty</p>
                      <p className="text-muted-foreground">1 Year</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
