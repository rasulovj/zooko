"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip"; // agar tooltip komponenti bo'lsa
import { Button } from "@/components/ui/button";

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const BadgesPage = () => {
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "beginner",
      title: "Boshlovchi",
      description: "Birinchi darsni yakunlang",
      icon: "🏅",
      unlocked: true,
    },
    {
      id: "quiz_master",
      title: "Quiz Ustasi",
      description: "Testdan 100% natija oling",
      icon: "🧠",
      unlocked: false,
    },
    {
      id: "coder",
      title: "Kodlovchi",
      description: "10 ta kodlash topshirig‘ini bajaring",
      icon: "💻",
      unlocked: true,
    },
    {
      id: "python_pro",
      title: "Python Pro",
      description: "Python Asoslari kursini yakunlang",
      icon: "🐍",
      unlocked: false,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Sizning Belgilaringiz
      </h1>
      <p className="mb-8 text-gray-600">
        Darslar, testlar va kodlash topshiriqlarini bajarganingizda belgilar
        to‘plang.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => (
          <Card
            key={badge.id}
            className={`rounded-3xl shadow-sm p-6 flex flex-col items-center text-center transition-transform hover:scale-105 ${
              !badge.unlocked ? "opacity-40 grayscale" : ""
            }`}
          >
            <div className="text-5xl mb-4">{badge.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{badge.title}</h3>
            <p className="text-gray-600 text-sm">{badge.description}</p>

            {!badge.unlocked && (
              <Button
                className="mt-4 w-full"
                size="sm"
                variant="outline"
                disabled
              >
                Qulflangan
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* Umumiy belgilar progressi */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Belgilarni Yakunlash
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="h-4 rounded-full bg-primary transition-all"
            style={{
              width: `${
                (badges.filter((b) => b.unlocked).length / badges.length) * 100
              }%`,
            }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {badges.filter((b) => b.unlocked).length} / {badges.length} belgi
          ochilgan
        </p>
      </div>
    </div>
  );
};

export default BadgesPage;
