"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PythonLessonPage = () => {
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
    <div className="px-8 py-10 overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Python Basics</h1>

      {/* Video Lesson */}
      <section className="mb-10">
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
      <section className="grid gap-4 md:grid-cols-3 mb-10">
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
            <h3 className="font-semibold text-gray-900 mb-1">{obj.title}</h3>
            <p className="text-gray-600 text-sm">{obj.desc}</p>
          </Card>
        ))}
      </section>

      {/* Quiz */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quiz</h2>
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
              <p className="mb-2 font-medium text-gray-900">{q.question}</p>
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
  );
};

export default PythonLessonPage;
