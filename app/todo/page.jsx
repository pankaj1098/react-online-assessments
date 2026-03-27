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

        {/* Code Explanation */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">How it works</h2>

          <div className="space-y-4">
            {/* Snippet 1 */}
            <div>
              <p className="font-medium text-gray-600 text-xs mb-1">1. State — storing todos and input</p>
              <pre style={{ background: "#1e1e1e", borderRadius: "6px", padding: "12px 14px", overflowX: "auto", fontSize: "11.5px", lineHeight: "1.7", fontFamily: 'Consolas, "Courier New", monospace', margin: 0 }}>
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> [</span>
                <span style={{ color: "#9cdcfe" }}>todos</span>
                <span style={{ color: "#d4d4d4" }}>, </span>
                <span style={{ color: "#9cdcfe" }}>setTodos</span>
                <span style={{ color: "#d4d4d4" }}>] = </span>
                <span style={{ color: "#dcdcaa" }}>useState</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#d4d4d4" }}>[])</span>
                <span style={{ color: "#d4d4d4" }}>;</span>
                {"\n"}
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> [</span>
                <span style={{ color: "#9cdcfe" }}>input</span>
                <span style={{ color: "#d4d4d4" }}>, </span>
                <span style={{ color: "#9cdcfe" }}>setInput</span>
                <span style={{ color: "#d4d4d4" }}>]  = </span>
                <span style={{ color: "#dcdcaa" }}>useState</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#ce9178" }}>{`""`}</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
              </pre>
            </div>

            {/* Snippet 2 */}
            <div>
              <p className="font-medium text-gray-600 text-xs mb-1">2. Adding a todo</p>
              <pre style={{ background: "#1e1e1e", borderRadius: "6px", padding: "12px 14px", overflowX: "auto", fontSize: "11.5px", lineHeight: "1.7", fontFamily: 'Consolas, "Courier New", monospace', margin: 0 }}>
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> </span>
                <span style={{ color: "#dcdcaa" }}>addTodo</span>
                <span style={{ color: "#d4d4d4" }}> = () </span>
                <span style={{ color: "#569cd6" }}>=&gt;</span>
                <span style={{ color: "#d4d4d4" }}> {"{"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> </span>
                <span style={{ color: "#9cdcfe" }}>trimmed</span>
                <span style={{ color: "#d4d4d4" }}> = </span>
                <span style={{ color: "#9cdcfe" }}>input</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#dcdcaa" }}>trim</span>
                <span style={{ color: "#d4d4d4" }}>();</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#c586c0" }}>if</span>
                <span style={{ color: "#d4d4d4" }}> (!</span>
                <span style={{ color: "#9cdcfe" }}>trimmed</span>
                <span style={{ color: "#d4d4d4" }}>) </span>
                <span style={{ color: "#c586c0" }}>return</span>
                <span style={{ color: "#d4d4d4" }}>;</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#dcdcaa" }}>setTodos</span>
                <span style={{ color: "#d4d4d4" }}>([...</span>
                <span style={{ color: "#9cdcfe" }}>todos</span>
                <span style={{ color: "#d4d4d4" }}>, {"{ "}</span>
                <span style={{ color: "#9cdcfe" }}>id</span>
                <span style={{ color: "#d4d4d4" }}>: </span>
                <span style={{ color: "#9cdcfe" }}>Date</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#dcdcaa" }}>now</span>
                <span style={{ color: "#d4d4d4" }}>(), </span>
                <span style={{ color: "#9cdcfe" }}>text</span>
                <span style={{ color: "#d4d4d4" }}>: </span>
                <span style={{ color: "#9cdcfe" }}>trimmed</span>
                <span style={{ color: "#d4d4d4" }}>, </span>
                <span style={{ color: "#9cdcfe" }}>completed</span>
                <span style={{ color: "#d4d4d4" }}>: </span>
                <span style={{ color: "#569cd6" }}>false</span>
                <span style={{ color: "#d4d4d4" }}>{" }]);"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#dcdcaa" }}>setInput</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#ce9178" }}>{`""`}</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"}"}</span>
                <span style={{ color: "#d4d4d4" }}>;</span>
              </pre>
            </div>

            {/* Snippet 3 */}
            <div>
              <p className="font-medium text-gray-600 text-xs mb-1">3. Toggling completed state</p>
              <pre style={{ background: "#1e1e1e", borderRadius: "6px", padding: "12px 14px", overflowX: "auto", fontSize: "11.5px", lineHeight: "1.7", fontFamily: 'Consolas, "Courier New", monospace', margin: 0 }}>
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> </span>
                <span style={{ color: "#dcdcaa" }}>toggleTodo</span>
                <span style={{ color: "#d4d4d4" }}> = (</span>
                <span style={{ color: "#9cdcfe" }}>id</span>
                <span style={{ color: "#d4d4d4" }}>) </span>
                <span style={{ color: "#569cd6" }}>=&gt;</span>
                <span style={{ color: "#d4d4d4" }}> {"{"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#dcdcaa" }}>setTodos</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#9cdcfe" }}>todos</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#dcdcaa" }}>map</span>
                <span style={{ color: "#d4d4d4" }}>((</span>
                <span style={{ color: "#9cdcfe" }}>t</span>
                <span style={{ color: "#d4d4d4" }}>) </span>
                <span style={{ color: "#569cd6" }}>=&gt;</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"    "}</span>
                <span style={{ color: "#9cdcfe" }}>t</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#9cdcfe" }}>id</span>
                <span style={{ color: "#d4d4d4" }}> === </span>
                <span style={{ color: "#9cdcfe" }}>id</span>
                <span style={{ color: "#d4d4d4" }}> ? </span>
                <span style={{ color: "#d4d4d4" }}>{"{ ..."}</span>
                <span style={{ color: "#9cdcfe" }}>t</span>
                <span style={{ color: "#d4d4d4" }}>, </span>
                <span style={{ color: "#9cdcfe" }}>completed</span>
                <span style={{ color: "#d4d4d4" }}>: !</span>
                <span style={{ color: "#9cdcfe" }}>t</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#9cdcfe" }}>completed</span>
                <span style={{ color: "#d4d4d4" }}>{" }"} : </span>
                <span style={{ color: "#9cdcfe" }}>t</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  ));"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"}"}</span>
                <span style={{ color: "#d4d4d4" }}>;</span>
              </pre>
            </div>

            {/* Snippet 4 */}
            <div>
              <p className="font-medium text-gray-600 text-xs mb-1">4. Deleting a todo</p>
              <pre style={{ background: "#1e1e1e", borderRadius: "6px", padding: "12px 14px", overflowX: "auto", fontSize: "11.5px", lineHeight: "1.7", fontFamily: 'Consolas, "Courier New", monospace', margin: 0 }}>
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> </span>
                <span style={{ color: "#dcdcaa" }}>deleteTodo</span>
                <span style={{ color: "#d4d4d4" }}> = (</span>
                <span style={{ color: "#9cdcfe" }}>id</span>
                <span style={{ color: "#d4d4d4" }}>) </span>
                <span style={{ color: "#569cd6" }}>=&gt;</span>
                <span style={{ color: "#d4d4d4" }}> {"{"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#dcdcaa" }}>setTodos</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#9cdcfe" }}>todos</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#dcdcaa" }}>filter</span>
                <span style={{ color: "#d4d4d4" }}>((</span>
                <span style={{ color: "#9cdcfe" }}>t</span>
                <span style={{ color: "#d4d4d4" }}>) </span>
                <span style={{ color: "#569cd6" }}>=&gt;</span>
                <span style={{ color: "#d4d4d4" }}> </span>
                <span style={{ color: "#9cdcfe" }}>t</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#9cdcfe" }}>id</span>
                <span style={{ color: "#d4d4d4" }}> !== </span>
                <span style={{ color: "#9cdcfe" }}>id</span>
                <span style={{ color: "#d4d4d4" }}>));</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"}"}</span>
                <span style={{ color: "#d4d4d4" }}>;</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
