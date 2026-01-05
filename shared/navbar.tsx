import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold">
            Z
          </div>
          <span className="text-xl font-semibold text-gray-900">Zooko</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <Link href="/learn" className="hover:text-primary transition">
            Learn
          </Link>
          <Link href="/games" className="hover:text-primary transition">
            Games
          </Link>
          <Link href="/about" className="hover:text-primary transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary transition">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button>Register</Button>
        </div>
      </div>
    </header>
  );
};
