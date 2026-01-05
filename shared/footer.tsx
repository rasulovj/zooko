import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold">
                Z
              </div>
              <span className="text-xl font-semibold text-gray-900">Zooko</span>
            </div>
            <p className="text-gray-600 text-sm">
              Zooko — bu o‘quvchilar uchun interaktiv informatika darslari,
              sodda, tushunarli va qiziqarli tarzda.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              Sayt bo‘limlari
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-primary transition">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-primary transition">
                  O‘rganish
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-primary transition">
                  O‘yinlar
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  Biz haqimizda
                </Link>
              </li>
            </ul>
          </div>

          {/* For Parents */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              Ota-onalar uchun
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/for-parents"
                  className="hover:text-primary transition"
                >
                  Qanday ishlaydi
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-primary transition">
                  Xavfsizlik
                </Link>
              </li>
              <li>
                <Link
                  href="/progress"
                  className="hover:text-primary transition"
                >
                  Rivojlanishni kuzatish
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Aloqa</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: support@zooko.app</li>
              <li>Telefon: +998 00 000 00 00</li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  Kontakt formasi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Zooko. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
};
