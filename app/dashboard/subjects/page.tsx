"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const subjects = [
  {
    id: "python",
    title: "Python Basics",
    icon: "🐍",
    description: "Learn Python from scratch",
  },
  {
    id: "web-intro",
    title: "Intro to Web",
    icon: "🌐",
    description: "HTML, CSS & JS basics",
  },
  {
    id: "algorithms-logic",
    title: "Algorithms & Logic",
    icon: "🧠",
    description: "Problem-solving skills",
  },
  {
    id: "coding-games",
    title: "Coding with Games",
    icon: "🎮",
    description: "Learn coding with fun games",
  },
  {
    id: "internet-safety",
    title: "Internet Safety",
    icon: "🔒",
    description: "Stay safe online",
  },
];

export const SubjectsPage = () => {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card
            key={subject.id}
            className="rounded-3xl shadow-sm hover:shadow-md transition"
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white text-xl">
                {subject.icon}
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {subject.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                {subject.description}
              </p>
              <Button
                className="w-full"
                size="sm"
                onClick={() => router.push(`/dashboard/subjects/${subject.id}`)}
              >
                Start Learning
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubjectsPage;
