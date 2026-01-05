import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const DashboardPage = () => {
  // Random user data for demo
  const user = {
    name: "Alex",
    progress: 45, // percent
    subjects: [
      { title: "Computer Basics", icon: "💻", progress: 70 },
      { title: "Algorithms & Logic", icon: "🧠", progress: 30 },
      { title: "Coding with Games", icon: "🎮", progress: 50 },
      { title: "Internet & Safety", icon: "🌐", progress: 20 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b py-6 px-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Continue your journey in learning informatics.
        </p>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        {/* Overall Progress */}
        <Card className="rounded-3xl shadow-sm">
          <CardContent className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Overall Progress
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-primary"
                style={{ width: `${user.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{user.progress}% completed</p>
          </CardContent>
        </Card>

        {/* Subjects */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Your Subjects
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {user.subjects.map((subject) => (
              <Card key={subject.title} className="rounded-3xl shadow-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white text-xl">
                    {subject.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {subject.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-primary"
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {subject.progress}% completed
                  </p>
                  <Button className="mt-4 w-full" size="sm">
                    Continue
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button>Start New Lesson</Button>
            <Button variant="outline">View Badges</Button>
            <Button variant="outline">Check Progress</Button>
            <Button variant="outline">Settings</Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
