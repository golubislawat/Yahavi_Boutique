import React, { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: <HomeIcon className="w-6 h-6" />,
  },
  {
    name: "Design Gallery",
    href: "/designs",
    icon: <PhotoIcon className="w-6 h-6" />,
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
      data-testid="sidebar"
    >
      {/* Header Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex-1">
              <h1
                className="text-xl font-serif font-bold text-primary"
                data-testid="app-title"
              >
                Yahavi_Boutique
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                we make your thinking into Reality
              </p>
            </div>
          )}
          
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            data-testid="sidebar-toggle"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1", isCollapsed ? "p-2" : "p-4")}>
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => setLocation(item.href)}
                className={cn(
                  "w-full flex items-center rounded-lg font-medium transition-colors group relative",
                  isCollapsed 
                    ? "justify-center px-2 py-3" 
                    : "gap-3 px-3 py-3 text-left",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                data-testid={`nav-${item.name.toLowerCase()}`}
                title={isCollapsed ? item.name : undefined}
              >
                <span className="flex-shrink-0">
                  {item.icon}
                </span>
                
                {!isCollapsed && (
                  <span className="transition-opacity duration-200">
                    {item.name}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings Section */}
      <div className={cn("border-t border-border", isCollapsed ? "p-2" : "p-4")}>
        <button
          className={cn(
            "w-full flex items-center rounded-lg font-medium transition-colors group relative text-foreground hover:bg-accent hover:text-accent-foreground",
            isCollapsed 
              ? "justify-center px-2 py-3" 
              : "gap-3 px-3 py-3 text-left"
          )}
          data-testid="settings-button"
          title={isCollapsed ? "Settings" : undefined}
        >
          <span className="flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          
          {!isCollapsed && (
            <span className="transition-opacity duration-200">
              Settings
            </span>
          )}
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
              Settings
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
