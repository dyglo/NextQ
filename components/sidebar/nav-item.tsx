"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavItemProps {
  icon: LucideIcon;
  title: string;
  href: string;
  isCollapsed?: boolean;
}

export function NavItem({ icon: Icon, title, href, isCollapsed }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || 
    (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors relative group",
        isActive 
          ? "bg-secondary text-secondary-foreground" 
          : "hover:bg-secondary/50",
        isCollapsed && "justify-center"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && <span>{title}</span>}
      {isCollapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded shadow-md whitespace-nowrap z-50"
        >
          {title}
        </motion.div>
      )}
    </Link>
  );
}