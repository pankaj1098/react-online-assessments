"use client";

import { useState } from "react";
import Link from "next/link";

const questions = [
  {
    id: 1,
    category: "useState / useReducer",
    question: "What is the difference between useState and useReducer? When would you use one over the other?",
    answer:
      "useState is best for simple, independent values. useReducer is better when state logic is complex, involves multiple sub-values, or when the next state depends on the previous one (e.g., a form or a multi-step flow).",
  },
  {
    id: 2,
    category: "useState / useReducer",
    question: "Why should you never mutate state directly in React?",
    answer:
      "React uses reference equality to detect changes. Mutating state directly doesn't create a new reference, so React won't re-render the component. Always return a new object/array.",
  },
  {
    id: 3,
    category: "useState / useReducer",
    question: "How do you handle derived state — should you store it in state or compute it?",
    answer:
      "Derived state should be computed during render, not stored in state. Storing it leads to sync bugs. Only lift to state if computing it is expensive — and in that case, use useMemo.",
  },
  {
    id: 4,
    category: "useState / useReducer",
    question: "What is batching in state updates and how does React 18 change it?",
    answer:
      "Batching means React groups multiple state updates into a single re-render. Before React 18, batching only happened inside event handlers. React 18 introduced automatic batching — updates inside setTimeout, Promises, and native events are also batched.",
  },
  {
    id: 5,
    category: "Context API",
    question: "What problem does Context API solve? What are its limitations?",
    answer:
      "Context solves prop drilling by making state available anywhere in the tree without passing props. Limitation: every consumer re-renders when context value changes, even if they don't use the changed part — this can hurt performance at scale.",
  },
  {
    id: 6,
    category: "Context API",
    question: "How do you avoid unnecessary re-renders with Context?",
    answer:
      "Split contexts by concern (e.g., AuthContext, ThemeContext), memoize the context value with useMemo, and use React.memo on consumers. Alternatively, use a state management library like Zustand.",
  },
  {
    id: 7,
    category: "Context API",
    question: "What is the difference between Context and prop drilling?",
    answer:
      "Prop drilling passes data through intermediate components that don't use it. Context skips those intermediates and provides data directly to any consumer in the tree — but both are still React state; Context just changes how it's accessed.",
  },
  {
    id: 8,
    category: "Lifting State",
    question: "When should you lift state up to a parent component?",
    answer:
      "When two or more sibling components need to share or synchronize the same piece of state. The state moves to their closest common ancestor.",
  },
  {
    id: 9,
    category: "Lifting State",
    question: "What are the trade-offs of lifting state too high in the tree?",
    answer:
      "It causes more components to re-render than necessary and makes the component harder to reuse in isolation. Keep state as low in the tree as possible — only lift when needed.",
  },
  {
    id: 10,
    category: "External Libraries",
    question: "What is the difference between Redux and Zustand?",
    answer:
      "Redux requires actions, reducers, and a store with a strict unidirectional data flow — more boilerplate but great for large teams. Zustand is minimal, uses hooks directly, and has much less setup. Both solve global state but Zustand is simpler for most apps.",
  },
  {
    id: 11,
    category: "External Libraries",
    question: "What is a Redux selector and why does it matter for performance?",
    answer:
      "A selector is a function that extracts a specific piece of state from the store. Using memoized selectors (e.g., via reselect) prevents re-renders when unrelated parts of the store change.",
  },
  {
    id: 12,
    category: "External Libraries",
    question: "What is useSelector and what happens if you return a new object from it every render?",
    answer:
      "useSelector subscribes a component to the Redux store. If you return a new object reference every render (e.g., { a, b }), it will re-render on every store update because Redux uses strict equality (===) by default.",
  },
  {
    id: 13,
    category: "External Libraries",
    question: "What is Zustand and how does it differ from Redux in terms of boilerplate?",
    answer:
      "Zustand is a lightweight state manager based on hooks. You define state and actions in a single store with no actions/reducers split, no Provider needed, and direct hook access — far less boilerplate than Redux.",
  },
  {
    id: 14,
    category: "Advanced",
    question: "What is the difference between local, global, server, and URL state?",
    answer:
      "Local: component-level (useState). Global: shared across the app (Context, Redux, Zustand). Server: data fetched from an API (React Query, SWR). URL: state encoded in the URL (query params, path) — survives refresh and enables shareable links.",
  },
  {
    id: 15,
    category: "Advanced",
    question: "How would you handle optimistic UI updates?",
    answer:
      "Update the UI immediately before the server confirms the change, then roll back if the request fails. Libraries like React Query handle this with the onMutate / onError callbacks.",
  },
  {
    id: 16,
    category: "Advanced",
    question: "What is useTransition and how does it relate to state updates?",
    answer:
      "useTransition marks a state update as non-urgent, letting React keep the UI responsive while processing it in the background. Useful for expensive re-renders like filtering large lists — the urgent update (e.g., input) renders first.",
  },
];

const categories = [...new Set(questions.map((q) => q.category))];

const categoryColors = {
  "useState / useReducer": "bg-blue-100 text-blue-700",
  "Context API": "bg-purple-100 text-purple-700",
  "Lifting State": "bg-yellow-100 text-yellow-700",
  "External Libraries": "bg-orange-100 text-orange-700",
  Advanced: "bg-red-100 text-red-700",
};

export default function StateManagementPage() {
  const [revealed, setRevealed] = useState({});
  const [filter, setFilter] = useState("All");

  const toggle = (id) =>
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));

  const filtered =
    filter === "All" ? questions : questions.filter((q) => q.category === filter);

  const answeredCount = Object.values(revealed).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
            ← Back
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-700">State Management</span>
          <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            Intermediate–Advanced
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">State Management Questions</h1>
          <p className="text-gray-500 text-sm mt-1">
            {answeredCount} of {questions.length} answers revealed
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                filter === cat
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {filtered.map((q) => (
            <div
              key={q.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggle(q.id)}
                className="w-full text-left px-6 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-300 font-mono text-sm mt-0.5 w-5 shrink-0">
                  {q.id}.
                </span>
                <div className="flex-1 min-w-0">
                  <span
                    className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${
                      categoryColors[q.category]
                    }`}
                  >
                    {q.category}
                  </span>
                  <p className="text-sm font-medium text-gray-800">{q.question}</p>
                </div>
                <span className="text-gray-400 text-lg shrink-0">
                  {revealed[q.id] ? "−" : "+"}
                </span>
              </button>

              {revealed[q.id] && (
                <div className="px-6 pb-5 pt-0 border-t border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed pt-4">
                    {q.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
