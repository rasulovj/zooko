"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import { Home, BookOpen, BarChart3, Award, Settings, ChevronLeft, Leaf, X, ClipboardCheck } from "lucide-react";
import { playClick, playPop } from "../lib/sounds";

const navItems = [
  { label: "Bosh sahifa", href: "/dashboard", Icon: Home },
  { label: "Kurslarim", href: "/dashboard/lessons", Icon: BookOpen },
  { label: "Nazorat ishi", href: "/dashboard/nazorat-ishi", Icon: ClipboardCheck },
  { label: "Natijalar", href: "/dashboard/progress", Icon: BarChart3 },
  { label: "Nishonlar", href: "/dashboard/badges", Icon: Award },
  { label: "Sozlamalar", href: "/dashboard/settings", Icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebar();

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-[var(--card-border)] ${collapsed && !mobileOpen ? "justify-center px-0" : "px-5 justify-between"}`}>
        <Link href="/dashboard" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 bg-[#1C7C54] rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:rotate-12">
            <Leaf size={16} className="text-white" />
          </div>
          {(!collapsed || mobileOpen) && (
            <span className="text-lg font-bold tracking-tight text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>
              zooko
            </span>
          )}
        </Link>
        {mobileOpen && (
          <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--foreground)]/40 hover:text-[var(--foreground)] hover:bg-[var(--green-50)]/40 transition-all lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed && !mobileOpen ? item.label : undefined}
              onClick={() => { setMobileOpen(false); playClick(); }}
              className={`flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[var(--green-50)] text-[var(--green-600)]"
                  : "text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-[var(--green-50)]/50"
              } ${collapsed && !mobileOpen ? "justify-center" : ""}`}
            >
              <item.Icon size={20} className={`flex-shrink-0 transition-colors ${isActive ? "text-[var(--green-600)]" : "text-[var(--foreground)]/50 group-hover:text-[var(--foreground)]/80"}`} />
              {(!collapsed || mobileOpen) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle — desktop only */}
      <div className="hidden lg:block p-3 border-t border-[var(--card-border)]">
        <button
          onClick={() => { toggle(); playPop(); }}
          className="flex items-center justify-center w-full h-10 rounded-xl text-[var(--foreground)]/50 hover:text-[var(--foreground)]/80 hover:bg-[var(--green-50)]/50 transition-all"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft size={20} className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[var(--overlay-bg)] backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--card-border)] w-[260px] transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 bottom-0 z-50 flex-col bg-[var(--sidebar-bg)] border-r border-[var(--card-border)] transition-all duration-300 ease-in-out ${
          collapsed ? "w-[72px]" : "w-[240px]"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
