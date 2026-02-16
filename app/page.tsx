import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.68-3.31 12-11" />
      <path d="M17 8c-2 4-6 8-12 11" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M9 10h6" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
    </svg>
  );
}

function GamepadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <path d="M6 12h4" /><path d="M8 10v4" />
      <circle cx="17" cy="10" r="0.5" fill="currentColor" /><circle cx="15" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--divider)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[var(--green-600)] rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
              <LeafIcon className="w-4 h-4 text-white dark:text-[var(--background)]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>
              zooko
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-[var(--foreground)]/60">
            <a href="#features" className="hover:text-green-600 transition-colors">Imkoniyatlar</a>
            <a href="#how-it-works" className="hover:text-green-600 transition-colors">Qanday ishlaydi</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-medium bg-[var(--green-600)] text-white dark:text-[var(--background)] px-5 py-2.5 rounded-full hover:bg-[var(--green-900)] transition-colors"
            >
              Kirish
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-[var(--green-50)] rounded-full blur-3xl opacity-60 animate-float" />
          <div className="absolute bottom-10 left-[5%] w-56 h-56 bg-green-300/20 rounded-full blur-3xl opacity-40 animate-float delay-300" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="max-w-2xl">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase text-green-600 bg-[var(--green-50)] px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                Bolalar uchun ta'lim platformasi
              </span>
            </div>
            <h1
              className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-[var(--foreground)] animate-fade-in-up delay-100"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Informatika,{" "}
              <span className="text-green-600">qiziqarli</span> har bir bola uchun
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[var(--foreground)]/55 leading-relaxed max-w-lg animate-fade-in-up delay-200">
              Zooko bolalarga informatika dunyosini o'yin va interaktiv darslar orqali kashf etishga yordam beradi.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-[var(--green-600)] text-white dark:text-[var(--background)] font-semibold px-8 py-4 rounded-full text-base hover:bg-[var(--green-900)] transition-all hover:shadow-lg hover:shadow-green-600/20"
              >
                Kirish
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center font-medium px-8 py-4 rounded-full text-base text-[var(--foreground)] border border-green-900/10 hover:border-green-600/30 hover:bg-[var(--green-50)]/50 transition-all"
              >
                Imkoniyatlarni ko'rish
              </a>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:block absolute top-8 right-0 w-[380px] animate-fade-in delay-500">
            <div className="relative">
              <div className="bg-[var(--card-bg)] rounded-3xl border border-green-600/10 p-6 shadow-xl shadow-green-900/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[var(--green-50)] flex items-center justify-center text-lg">🧒</div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">Alining natijasi</p>
                    <p className="text-xs text-[var(--foreground)]/40">3-daraja · Algoritmlar</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--foreground)]/60">Saralash asoslari</span>
                      <span className="font-medium text-green-600">92%</span>
                    </div>
                    <div className="h-2 bg-[var(--green-50)] rounded-full overflow-hidden">
                      <div className="h-full bg-green-300 rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--foreground)]/60">Mantiqiy elementlar</span>
                      <span className="font-medium text-green-600">78%</span>
                    </div>
                    <div className="h-2 bg-[var(--green-50)] rounded-full overflow-hidden">
                      <div className="h-full bg-green-300 rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--foreground)]/60">Ikkilik sonlar</span>
                      <span className="font-medium text-green-600">65%</span>
                    </div>
                    <div className="h-2 bg-[var(--green-50)] rounded-full overflow-hidden">
                      <div className="h-full bg-green-300 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs text-green-600 bg-[var(--green-50)] rounded-xl px-3 py-2">
                  <span>🏆</span>
                  <span>Bu hafta 3 ta nishon olindi!</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[var(--card-bg)] rounded-2xl border border-green-600/10 px-4 py-3 shadow-lg shadow-green-900/5 animate-float delay-700">
                <p className="text-xs font-medium text-[var(--foreground)]">🎯 Keyingi: Rekursiya</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Sinfingiz uchun zarur bo'lgan hamma narsa
            </h2>
            <p className="mt-4 text-[var(--foreground)]/50 text-lg">
              Ilhomlantiradigan o'qituvchilar va o'rganishni yaxshi ko'radigan bolalar uchun yaratilgan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <GamepadIcon className="w-5 h-5" />,
                title: "Interaktiv darslar",
                desc: "Murakkab informatika tushunchalarini qiziqarli mashqlarga aylantiruvchi amaliy mashg'ulotlar.",
              },
              {
                icon: <UsersIcon className="w-5 h-5" />,
                title: "Boshqaruv paneli",
                desc: "O'quvchilarni boshqaring, darslar tayinlang va har bir o'quvchining yo'lini kuzating.",
              },
              {
                icon: <ShieldIcon className="w-5 h-5" />,
                title: "Xavfsiz muhit",
                desc: "Maxfiylikka asoslangan bolalar uchun xavfsiz platforma.",
              },
              {
                icon: <ChartIcon className="w-5 h-5" />,
                title: "Natijalarni kuzatish",
                desc: "Vizual hisobotlar har bir bolaning mavzular bo'yicha rivojlanishini ko'rsatadi.",
              },
              {
                icon: <BookIcon className="w-5 h-5" />,
                title: "Tanlangan o'quv dasturi",
                desc: "Algoritmlar, mantiq, ma'lumotlar va hisoblash tafakkurini qamrab olgan tizimli o'quv yo'llari.",
              },
              {
                icon: <LeafIcon className="w-5 h-5" />,
                title: "O'z tezligingizda o'rganing",
                desc: "Moslashuvchan qiyinlik har bir bolaning yetarlicha qiyinchiliksiz o'rganishini ta'minlaydi.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group bg-[var(--card-bg)] border border-green-600/5 rounded-2xl p-7 hover:border-green-600/15 hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-[var(--green-50)] text-green-600 flex items-center justify-center mb-5 group-hover:bg-[var(--green-600)] group-hover:text-white transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-[var(--foreground)] text-base mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--foreground)]/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-[var(--green-50)]/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Bir necha daqiqada boshlang
            </h2>
            <p className="mt-4 text-[var(--foreground)]/50 text-lg">
              Informatika sayohatingizni boshlash uchun uchta oddiy qadam.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "O'qituvchi sozlaydi",
                desc: "O'qituvchingiz sinf yaratadi va sizga shaxsiy kirish ma'lumotlarini beradi.",
              },
              {
                step: "02",
                title: "Kiring va kashf qiling",
                desc: "O'qituvchingiz bergan ma'lumotlar bilan tizimga kiring va darslaringizni kashf qiling.",
              },
              {
                step: "03",
                title: "O'rganing va rivojlaning",
                desc: "Interaktiv darslarni bajaring, nishonlar oling va har kuni o'z natijangizni kuzating.",
              },
            ].map((s, i) => (
              <div key={i} className="relative text-center md:text-left">
                <span
                  className="text-6xl font-extrabold text-green-600/10 block mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.step}
                </span>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--foreground)]/50 leading-relaxed">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-green-300/40">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-[var(--green-900)] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--green-600)]/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-300/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-[var(--background)] tracking-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Informatikani qiziqarli qilishga tayyormisiz?
              </h2>
              <p className="text-green-300/80 dark:text-[var(--background)]/70 text-lg mb-8 max-w-md mx-auto">
                O'qituvchingizdan kirish ma'lumotlarini so'rang va bugun informatikani o'rganishni boshlang.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--green-300)] text-[var(--green-900)] font-semibold px-8 py-4 rounded-full hover:bg-[var(--card-bg)] transition-colors"
                >
                  Kirish
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-900/5 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
              <LeafIcon className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>zooko</span>
          </div>
          <p className="text-xs text-[var(--foreground)]/35">
            © {new Date().getFullYear()} Zooko. Yosh o'rganuvchilar uchun g'amxo'rlik bilan yaratilgan.
          </p>
        </div>
      </footer>
    </div>
  );
}
