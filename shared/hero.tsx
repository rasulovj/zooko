import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-white h-full pt-20">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 md:grid-cols-2 items-center">
          <div>
            <span className="inline-block mb-4 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
              Learn Informatics the Smart Way
            </span>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Informatics for Pupils,
              <br />
              Explained with Games & Real Examples
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-600">
              Zooko helps pupils understand computers, logic, and coding through
              interactive lessons, simple language, and playful challenges.
            </p>

            <div className="mt-8 flex gap-4">
              <Button size="lg" asChild>
                <Link href="/learn">Start Learning</Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="/about">For Parents</Link>
              </Button>
            </div>
          </div>

          {/* Visual / Illustration */}
          <div className="relative">
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="rounded-2xl bg-blue-50 p-6">
                  <p className="text-3xl font-bold text-blue-600">🎮</p>
                  <p className="mt-2 font-medium text-gray-700">
                    Learning by Playing
                  </p>
                </div>
                <div className="rounded-2xl bg-green-50 p-6">
                  <p className="text-3xl font-bold text-green-600">🧠</p>
                  <p className="mt-2 font-medium text-gray-700">
                    Logical Thinking
                  </p>
                </div>
                <div className="rounded-2xl bg-purple-50 p-6">
                  <p className="text-3xl font-bold text-purple-600">📘</p>
                  <p className="mt-2 font-medium text-gray-700">
                    Simple Explanations
                  </p>
                </div>
                <div className="rounded-2xl bg-yellow-50 p-6">
                  <p className="text-3xl font-bold text-yellow-600">⭐</p>
                  <p className="mt-2 font-medium text-gray-700">
                    Step-by-Step Progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
