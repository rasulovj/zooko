"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const user = {
    progress: 45,
    subjects: [
      { id: "python", title: "Python Asoslari", icon: "🐍", progress: 50 },
      {
        id: "algorithms-logic",
        title: "Algoritmlar & Mantiq",
        icon: "🧠",
        progress: 30,
      },
      {
        id: "coding-games",
        title: "O‘yinlar bilan Kodlash",
        icon: "🎮",
        progress: 70,
      },
      {
        id: "internet-safety",
        title: "Internet Xavfsizligi",
        icon: "🌐",
        progress: 20,
      },
    ],
  };

  const router = useRouter();

  return (
    <div className="space-y-10 pt-[64px]">
      <Card className="rounded-3xl shadow-sm">
        <CardContent className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Umumiy Natija</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="h-4 rounded-full bg-primary"
              style={{ width: `${user.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{user.progress}% bajarildi</p>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Fanlaringiz</h2>
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
                  {subject.progress}% bajarildi
                </p>
                <Button
                  className="mt-4 w-full"
                  size="sm"
                  onClick={() => router.push(`/dashboard/${subject.id}`)}
                >
                  Davom etish
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
