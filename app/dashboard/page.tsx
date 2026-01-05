"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const router = useRouter();

  // Random user data
  const user = {
    name: "Alex",
    avatar: "https://i.pravatar.cc/150?img=3",
    progress: 45,
    subjects: [
      { id: "python", title: "Python Basics", icon: "🐍", progress: 50 },
      {
        id: "algorithms-logic",
        title: "Algorithms & Logic",
        icon: "🧠",
        progress: 30,
      },
      {
        id: "coding-games",
        title: "Coding with Games",
        icon: "🎮",
        progress: 70,
      },
      {
        id: "internet-safety",
        title: "Internet & Safety",
        icon: "🌐",
        progress: 20,
      },
    ],
  };

  const [activeItem, setActiveItem] = useState("Dashboard");

  const sidebarItems = [
    "Dashboard",
    "Subjects",
    "Progress",
    "Badges",
    "Settings",
    "Logout",
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r px-6 py-8 flex flex-col">
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

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item}
              className={`block w-full text-left px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-primary hover:text-white transition ${
                activeItem === item ? "bg-primary text-white" : ""
              }`}
              onClick={() => setActiveItem(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-10 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{activeItem}</h1>

        {activeItem === "Dashboard" && (
          <div className="space-y-10">
            {/* Overall Progress */}
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Overall Progress
                </h2>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full bg-primary"
                    style={{ width: `${user.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {user.progress}% completed
                </p>
              </CardContent>
            </Card>

            {/* Subjects */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Your Subjects
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {user.subjects.map((subject) => (
                  <Card key={subject.id} className="rounded-3xl shadow-sm">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white text-xl">
                        {subject.icon}
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {subject.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-primary"
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {subject.progress}% completed
                      </p>
                      <Button
                        className="mt-4 w-full"
                        size="sm"
                        onClick={() => router.push(`/dashboard/${subject.id}`)}
                      >
                        Continue
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeItem !== "Dashboard" && (
          <div className="text-gray-500 text-center py-20">
            <p>Content for {activeItem} will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
