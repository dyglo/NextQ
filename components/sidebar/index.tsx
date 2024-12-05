"use client";

import { useState, useEffect } from "react";
import { Home, Compass, BookMarked, History } from "lucide-react";
import { NavItem } from "./nav-item";
import { UserProfile } from "./user-profile";
import { ProUpgrade } from "./pro-upgrade";
import { Header } from "../layout/header";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

const navItems = [
  { icon: Home, title: "Home", href: "/" },
  { icon: Compass, title: "Discover", href: "/discover" },
  { icon: BookMarked, title: "Library", href: "/library" },
  { icon: History, title: "History", href: "/history" },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  return (
    <>
      <Header isSidebarOpen={isOpen} onSidebarToggle={() => setIsOpen(!isOpen)} />
      
      {/* Backdrop for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col gap-4 border-r bg-background transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-16",
          "top-16", // Account for header
          className
        )}
      >
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-2 px-2">
            {navItems.map((item) => (
              <NavItem 
                key={item.href} 
                {...item} 
                isCollapsed={!isOpen}
              />
            ))}
          </nav>

          <div className={cn(
            "mt-6 px-2 transition-opacity duration-200",
            !isOpen && "opacity-0 pointer-events-none"
          )}>
            <ProUpgrade />
          </div>
        </div>

        <div className={cn(
          "border-t p-2 transition-opacity duration-200",
          !isOpen && "opacity-0 pointer-events-none"
        )}>
          <UserProfile />
        </div>
      </div>

      {/* Push main content */}
      <div className={cn(
        "transition-[margin] duration-300 ease-in-out pt-16",
        isOpen ? "lg:ml-64" : "lg:ml-16"
      )} />
    </>
  );
}