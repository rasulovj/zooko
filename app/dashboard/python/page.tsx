"use client";

import { useState } from "react";
import {
  ChevronDown,
  CheckCircle,
  Play,
  Code,
  Award,
  Book,
  Zap,
  MessageCircle,
  Lightbulb,
  Gamepad2,
  Target,
  Brain,
  Send,
} from "lucide-react";

const PythonLessonPage = () => {
  const [openLesson, setOpenLesson] = useState<string>("lesson1");
  const [activeTab, setActiveTab] = useState<"video" | "quiz" | "games" | "ai">(
    "video"
  );
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: string; text: string }>
  >([
    {
      role: "ai",
      text: "Salom! Men sizning Python bo‘yicha o‘qituvchingizman. Python haqida istalgan savol berishingiz mumkin!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [codeChallenge, setCodeChallenge] = useState(0);

  const courseData = [
    {
      id: "lesson1",
      title: "Python asoslari",
      duration: "45 min",
      level: "Boshlang‘ich",
      icon: "📚",
      video: "https://www.youtube.com/embed/rfscVS0vtbw",
      description:
        "Python sintaksisi va dasturlash asoslarini o‘rganing. O‘zgaruvchilar, ma’lumot turlari va asosiy amallarni egallang.",
      quizzes: [
        {
          id: "q1",
          question: "Python qaysi turdagi dasturlash tili?",
          options: ["Yükori darajali", "Past darajali", "Assembly"],
          correct: "Yükori darajali",
        },
        {
          id: "q2",
          question: "Pythonning tip modeli qanday?",
          options: ["Statik", "Dinamik", "Qo‘lda"],
          correct: "Dinamik",
        },
        {
          id: "q3",
          question: "Python izohini qaysi belgi boshlaydi?",
          options: ["//", "#", "/*"],
          correct: "#",
        },
      ],
    },
    {
      id: "lesson2",
      title: "Nazorat tuzilmalari",
      duration: "52 min",
      level: "Boshlang‘ich",
      icon: "🔄",
      video: "https://www.youtube.com/embed/9Os0o3wzS_I",
      description:
        "If bayonotlari, for va while tsikllarini o‘rganing. Qaror qabul qilish va ma’lumotlar orqali iteratsiya qilishni egallang.",
      quizzes: [
        {
          id: "q4",
          question:
            "Agar takrorlashlar soni ma’lum bo‘lsa, qaysi tsikl ishlatiladi?",
          options: ["while", "for", "do-while"],
          correct: "for",
        },
        {
          id: "q5",
          question: "Shartli bayonotlar uchun qaysi kalit so‘z ishlatiladi?",
          options: ["switch", "if", "select"],
          correct: "if",
        },
      ],
    },
    {
      id: "lesson3",
      title: "Funktsiyalar va Tsikllar",
      duration: "58 min",
      level: "O‘rta",
      icon: "⚙️",
      video: "https://www.youtube.com/embed/rfscVS0vtbw",
      description:
        "Qayta ishlatiladigan funktsiyalar yarating va scope (ko‘lam)ni tushuning. Murakkab tsikl naqshlari va funktsiya dizaynini egallang.",
      quizzes: [],
    },
    {
      id: "lesson4",
      title: "Ma’lumot tuzilmalari",
      duration: "64 min",
      level: "O‘rta",
      icon: "📦",
      video: "https://www.youtube.com/embed/9Os0o3wzS_I",
      description:
        "Listlar, tuplelar, lug‘atlar va setlarni o‘rganing. Har bir tuzilmani qachon samarali ishlatishni tushuning.",
      quizzes: [],
    },
    {
      id: "lesson5",
      title: "Obyektga yo‘naltirilgan dasturlash",
      duration: "75 min",
      level: "Ilg‘or",
      icon: "🏛️",
      video: "https://www.youtube.com/embed/rfscVS0vtbw",
      description:
        "Klasslar, meros olish va polimorfizmni o‘rganing. Kengaytiriladigan va texnik xizmat ko‘rsatish uchun qulay dasturlar yarating.",
      quizzes: [],
    },
  ];

  // Interaktiv o‘yinlar
  const games = [
    {
      id: "syntax-match",
      name: "Sintaksis moslash",
      description: "Python kalit so‘zlarini ularning ma’nolari bilan moslang",
      icon: "🎯",
    },
    {
      id: "type-guess",
      name: "Tipni topish",
      description: "Berilgan qiymatlarning ma’lumot turini toping",
      icon: "🔍",
    },
    {
      id: "code-complete",
      name: "Kod to‘ldirish",
      description: "Kod snippetlaridagi bo‘sh joylarni to‘ldiring",
      icon: "✏️",
    },
    {
      id: "debug-hunt",
      name: "Xatolik qidirish",
      description: "Python kodidagi xatoliklarni toping va tuzating",
      icon: "🐛",
    },
    {
      id: "logic-puzzle",
      name: "Mantiqiy jumboq",
      description: "Python mantiqiy jumboqlari va vazifalarni yeching",
      icon: "🧩",
    },
  ];

  // Syntax Match Game
  const SyntaxMatchGame = () => {
    const [matched, setMatched] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);

    const pairs = [
      { keyword: "print()", meaning: "Display output" },
      { keyword: "input()", meaning: "Get user input" },
      { keyword: "len()", meaning: "Get length of object" },
      { keyword: "range()", meaning: "Generate sequence of numbers" },
    ];

    const handleMatch = (keyword: string, meaning: string) => {
      if (selected === keyword) {
        setMatched([...matched, keyword]);
        setSelected(null);
        setGameScore(gameScore + 10);
      }
    };

    return (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900">Keywords</h4>
            {pairs.map((p) => (
              <button
                key={p.keyword}
                onClick={() =>
                  setSelected(matched.includes(p.keyword) ? null : p.keyword)
                }
                disabled={matched.includes(p.keyword)}
                className={`w-full p-3 rounded-lg font-mono text-left transition-all ${
                  matched.includes(p.keyword)
                    ? "bg-green-100 text-green-700 cursor-default"
                    : selected === p.keyword
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {p.keyword}
                {matched.includes(p.keyword) && " ✓"}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900">Meanings</h4>
            {pairs.map((p) => (
              <button
                key={p.meaning}
                onClick={() => selected && handleMatch(selected, p.meaning)}
                disabled={matched.includes(selected || "")}
                className="w-full p-3 rounded-lg text-left hover:bg-blue-50 bg-gray-50 border-2 border-gray-200 hover:border-blue-400 transition-all"
              >
                {p.meaning}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
          <span className="font-bold">Score: {gameScore}</span>
          <span className="text-sm text-gray-600">
            Matched: {matched.length}/4
          </span>
        </div>
      </div>
    );
  };

  // Type Guesser Game
  const TypeGuesserGame = () => {
    const [score, setScore] = useState(0);
    const [current, setCurrent] = useState(0);

    const challenges = [
      { value: "42", correct: "int", options: ["int", "str", "float"] },
      { value: "'Hello'", correct: "str", options: ["str", "int", "bool"] },
      { value: "3.14", correct: "float", options: ["float", "int", "str"] },
      { value: "True", correct: "bool", options: ["bool", "str", "int"] },
    ];

    const handleAnswer = (answer: string) => {
      if (answer === challenges[current].correct) {
        setScore(score + 25);
        if (current < challenges.length - 1) {
          setCurrent(current + 1);
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-8">
          <p className="text-center text-gray-600 mb-4">
            What is the type of this value?
          </p>
          <p className="text-center text-4xl font-mono font-bold text-gray-900">
            {challenges[current].value}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {challenges[current].options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className="p-4 rounded-lg font-bold border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="bg-purple-50 p-4 rounded-lg flex justify-between">
          <span className="font-bold">Score: {score}</span>
          <span className="text-sm text-gray-600">
            {current + 1}/{challenges.length}
          </span>
        </div>
      </div>
    );
  };

  // Code Complete Game
  const CodeCompleteGame = () => {
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [submitted, setSubmitted] = useState(false);

    const challenges = [
      {
        id: 0,
        code: "for i in range(___): \n    print(i)",
        answer: "5",
        hint: "How many numbers from 0-4?",
      },
      {
        id: 1,
        code: "x = ___ \nif x > 10: \n    print('Big')",
        answer: "15",
        hint: "Use a number greater than 10",
      },
    ];

    const handleSubmit = () => {
      let correct = 0;
      challenges.forEach((c) => {
        if (answers[c.id] === c.answer) correct++;
      });
      setGameScore(correct * 50);
      setSubmitted(true);
    };

    return (
      <div className="space-y-4">
        {challenges.map((c) => (
          <div key={c.id} className="bg-gray-900 rounded-lg p-4">
            <pre className="text-green-400 font-mono text-sm mb-3">
              {c.code}
            </pre>
            <input
              type="text"
              placeholder={c.hint}
              value={answers[c.id] || ""}
              onChange={(e) =>
                setAnswers({ ...answers, [c.id]: e.target.value })
              }
              className="w-full p-2 rounded border-2 border-gray-600 bg-gray-800 text-white font-mono"
              disabled={submitted}
            />
            {submitted && (
              <p
                className={
                  answers[c.id] === c.answer
                    ? "text-green-500 mt-2"
                    : "text-red-500 mt-2"
                }
              >
                {answers[c.id] === c.answer
                  ? "✓ Correct!"
                  : `✗ Answer: ${c.answer}`}
              </p>
            )}
          </div>
        ))}
        {!submitted && (
          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors"
          >
            Submit
          </button>
        )}
      </div>
    );
  };

  // Debug Hunt Game
  const DebugHuntGame = () => {
    const [found, setFound] = useState<number[]>([]);

    const buggyCode = [
      { id: 0, line: "x = 10", bug: false },
      { id: 1, line: "print(x + 5", bug: true, fix: "print(x + 5)" },
      { id: 2, line: "y = 'hello'", bug: false },
      { id: 3, line: "z = x + y", bug: true, fix: "z = str(x) + y" },
    ];

    const toggleBug = (id: number) => {
      if (found.includes(id)) {
        setFound(found.filter((f) => f !== id));
      } else {
        if (buggyCode[id].bug) {
          setFound([...found, id]);
          setGameScore(gameScore + 15);
        }
      }
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Click on lines with bugs 🐛
        </p>
        {buggyCode.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleBug(item.id)}
            className={`w-full text-left p-4 rounded-lg font-mono text-sm transition-all ${
              found.includes(item.id)
                ? "bg-red-100 border-2 border-red-500"
                : item.bug && !found.includes(item.id)
                ? "bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-300 cursor-pointer"
                : "bg-gray-50 border-2 border-gray-300"
            }`}
          >
            <div className="flex justify-between items-start">
              <span>{item.line}</span>
              {found.includes(item.id) && (
                <span className="text-red-600 font-bold">BUG!</span>
              )}
            </div>
            {found.includes(item.id) && item.fix && (
              <span className="text-green-600 text-xs mt-2 block">
                Fix: {item.fix}
              </span>
            )}
          </button>
        ))}
        <div className="bg-blue-50 p-4 rounded-lg">
          <span className="font-bold">Found: {found.length}/2 bugs</span>
          <span className="ml-4 text-sm text-gray-600">Score: {gameScore}</span>
        </div>
      </div>
    );
  };

  // AI Chatbot
  const AIResponses: { [key: string]: string } = {
    "what is python":
      "Python is a high-level, interpreted programming language known for its simplicity and readability. It's great for beginners!",
    "how do i print": "Use the print() function! Example: print('Hello World')",
    "what is a variable":
      "A variable is a named container that stores a value. Example: x = 5",
    "what is a loop":
      "A loop repeats a block of code. Python has 'for' and 'while' loops.",
    "what is a function":
      "A function is a reusable block of code. Define with 'def' keyword.",
    "how do i install python":
      "Visit python.org and download the latest version for your operating system.",
    "what is a list":
      "A list is an ordered, mutable collection of items. Example: my_list = [1, 2, 3]",
    default:
      "That's a great question! Try asking about Python basics, variables, loops, functions, or data types.",
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    setChatMessages([...chatMessages, { role: "user", text: chatInput }]);

    const lowerInput = chatInput.toLowerCase();
    let response = AIResponses.default;

    Object.keys(AIResponses).forEach((key) => {
      if (lowerInput.includes(key)) {
        response = AIResponses[key];
      }
    });

    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: "ai", text: response }]);
    }, 300);

    setChatInput("");
  };

  const toggleLesson = (lessonId: string) => {
    setOpenLesson(openLesson === lessonId ? "" : lessonId);
    setActiveTab("video");
  };

  const handleQuizChange = (q: string, answer: string) => {
    setQuizAnswers((prev) => ({ ...prev, [q]: answer }));
  };

  const handleSubmitQuiz = (lessonId: string, quizzes: any[]) => {
    let score = 0;
    quizzes.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) score++;
    });
    setQuizResult(`You got ${score} out of ${quizzes.length} correct! 🎉`);
  };

  const getProgressPercentage = () => {
    return Math.round(
      (courseData.filter((l) => l.id <= openLesson).length /
        courseData.length) *
        100
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Python asoslari</h1>
              <p className="text-blue-100 mt-1">
                Interfaol ta'lim bilan asosiy narsalarni o'zlashtiring
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Progress</span>
              <span className="font-bold">{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-blue-400 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          {[
            { icon: Play, label: "Darslar", value: courseData.length },
            { icon: Gamepad2, label: "O'yinlar", value: games.length },
            { icon: Zap, label: "Soat", value: "5+" },
            { icon: Award, label: "Daraja", value: "All" },
            { icon: Brain, label: "AI yordami", value: "24/7" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <stat.icon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Lessons */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Kurs rejasi:
            </h2>
            {courseData.map((lesson) => (
              <div key={lesson.id} className="group">
                <button
                  onClick={() => toggleLesson(lesson.id)}
                  className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-left border-l-4 border-transparent hover:border-blue-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl mt-1">{lesson.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {lesson.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              lesson.level === "Beginner"
                                ? "bg-green-100 text-green-700"
                                : lesson.level === "Intermediate"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {lesson.level}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {lesson.description}
                        </p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>⏱️ {lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-400 transition-transform duration-300 mt-2 ${
                        openLesson === lesson.id ? "transform rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Content */}
                {openLesson === lesson.id && (
                  <div className="mt-4 bg-white rounded-2xl shadow-md overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 bg-gray-50">
                      {[
                        { id: "video", icon: Play, label: "Video" },
                        {
                          id: "quiz",
                          icon: Award,
                          label: "Quiz",
                          disabled: lesson.quizzes.length === 0,
                        },
                        { id: "games", icon: Gamepad2, label: "Games" },
                      ].map((tab: any) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          disabled={tab.disabled}
                          className={`flex-1 flex items-center justify-center gap-2 py-4 border-b-2 transition-all ${
                            activeTab === tab.id
                              ? "border-blue-600 text-blue-600 bg-white"
                              : tab.disabled
                              ? "text-gray-300 cursor-not-allowed"
                              : "border-transparent text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <tab.icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="p-8">
                      {/* Video Tab */}
                      {activeTab === "video" && (
                        <div className="space-y-3">
                          <h4 className="text-lg font-bold text-gray-900">
                            Lesson Video
                          </h4>
                          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                            <iframe
                              className="w-full h-full"
                              src={lesson.video}
                              title={lesson.title}
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}

                      {/* Quiz Tab */}
                      {activeTab === "quiz" && lesson.quizzes.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Award className="w-5 h-5 text-blue-600" />
                            <h4 className="text-lg font-bold text-gray-900">
                              Lesson Quiz
                            </h4>
                          </div>
                          {lesson.quizzes.map((q, idx) => (
                            <div
                              key={q.id}
                              className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                            >
                              <p className="font-semibold text-gray-900 mb-4">
                                Q{idx + 1}: {q.question}
                              </p>
                              <div className="space-y-3">
                                {q.options.map((opt) => (
                                  <label
                                    key={opt}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      value={opt}
                                      onChange={() =>
                                        handleQuizChange(q.id, opt)
                                      }
                                      className="w-4 h-4 accent-blue-600"
                                    />
                                    <span className="text-gray-700">{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() =>
                              handleSubmitQuiz(lesson.id, lesson.quizzes)
                            }
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-4"
                          >
                            Submit Quiz
                          </button>
                          {quizResult && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <p className="text-green-700 font-medium">
                                {quizResult}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Games Tab */}
                      {activeTab === "games" && (
                        <div className="space-y-6">
                          {!currentGame ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {games.map((game) => (
                                <button
                                  key={game.id}
                                  onClick={() => setCurrentGame(game.id)}
                                  className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 hover:shadow-lg transition-all text-left"
                                >
                                  <div className="text-3xl mb-3">
                                    {game.icon}
                                  </div>
                                  <h4 className="font-bold text-gray-900 mb-1">
                                    {game.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {game.description}
                                  </p>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div>
                              <button
                                onClick={() => setCurrentGame(null)}
                                className="mb-4 text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
                              >
                                ← Back to Games
                              </button>
                              {currentGame === "syntax-match" && (
                                <SyntaxMatchGame />
                              )}
                              {currentGame === "type-guess" && (
                                <TypeGuesserGame />
                              )}
                              {currentGame === "code-complete" && (
                                <CodeCompleteGame />
                              )}
                              {currentGame === "debug-hunt" && (
                                <DebugHuntGame />
                              )}
                              {currentGame === "logic-puzzle" && (
                                <div className="bg-blue-50 p-6 rounded-lg text-center">
                                  <p className="text-lg font-bold text-gray-900">
                                    Logic Puzzle Coming Soon!
                                  </p>
                                  <p className="text-gray-600 mt-2">
                                    More challenging puzzles will be added soon.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-20 flex flex-col h-[500px]">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                <h3 className="font-bold">Python AI Tutor</h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                    placeholder="Ask me anything..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleChatSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Ask about Python concepts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonLessonPage;
