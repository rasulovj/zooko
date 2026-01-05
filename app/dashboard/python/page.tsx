"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const PythonLessonPage = () => {
  // Quiz holati
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);

  const handleQuizChange = (q: string, answer: string) => {
    setQuizAnswers((prev) => ({ ...prev, [q]: answer }));
  };

  const handleSubmitQuiz = () => {
    const correctAnswers = { q1: "High-level", q2: "Dynamic", q3: "print()" };
    let score = 0;
    (Object.keys(correctAnswers) as Array<keyof typeof correctAnswers>).forEach(
      (q) => {
        if (quizAnswers[q] === correctAnswers[q]) score++;
      }
    );
    setQuizResult(
      `Siz ${score} / ${
        Object.keys(correctAnswers).length
      } to'g'ri javob berdingiz`
    );
  };

  // Inside PythonLessonPage component, after Drag & Drop section
  // ---------------- Output Prediction Game ----------------
  const [outputExercises] = useState([
    {
      id: "out1",
      code: ["for i in range(3):", "    print(i*2)"],
      options: ["0 2 4", "1 2 3", "0 1 2"],
      correctAnswer: "0 2 4",
    },
    {
      id: "out2",
      code: [
        "x = 5",
        "if x > 3:",
        "    print('X katta')",
        "else:",
        "    print('X kichik')",
      ],
      options: ["X katta", "X kichik", "Hech narsa"],
      correctAnswer: "X katta",
    },
    {
      id: "out3",
      code: [
        "count = 0",
        "while count < 3:",
        "    print(count)",
        "    count += 1",
      ],
      options: ["0 1 2", "1 2 3", "0 1 2 3"],
      correctAnswer: "0 1 2",
    },
  ]);

  const [predictedAnswers, setPredictedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [predictionResults, setPredictionResults] = useState<{
    [key: string]: string;
  }>({});

  const handlePredictionChange = (id: string, answer: string) => {
    setPredictedAnswers((prev) => ({ ...prev, [id]: answer }));
  };

  const checkPredictions = (id: string, correctAnswer: string) => {
    const userAnswer = predictedAnswers[id];
    setPredictionResults((prev) => ({
      ...prev,
      [id]:
        userAnswer === correctAnswer
          ? "To'g'ri!"
          : `Xato! To'g'ri javob: ${correctAnswer}`,
    }));
  };

  // Drag & Drop o'yin tayyorlash
  const exercises = [
    {
      id: "ex1",
      description: "'Hello Zooko!' va Python salomlashuvini chiqarish",
      lines: ["print('Hello Zooko!')", "print('Pythonga xush kelibsiz!')"],
    },
    {
      id: "ex2",
      description: "if-operatorini to'g'ri tartibda joylashtiring",
      lines: [
        "if 5 > 3:",
        "    print('5 3 dan katta')",
        "    print('Shunday ekan!')",
        "print('Bu tashqarida')",
      ],
    },
    {
      id: "ex3",
      description: "for-loop yordamida raqamlarni chiqarish",
      lines: [
        "for i in range(5):",
        "    print('Raqam:', i)",
        "print('Loop tugadi')",
      ],
    },
    {
      id: "ex4",
      description: "while-loop bilan hisoblash",
      lines: [
        "count = 0",
        "while count < 3:",
        "    print('Count:', count)",
        "    count += 1",
        "print('While loop tugadi')",
      ],
    },
    {
      id: "ex5",
      description: "If-elif-else shartlarini tartibga solish",
      lines: [
        "x = 7",
        "if x < 5:",
        "    print('X kichik')",
        "elif x == 7:",
        "    print('X yetti')",
        "else:",
        "    print('X katta')",
        "print('Shart tugadi')",
      ],
    },
  ];

  const [codeExercises, setCodeExercises] = useState(
    exercises.map((ex) => ({
      ...ex,
      shuffled: ex.lines.sort(() => Math.random() - 0.5),
    }))
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (exIndex: number) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = codeExercises[exIndex].shuffled.indexOf(
        active.id as string
      );
      const newIndex = codeExercises[exIndex].shuffled.indexOf(
        over.id as string
      );

      setCodeExercises((prev) => {
        const updated = [...prev];
        updated[exIndex].shuffled = arrayMove(
          updated[exIndex].shuffled,
          oldIndex,
          newIndex
        );
        return updated;
      });
    }
  };

  const checkCodeOrder = (exIndex: number) => {
    const ex = codeExercises[exIndex];
    const isCorrect = ex.shuffled.join("\n") === ex.lines.join("\n");
    alert(isCorrect ? "To'g'ri tartib!" : "Qayta urinib ko'ring!");
  };

  const SortableItem = ({ id }: { id: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-2 bg-gray-800 text-white font-mono rounded cursor-move hover:bg-gray-700 shadow"
      >
        {id}
      </div>
    );
  };

  return (
    <div className="px-6 md:px-10 py-10 space-y-12">
      <h1 className="text-3xl font-bold text-gray-900">Python Asoslari</h1>

      {/* Video dars */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Video Dars
        </h2>
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/rfscVS0vtbw"
            title="Python Basics"
            allowFullScreen
          />
        </div>
      </section>

      {/* Dars maqsadlari */}
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            icon: "🎯",
            title: "Sintaksisni tushunish",
            desc: "Python kod tuzilishini o'rganing",
          },
          {
            icon: "🧩",
            title: "O'zgaruvchilar bilan ishlash",
            desc: "O'zgaruvchilarni e'lon qiling va ishlating",
          },
          {
            icon: "⚡",
            title: "Dasturlarni ishga tushirish",
            desc: "Skriptlar yozing va natijani ko'ring",
          },
        ].map((obj) => (
          <Card
            key={obj.title}
            className="rounded-2xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">{obj.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{obj.title}</h3>
            <p className="text-gray-600 text-sm">{obj.desc}</p>
          </Card>
        ))}
      </section>

      {/* Testlar */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Testlar</h2>
        {[
          {
            id: "q1",
            question: "Python qanday turdagi dasturlash tili?",
            options: ["High-level", "Low-level", "Assembly"],
          },
          {
            id: "q2",
            question: "Python qanday turda yoziladi?",
            options: ["Statik", "Dinamik", "Qo'lda"],
          },
          {
            id: "q3",
            question: "Natijani ekranga chiqaradigan funksiyani tanlang",
            options: ["echo()", "print()", "write()"],
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
          Javoblarni yuborish
        </Button>
        {quizResult && (
          <p className="mt-4 text-green-600 font-medium">{quizResult}</p>
        )}
      </section>

      {/* Drag & Drop mashqlar */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Kodlarni tartibga solish
        </h2>

        {codeExercises.map((ex, idx) => (
          <Card key={ex.id} className="rounded-3xl shadow-sm p-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {ex.description}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="bg-gray-100 p-4 rounded-xl space-y-3">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd(idx)}
                >
                  <SortableContext
                    items={ex.shuffled}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-3">
                      {ex.shuffled.map((line, lineIdx) => (
                        <SortableItem key={line} id={line}>
                          <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm cursor-move hover:bg-gray-50">
                            {line}
                          </div>
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              <Button
                className="mt-4 w-full md:w-40"
                onClick={() => checkCodeOrder(idx)}
              >
                Tekshirish
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Output Prediction Game
        </h2>

        {outputExercises.map((ex) => (
          <Card key={ex.id} className="rounded-3xl shadow-sm p-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Predict Output
              </CardTitle>
            </CardHeader>

            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-xl text-gray-800 font-mono">
                {ex.code.join("\n")}
              </pre>

              <div className="mt-4 flex flex-col gap-2">
                {ex.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={ex.id}
                      value={opt}
                      onChange={() => handlePredictionChange(ex.id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>

              <Button
                className="mt-4 w-full md:w-40"
                onClick={() => checkPredictions(ex.id, ex.correctAnswer)}
              >
                Tekshirish
              </Button>

              {predictionResults[ex.id] && (
                <p className="mt-2 font-medium text-green-600">
                  {predictionResults[ex.id]}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default PythonLessonPage;
