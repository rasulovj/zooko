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
              Interactive informatics learning for pupils, built with care,
              structure, and real understanding.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-primary transition">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-primary transition">
                  Games
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* For Parents */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              For Parents
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/for-parents"
                  className="hover:text-primary transition"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-primary transition">
                  Safety & Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/progress"
                  className="hover:text-primary transition"
                >
                  Progress Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: support@zooko.app</li>
              <li>Phone: +998 00 000 00 00</li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Zooko. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
