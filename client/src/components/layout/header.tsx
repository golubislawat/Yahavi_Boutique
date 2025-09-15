import { useState } from "react";
import CustomerModal from "@/components/modals/customer-modal";
import OrderModal from "@/components/modals/order-modal";

interface HeaderProps {
  title: string;
  subtitle: string;
  onSearch?: (query: string) => void;
  showQuickAdd?: boolean;
  quickAddType?: "customer" | "order";
}

export default function Header({ title, subtitle, onSearch, showQuickAdd = true, quickAddType = "customer" }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleQuickAdd = () => {
    if (quickAddType === "customer") {
      setShowCustomerModal(true);
    } else {
      setShowOrderModal(true);
    }
  };

  return (
    <>
      <header className="bg-card border-b border-border p-6" data-testid="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground" data-testid="page-title">
              {title}
            </h2>
            <p className="text-muted-foreground mt-1" data-testid="page-subtitle">
              {subtitle}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {onSearch && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers or orders..."
                  className="bg-input border border-border rounded-lg px-4 py-2 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-ring"
                  value={searchQuery}
                  onChange={handleSearch}
                  data-testid="search-input"
                />
                <i className="fas fa-search absolute left-3 top-3 text-muted-foreground"></i>
              </div>
            )}
            {showQuickAdd && (
              <button
                onClick={handleQuickAdd}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                data-testid="quick-add-button"
              >
                <i className="fas fa-plus mr-2"></i>
                Quick Add
              </button>
            )}
          </div>
        </div>
      </header>

      <CustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
      />

      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
      />
    </>
  );
}
