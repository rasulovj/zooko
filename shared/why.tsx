import { Card, CardContent } from "@/components/ui/card";

export const WhyZooko = () => {
  return (
    <section className="w-full bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Zooko
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Because good education is built on clarity, practice, and care.
          </p>
        </div>

        {/* Reasons */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Reason 1 */}
          <Card className="rounded-3xl bg-white shadow-sm">
            <CardContent className="p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                🎯
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Clear Explanations
              </h3>
              <p className="mt-3 text-gray-600">
                Informatics explained step by step, using simple language that
                pupils understand.
              </p>
            </CardContent>
          </Card>

          {/* Reason 2 */}
          <Card className="rounded-3xl bg-white shadow-sm">
            <CardContent className="p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
                🎮
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Learning Through Play
              </h3>
              <p className="mt-3 text-gray-600">
                Games are used with purpose — to teach thinking, not just
                clicking.
              </p>
            </CardContent>
          </Card>

          {/* Reason 3 */}
          <Card className="rounded-3xl bg-white shadow-sm">
            <CardContent className="p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl">
                📚
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Structured Lessons
              </h3>
              <p className="mt-3 text-gray-600">
                Each lesson follows a proven educational structure, building
                real understanding.
              </p>
            </CardContent>
          </Card>

          {/* Reason 4 */}
          <Card className="rounded-3xl bg-white shadow-sm">
            <CardContent className="p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                🧠
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Thinking First
              </h3>
              <p className="mt-3 text-gray-600">
                Zooko focuses on logic and problem-solving, not memorization.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
