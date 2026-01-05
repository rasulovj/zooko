import { Card, CardContent } from "@/components/ui/card";

export const How = () => {
  return (
    <section className="w-full bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Zooko qanday ishlaydi
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Informatika o'rganish oson bo'lishi uchun tayyorlangan.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                📘
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Topic tanlash
              </h3>
              <p className="mt-3 text-gray-600">
                O'quvchilar o'zlarining darajasiga va qiziqishlariga asosan
                topic tanlaydilar.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                🎮
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                O'yinlar bilan o'rganish
              </h3>
              <p className="mt-3 text-gray-600">
                O'yinlar va haqiqiy misollar bilan tushuntiriladi.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                ⭐
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Amaliyot va progress
              </h3>
              <p className="mt-3 text-gray-600">
                O'quvchilar o'rganilgan narsalarni amalga oshirish va
                progressini ko'rish.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
