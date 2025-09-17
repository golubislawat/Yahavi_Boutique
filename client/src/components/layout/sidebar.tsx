import React, { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentIcon,
  ChartBarIcon,
  Bars3Icon, //toggle button icon
} from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: <HomeIcon className="w-6 h-6" />,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: <UsersIcon className="w-6 h-6" />,
  },
  {
    name: "Orders",
    href: "/orders",
    icon: <ClipboardDocumentIcon className="w-6 h-6" />,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: <ChartBarIcon className="w-6 h-6" />,
  },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
        <aside
          className="w-64 bg-card border-r border-border flex flex-col"
          data-testid="sidebar"
        >
          <div className="p-6 border-b border-border">
            <h1
              className="text-2xl font-serif font-bold text-primary"
              data-testid="app-title"
            >
              Yahavi_Boutique
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              {" "}
              we make your thinking into Reality{" "}
            </p>
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
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg font-medium transition-colors"
              data-testid="settings-button"
            >
              <i className="fas fa-cog text-lg"></i>
              Settings
            </button>
          </div>
        </aside>
  );
}
