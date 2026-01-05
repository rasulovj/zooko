"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip"; // optional, if you have a tooltip component
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
      title: "Beginner",
      description: "Complete your first lesson",
      icon: "🏅",
      unlocked: true,
    },
    {
      id: "quiz_master",
      title: "Quiz Master",
      description: "Score 100% on a quiz",
      icon: "🧠",
      unlocked: false,
    },
    {
      id: "coder",
      title: "Coder",
      description: "Submit 10 coding exercises",
      icon: "💻",
      unlocked: true,
    },
    {
      id: "python_pro",
      title: "Python Pro",
      description: "Complete Python Basics course",
      icon: "🐍",
      unlocked: false,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Badges</h1>
      <p className="mb-8 text-gray-600">
        Collect badges by completing lessons, quizzes, and coding exercises.
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
                Locked
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* Optional: show total badges progress */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Badge Completion
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
          {badges.filter((b) => b.unlocked).length} / {badges.length} badges
          unlocked
        </p>
      </div>
    </div>
  );
};

export default BadgesPage;
