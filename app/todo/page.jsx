"use client";

import { useState } from "react";
import Link from "next/link";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos([...todos, { id: Date.now(), text: trimmed, completed: false }]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
            ← Back
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-700">Todo App</span>
          <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
            Beginner
          </span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-6">Todo App</h1>

          {/* Input */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-yellow-400 transition-colors text-sm"
            />
            <button
              onClick={addTodo}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Add
            </button>
          </div>

          {/* List */}
          {todos.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No tasks yet. Add one above!</p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-4 h-4 accent-yellow-400 cursor-pointer"
                  />
                  <span
                    className={`flex-1 text-sm ${
                      todo.completed ? "line-through text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Footer count */}
          {todos.length > 0 && (
            <p className="text-xs text-gray-400 mt-4 text-right">
              {todos.filter((t) => t.completed).length}/{todos.length} completed
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
