"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PythonLessonPage = () => {
  const router = useRouter();

  const user = {
    name: "Alex",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  const sidebarItems = [
    { id: "dashboard", title: "Dashboard", path: "/dashboard" },
    { id: "subjects", title: "Subjects", path: "/dashboard/subjects" },
    { id: "progress", title: "Progress", path: "/dashboard/progress" },
    { id: "badges", title: "Badges", path: "/dashboard/badges" },
    { id: "settings", title: "Settings", path: "/dashboard/settings" },
    { id: "logout", title: "Logout", path: "/logout" },
  ];

  const [activeItem, setActiveItem] = useState("Python Basics");
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);

  const handleQuizChange = (q: string, answer: string) => {
    setQuizAnswers((prev) => ({ ...prev, [q]: answer }));
  };

  const handleSubmitQuiz = () => {
    const correctAnswers = { q1: "High-level", q2: "Dynamic" };
    let score = 0;
    (Object.keys(correctAnswers) as Array<keyof typeof correctAnswers>).forEach(
      (q) => {
        if (quizAnswers[q] === correctAnswers[q]) score++;
      }
    );
    setQuizResult(
      `You scored ${score} / ${Object.keys(correctAnswers).length}`
    );
  };

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
              key={item.id}
              className={`block w-full text-left px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-primary hover:text-white transition ${
                activeItem === item.title ? "bg-primary text-white" : ""
              }`}
              onClick={() => {
                setActiveItem(item.title);
                // Navigate to the page
                router.push(item.path);
              }}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-10 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{activeItem}</h1>

        {activeItem === "Python Basics" && (
          <div className="space-y-10">
            {/* Video Lesson */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Video Lesson
              </h2>
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/rfscVS0vtbw"
                  title="Python Basics"
                  allowFullScreen
                />
              </div>
            </section>

            {/* Lesson Objectives */}
            <section className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: "🎯",
                  title: "Understand Syntax",
                  desc: "Learn Python code structure",
                },
                {
                  icon: "🧩",
                  title: "Work with Variables",
                  desc: "Declare & use variables",
                },
                {
                  icon: "⚡",
                  title: "Run Programs",
                  desc: "Write scripts and see results",
                },
              ].map((obj) => (
                <Card
                  key={obj.title}
                  className="rounded-2xl shadow-sm p-6 flex flex-col items-center text-center"
                >
                  <div className="text-3xl mb-2">{obj.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {obj.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{obj.desc}</p>
                </Card>
              ))}
            </section>

            {/* Quiz */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Quiz
              </h2>
              {[
                {
                  id: "q1",
                  question: "Python is a __________ language.",
                  options: ["High-level", "Low-level", "Assembly"],
                },
                {
                  id: "q2",
                  question: "Python is __________ typed.",
                  options: ["Static", "Dynamic", "Manual"],
                },
              ].map((q) => (
                <Card key={q.id} className="rounded-3xl shadow-sm mb-4">
                  <CardContent>
                    <p className="mb-2 font-medium text-gray-900">
                      {q.question}
                    </p>
                    {q.options.map((ans) => (
                      <label key={ans} className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          name={q.id}
                          value={ans}
                          onChange={() => handleQuizChange(q.id, ans)}
                        />
                        {ans}
                      </label>
                    ))}
                  </CardContent>
                </Card>
              ))}
              <Button onClick={handleSubmitQuiz} className="mt-2">
                Submit Answers
              </Button>
              {quizResult && (
                <p className="mt-4 text-green-600 font-medium">{quizResult}</p>
              )}
            </section>

            {/* Coding Playground */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Try Coding
              </h2>
              <Card className="rounded-3xl shadow-sm">
                <CardContent>
                  <textarea
                    className="w-full h-48 p-4 border rounded-lg font-mono text-sm mb-4"
                    placeholder="print('Hello Zooko!')"
                  />
                  <Button className="w-full">Run Code</Button>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default PythonLessonPage;
