import { Card, CardContent } from "@/components/ui/card";

export const How = () => {
  return (
    <section className="w-full bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How Zooko Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Learning informatics becomes simple when it follows clear steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                📘
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Choose a Topic
              </h3>
              <p className="mt-3 text-gray-600">
                Pupils select a subject based on their level and interests.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                🎮
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Learn by Playing
              </h3>
              <p className="mt-3 text-gray-600">
                Concepts are explained through games and real-life examples.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                ⭐
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Practice & Progress
              </h3>
              <p className="mt-3 text-gray-600">
                Pupils practice what they learned and track their progress.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
