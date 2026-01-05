"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const user = {
    name: "Alex",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  const sidebarItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Subjects", path: "/dashboard/subjects" },
    { name: "Badges", path: "/dashboard/badges" },
    { name: "Settings", path: "/dashboard/settings" },
    { name: "Logout", path: "/" },
  ];

  const handleNavClick = (item: (typeof sidebarItems)[0]) => {
    setActiveItem(item.name);
    router.push(item.path);
    setDrawerOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 pt-20 bg-white border-r px-6 py-8 flex-col fixed top-0 left-0 h-screen">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-10">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">Student</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              className={`block w-full text-left px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-primary hover:text-white transition ${
                activeItem === item.name ? "bg-primary text-white" : ""
              }`}
              onClick={() => handleNavClick(item)}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          ></div>

          {/* Drawer content */}
          <aside className="relative w-64 bg-white px-6 py-8 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setDrawerOpen(false)}
                className="p-2"
              >
                <X />
              </Button>
            </div>
            <nav className="flex-1 space-y-2 overflow-y-auto">
              {sidebarItems.map((item) => (
                <button
                  key={item.name}
                  className={`block w-full text-left px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-primary hover:text-white transition ${
                    activeItem === item.name ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => handleNavClick(item)}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Header */}
        <header className="flex items-center justify-between bg-white border-b px-4 md:px-8 h-16 fixed top-0 left-0 right-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <Button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2"
            >
              <Menu />
            </Button>
            {/* Logo */}
            <h1 className="text-xl font-bold text-primary">Zooko</h1>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <p className="text-gray-700 font-medium">{user.name}</p>
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 px-4 md:px-8 pt-20 pb-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
