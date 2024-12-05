"use client";

import { useRouter, usePathname } from "next/navigation";
import { SidebarToggle } from "../sidebar/sidebar-toggle";
import { ThemeToggle } from "../theme-toggle";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

interface HeaderProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function Header({ isSidebarOpen, onSidebarToggle }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleBack = () => {
    if (!isHome) {
      router.back();
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-full items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <SidebarToggle isOpen={isSidebarOpen} onToggle={onSidebarToggle} />
          <ThemeToggle />
        </div>
        <div className={cn(
          "flex items-center gap-2 transition-opacity duration-300",
          isSidebarOpen ? "opacity-0 lg:opacity-100" : "opacity-100"
        )}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className={cn(
              "text-xl font-bold",
              !isHome && "cursor-pointer hover:text-primary"
            )}
          >
            <Link href="/">NextQ</Link>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}