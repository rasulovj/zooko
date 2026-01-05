import { Card, CardContent } from "@/components/ui/card";

export const WhyZooko = () => {
  return (
    <section className="w-full bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Nima uchun Zooko
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Zooko o'quvchilarga kompyuterlar, mantiq va dasturlashni sodda va
            qiziqarli tarzda o‘rgatadi. Har bir dars o‘yinga, real misollarga va
            o‘quvchining darajasiga mos keladi.
          </p>
        </div>

        {/* Topics */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Clear Explanation */}
          <Card className="rounded-3xl bg-white shadow-sm">
            <CardContent className="p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                🎯
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Aniqlik bilan tushuntirish
              </h3>
              <p className="mt-3 text-gray-600">
                Har bir mavzu o‘quvchiga sodda, tushunarli va bosqichma-bosqich
                tushuntiriladi.
              </p>
            </CardContent>
          </Card>

          {/* Learning Through Games */}
          <Card className="rounded-3xl bg-white shadow-sm">
            <CardContent className="p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
                🎮
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                O‘yinda o‘rganish
              </h3>
              <p className="mt-3 text-gray-600">
                O‘quvchilar o‘yinalar orqali masalalarni hal qilish va
                mavzularni o‘rganadi.
              </p>
            </CardContent>
          </Card>

          {/* Structured Lessons */}
          <Card className="rounded-3xl bg-white shadow-sm">
            <CardContent className="p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl">
                📚
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Tuzilgan darslar
              </h3>
              <p className="mt-3 text-gray-600">
                Har bir dars o‘quvchining darajasiga mos tuzilgan va tartibli
                o‘rganishga yordam beradi.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl bg-white shadow-sm">
            <CardContent className="p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                🧠
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Mantiq va fikrlash
              </h3>
              <p className="mt-3 text-gray-600">
                Zooko o‘quvchilarni mantiqiy fikrlash va muammolarni hal
                qilishga o‘rgatadi.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
