import Link from "next/link";

const topics = [
  {
    title: "Timer App",
    description:
      "Build a timer with Start, Stop, and Pause controls using useState and useRef to manage interval state.",
    questions: 1,
    difficulty: "Beginner",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    href: "/timer",
  },
  {
    title: "OTP Generator",
    description:
      "Generate a random 6-digit OTP with configurable length, copy to clipboard, and auto-expire logic using useState and useEffect.",
    questions: 1,
    difficulty: "Beginner",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    href: "/otp",
  },
  {
    title: "State Management",
    description: "Context API, Redux, Zustand, prop drilling, lifting state",
    questions: 8,
    difficulty: "Intermediate–Advanced",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    href: "#",
  },
  {
    title: "Performance",
    description:
      "React.memo, lazy loading, code splitting, reconciliation, profiling",
    questions: 9,
    difficulty: "Advanced",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    href: "#",
  },
  {
    title: "React Internals",
    description: "Virtual DOM, Fiber architecture, diffing algorithm, batching",
    questions: 7,
    difficulty: "Advanced",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    href: "#",
  },
  {
    title: "Practical Coding",
    description:
      "Build components live: infinite scroll, debounce input, custom hooks",
    questions: 15,
    difficulty: "All levels",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    href: "#",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">⚛</span>
            <span className="text-lg font-semibold text-gray-800">ReactPrep</span>
          </div>
          <span className="text-sm text-gray-500">React Interview Assessment</span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-gray-200 px-6 py-14">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Interview Prep
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            React Interview Assessment
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Practice the most commonly asked React questions in frontend
            interviews — from hooks and patterns to performance and internals.
          </p>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
              Start Assessment
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition-colors">
              Browse Topics
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { value: "61", label: "Questions" },
            { value: "6", label: "Topics" },
            { value: "3", label: "Difficulty Levels" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-xl py-5"
            >
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Topics */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Assessment Topics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <Link key={topic.title} href={topic.href}>
                <div
                  className={`border rounded-xl p-5 hover:shadow-md transition-shadow h-full ${topic.color}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${topic.badge}`}
                    >
                      {topic.questions}Q
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{topic.description}</p>
                  <span className="text-xs text-gray-400">{topic.difficulty}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
