"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Folder,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Prosjekter", href: "/prosjekter", icon: Folder },
  { label: "Pipeline", href: "/pipeline", icon: TrendingUp },
  { label: "Team", href: "/team", icon: Users },
  { label: "Innstillinger", href: "/innstillinger", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-dark-border flex items-center justify-between px-4 h-14">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white p-2"
          aria-label="Åpne meny"
        >
          <Menu size={22} />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <span className="text-gold font-bold text-lg tracking-wide">BORGHINI</span>
          <span className="text-white/40 italic text-sm">ENT.</span>
        </Link>
        <div className="w-10" />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-dark-surface border-r border-dark-border z-50",
          "transition-transform duration-200",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-dark-border">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-gold font-bold text-xl tracking-wide">BORGHINI</span>
            <span className="text-white/40 italic text-sm">ENT.</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-dark-muted"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-gold-muted text-gold border border-gold/20"
                    : "text-white/60 hover:text-white hover:bg-dark-hover"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-border">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/40 hover:text-danger transition-colors w-full"
            >
              <LogOut size={18} />
              Logg ut
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
