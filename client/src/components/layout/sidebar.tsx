import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: "fas fa-chart-line" },
  { name: "Customers", href: "/customers", icon: "fas fa-users" },
  { name: "Orders", href: "/orders", icon: "fas fa-shopping-bag" },
  { name: "Reports", href: "/reports", icon: "fas fa-chart-bar" },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col" data-testid="sidebar">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-serif font-bold text-primary" data-testid="app-title">
          Boutique Manager
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Customer & Order Management</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => setLocation(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                data-testid={`nav-${item.name.toLowerCase()}`}
              >
                <i className={`${item.icon} text-lg`}></i>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg font-medium transition-colors" data-testid="settings-button">
          <i className="fas fa-cog text-lg"></i>
          Settings
        </button>
      </div>
    </aside>
  );
}
