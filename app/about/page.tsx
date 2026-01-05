"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutUsPage = () => {
  return (
    <div className="px-6 md:px-16 py-12 space-y-12 max-w-6xl mx-auto">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Biz haqimizda</h1>
        <p className="text-gray-600 text-lg">
          Bizning missiyamiz - sifatli va interaktiv ta'limni barcha uchun oson
          va qulay qilish. Har bir o'quvchi o'z tempida o'rganishi va o'z
          bilimlarini oshirishi mumkin.
        </p>
      </section>

      {/* Our Story */}
      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle>Bizning Tariximiz</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Slidemind 2024 yilda tashkil etilgan bo‘lib, dastlab interaktiv
            prezentatsiyalar va ta'lim resurslarini yaratish uchun asos
            solingan. Bugungi kunda biz Python, web dasturlash, algoritmlar va
            boshqa ko‘plab kurslar bilan foydalanuvchilarga xizmat ko‘rsatamiz.
          </p>
        </CardContent>
      </Card>

      {/* Our Mission */}
      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle>Bizning Missiyamiz</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Maqsadimiz - har bir foydalanuvchiga o‘qish jarayonini qiziqarli,
            interaktiv va samarali qilish. Biz texnologiya yordamida
            o‘quvchilarni bilimli va o‘zini rivojlantirgan shaxslar bo‘lishiga
            yordam beramiz.
          </p>
        </CardContent>
      </Card>

      {/* Our Values */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Bizning Qadriyatlarimiz
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: "🎓",
              title: "Ta'lim sifatli",
              desc: "Har bir dars va resurs yuqori sifatli va tushunarli bo'lishi kerak.",
            },
            {
              icon: "💡",
              title: "Innovatsiya",
              desc: "Yangi g'oyalarni yaratish va o'quv jarayonini qiziqarli qilish.",
            },
            {
              icon: "🌐",
              title: "Hamjamiyat",
              desc: "O'quvchilarni birlashtirish va bilim almashishga rag'batlantirish.",
            },
          ].map((val) => (
            <Card
              key={val.title}
              className="rounded-2xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition"
            >
              <div className="text-4xl mb-3">{val.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{val.title}</h3>
              <p className="text-gray-600 text-sm">{val.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-primary/10 rounded-3xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Biz bilan birga o‘rganing!
        </h2>
        <p className="text-gray-700 mb-6">
          Slidemind bilan ta'lim olish qiziqarli, interaktiv va samarali. Bugun
          boshlang va bilimlaringizni kengaytiring.
        </p>
        <a
          href="/dashboard"
          className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
        >
          Boshlash
        </a>
      </section>
    </div>
  );
};

export default AboutUsPage;
