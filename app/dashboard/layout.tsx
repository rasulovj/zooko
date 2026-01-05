"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("Dashboard");

  const user = {
    name: "Alex",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  const sidebarItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Subjects", path: "/dashboard/subjects" },
    // { name: "Progress", path: "/dashboard/progress" },
    { name: "Badges", path: "/dashboard/badges" },
    { name: "Settings", path: "/dashboard/settings" },
    { name: "Logout", path: "/" },
  ];

  const handleNavClick = (item: (typeof sidebarItems)[0]) => {
    setActiveItem(item.name);
    router.push(item.path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r px-6 py-8 flex flex-col fixed top-0 left-0 h-screen">
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

      {/* Main Content */}
      <main className="flex-1 ml-64 px-8 py-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
