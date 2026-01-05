"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const subjects = [
  {
    id: "python",
    title: "Python Asoslari",
    icon: "🐍",
    description: "Pythonni boshidan o‘rganing",
    image:
      "https://images.unsplash.com/photo-1649180556628-9ba704115795?q=80&w=2324&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "web-intro",
    title: "Veb Dasturlash Kirish",
    icon: "🌐",
    description: "HTML, CSS va JS asoslari",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2372&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "algorithms-logic",
    title: "Algoritmlar va Mantiq",
    icon: "🧠",
    description: "Muammo yechish ko‘nikmalari",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "coding-games",
    title: "O‘yinlar orqali dasturlash",
    icon: "🎮",
    description: "Kodlashni qiziqarli o‘yinlar bilan o‘rganing",
    image:
      "https://plus.unsplash.com/premium_photo-1664908294339-ed02fdc1b806?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "internet-safety",
    title: "Internet Xavfsizligi",
    icon: "🔒",
    description: "Onlayn xavfsizlikni o‘rganing",
    image:
      "https://plus.unsplash.com/premium_photo-1683836722608-60ab4d1b58e5?q=80&w=2224&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export const SubjectsPage = () => {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Fanlar</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card
            key={subject.id}
            className="relative rounded-3xl shadow-lg overflow-hidden hover:scale-105 transition-transform"
          >
            {/* Fon rasmi */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${subject.image})` }}
            />
            <div className="absolute inset-0 bg-black/30"></div>

            <CardContent className="relative flex flex-col items-center text-center text-white p-6">
              <div className="flex items-center justify-center mb-4 h-16 w-16 rounded-full bg-white/20 text-3xl">
                {subject.icon}
              </div>
              <CardTitle className="text-xl font-bold">
                {subject.title}
              </CardTitle>
              <p className="text-sm mt-2 mb-4">{subject.description}</p>
              <Button
                size="sm"
                className="w-full bg-white text-gray-900 hover:bg-gray-200"
                onClick={() => router.push(`/dashboard/subjects/${subject.id}`)}
              >
                O‘rganishni boshlash
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubjectsPage;
