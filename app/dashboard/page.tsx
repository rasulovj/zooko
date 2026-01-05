"use client";
import { useState } from "react";

const DashboardPage = () => {
  const [hoveredSubject, setHoveredSubject] = useState(null);

  const user = {
    name: "Islom",
    level: "Oraliq",
    streak: 12,
    totalPoints: 2850,
    progress: 45,
    subjects: [
      {
        id: "python",
        title: "Python Asoslari",
        icon: "🐍",
        progress: 65,
        lessons: 15,
        completedLessons: 10,
        points: 950,
        nextLesson: "Funksiyalar",
        color: "from-green-400 to-green-600",
      },
      {
        id: "algorithms",
        title: "Algoritmlar & Mantiq",
        icon: "🧠",
        progress: 35,
        lessons: 20,
        completedLessons: 7,
        points: 680,
        nextLesson: "Qidiruv Algoritmlari",
        color: "from-blue-400 to-blue-600",
      },
      {
        id: "games",
        title: "O'yinlar bilan Kodlash",
        icon: "🎮",
        progress: 72,
        lessons: 12,
        completedLessons: 9,
        points: 1020,
        nextLesson: "Sprite Animasiyasi",
        color: "from-purple-400 to-purple-600",
      },
      {
        id: "safety",
        title: "Internet Xavfsizligi",
        icon: "🌐",
        progress: 28,
        lessons: 18,
        completedLessons: 5,
        points: 200,
        nextLesson: "Parol Boshqarish",
        color: "from-orange-400 to-orange-600",
      },
    ],
  };

  const totalLessons = user.subjects.reduce((sum, s) => sum + s.lessons, 0);
  const totalCompleted = user.subjects.reduce(
    (sum, s) => sum + s.completedLessons,
    0
  );

  const weeklyData = [
    { day: "Dushanba", points: 240 },
    { day: "Seshanba", points: 180 },
    { day: "Chorshanba", points: 320 },
    { day: "Payshanba", points: 400 },
    { day: "Juma", points: 240 },
    { day: "Shanba", points: 480 },
    { day: "Yakshanba", points: 160 },
  ];

  const maxPoints = 480;

  const achievements = [
    { icon: "🌟", label: "Birinchi Qadam", status: "unlocked" },
    { icon: "🔥", label: "7 Kunlik Seriyasi", status: "unlocked" },
    { icon: "🎯", label: "Muo'ribat", status: "unlocked" },
    { icon: "⭐", label: "100 Dars", status: "locked" },
    { icon: "👑", label: "Sertifikat", status: "locked" },
    { icon: "💎", label: "Grand Master", status: "locked" },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold">
                Xush kelibsiz, {user.name}! 👋
              </h1>
              <p className="text-blue-100 mt-2">Darajangiz: {user.level}</p>
            </div>
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-2xl">
              <div className="text-right">
                <div className="text-3xl text-black font-bold">
                  {user.totalPoints}
                </div>
                <div className="text-black text-sm">Umumiy Ballari</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                label: "Ketma-ketlik",
                value: `${user.streak} kun`,
                icon: "🔥",
                color: "bg-orange-400",
              },
              {
                label: "Oxirgi faoliyat",
                value: "Bugun",
                icon: "⏰",
                color: "bg-purple-400",
              },
              {
                label: "Darslar bajarildi",
                value: `${totalCompleted}/${totalLessons}`,
                icon: "🎯",
                color: "bg-green-400",
              },
              {
                label: "Eng'ta davom etish",
                value: "72%",
                icon: "⭐",
                color: "bg-yellow-400",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white bg-opacity-20 rounded-xl p-4 flex items-center gap-3"
              >
                <div className={`${stat.color} p-2 rounded-lg text-xl`}>
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <div className="text-black text-xs">{stat.label}</div>
                  <div className="text-black font-bold text-sm">
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Overall Progress Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Umumiy progressu
              </h2>
              <p className="text-gray-600 mt-1">
                Siz {user.streak} kun davomida o'qiy boshdingiz
              </p>
            </div>
            <div className="text-5xl">🏆</div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Jami taraqqiyot</span>
              <span className="text-2xl font-bold text-blue-600">
                {user.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${user.progress}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
              {[
                {
                  label: "Yakunlangan Darslar",
                  value: totalCompleted,
                  total: totalLessons,
                },
                { label: "Yosh O'yinlar", value: 24, total: 45 },
                { label: "Bilim Sertifikatlari", value: 3, total: 12 },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {stat.value}
                    </span>
                    <span className="text-gray-500">/{stat.total}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-8">
            Haftalik Faoliyat
          </h3>

          <div className="space-y-6">
            {weeklyData.map((data, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {data.day}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {data.points} ball
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${(data.points / maxPoints) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <p className="text-sm text-gray-700">
                Oxirgi haftada siz{" "}
                <span className="font-bold text-blue-600">2440 ball</span> olgan
                va <span className="font-bold">28 dars</span> bajargan edingiz!
                🎉
              </p>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Sizning Fanlaringiz
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {user.subjects.map((subject) => {
              const isHovered = hoveredSubject === subject.id;
              const lessonsRemaining =
                subject.lessons - subject.completedLessons;

              return (
                <div
                  key={subject.id}
                  onMouseEnter={() => setHoveredSubject(subject.id)}
                  onMouseLeave={() => setHoveredSubject(null)}
                  className={`group bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 transform ${
                    isHovered ? "shadow-2xl scale-105" : ""
                  }`}
                >
                  {/* Color Header */}
                  <div
                    className={`h-32 bg-gradient-to-br ${subject.color} flex items-center justify-center text-6xl`}
                  >
                    {subject.icon}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {subject.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Taraqqiyot
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {subject.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm">
                          {subject.completedLessons}/{subject.lessons} dars
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-yellow-500">⚡</span>
                        <span className="text-sm">{subject.points} ball</span>
                      </div>
                      {lessonsRemaining > 0 && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-orange-500">⚠️</span>
                          <span className="text-sm">
                            {lessonsRemaining} qoldi
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Next Lesson */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">Keyingi Dars</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {subject.nextLesson}
                      </p>
                    </div>

                    {/* Button */}
                    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                      Davom etish →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Erishadigan Muvaffaqiyatlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((achievement, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl text-center transition-all ${
                  achievement.status === "unlocked"
                    ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 shadow-md"
                    : "bg-gray-100 border-2 border-gray-300 opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-sm font-semibold text-gray-900">
                  {achievement.label}
                </p>
                {achievement.status === "unlocked" && (
                  <p className="text-xs text-green-600 mt-1 font-bold">
                    ✓ Olindi
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Study Tips */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Bugungi Maslahatlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "📚",
                title: "Muntazam O'qish",
                desc: "Har kuni 30 daqiqa o'qish sizni muvaffaqiyatga erishtiraradi",
              },
              {
                icon: "💪",
                title: "Ketma-ketlikni Saqlang",
                desc: "Siz hozir 12 kunlik seriyada! Bugun ham dars ko'ring",
              },
              {
                icon: "🎮",
                title: "O'yinlar Bilan O'rganing",
                desc: "O'yinlar yordamida kodlash yanada qiziqarli bo'ladi",
              },
            ].map((tip, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600 text-sm">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
