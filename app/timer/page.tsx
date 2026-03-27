"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function TimerPage() {
  const [time, setTime] = useState(0); // in seconds
  const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function start() {
    if (status === "running") return;
    intervalRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    setStatus("running");
  }

  function pause() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStatus("paused");
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTime(0);
    setStatus("idle");
  }

  const hours = String(Math.floor(time / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
            ← Back
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-700">Timer App</span>
          <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            Beginner
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Task description */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Build a Timer App
          </h1>
          <p className="text-gray-500 text-sm mb-4">
            Implement a working timer using React hooks. The timer should support
            the following controls:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">▶</span>
              <span>
                <strong>Start</strong> — begins counting up from the current time (or from 0 if
                stopped). Disabled when already running.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-0.5">⏸</span>
              <span>
                <strong>Pause</strong> — freezes the timer at the current value without resetting.
                Only active when the timer is running.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">■</span>
              <span>
                <strong>Stop</strong> — halts the timer and resets the time back to 00:00:00.
              </span>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
            <span>Concepts: <code className="bg-gray-100 px-1 rounded">useState</code></span>
            <span><code className="bg-gray-100 px-1 rounded">useRef</code></span>
            <span><code className="bg-gray-100 px-1 rounded">useEffect</code></span>
            <span><code className="bg-gray-100 px-1 rounded">setInterval</code></span>
          </div>
        </div>

        {/* Timer UI */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center gap-8">
          {/* Display */}
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-medium">
              {status === "idle" ? "Ready" : status === "running" ? "Running" : "Paused"}
            </p>
            <div className="font-mono text-7xl font-bold text-gray-900 tracking-tight">
              {hours}:{minutes}:{seconds}
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                status === "running"
                  ? "bg-green-400 animate-pulse"
                  : status === "paused"
                  ? "bg-yellow-400"
                  : "bg-gray-300"
              }`}
            />
            <span className="text-xs text-gray-400 capitalize">{status}</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={start}
              disabled={status === "running"}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-200 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              <span>▶</span> Start
            </button>
            <button
              onClick={pause}
              disabled={status !== "running"}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-100 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              <span>⏸</span> Pause
            </button>
            <button
              onClick={stop}
              disabled={status === "idle"}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-200 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              <span>■</span> Stop
            </button>
          </div>
        </div>

        {/* Code Explanation */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">How it works</h2>

          <div className="space-y-4">
            {/* Snippet 1 */}
            <div>
              <p className="font-medium text-gray-600 text-xs mb-1">1. State & ref setup</p>
              <pre style={{ background: "#1e1e1e", borderRadius: "6px", padding: "12px 14px", overflowX: "auto", fontSize: "11.5px", lineHeight: "1.7", fontFamily: 'Consolas, "Courier New", monospace', margin: 0 }}>
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> [</span>
                <span style={{ color: "#9cdcfe" }}>time</span>
                <span style={{ color: "#d4d4d4" }}>, </span>
                <span style={{ color: "#9cdcfe" }}>setTime</span>
                <span style={{ color: "#d4d4d4" }}>] = </span>
                <span style={{ color: "#dcdcaa" }}>useState</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#b5cea8" }}>0</span>
                <span style={{ color: "#d4d4d4" }}>); </span>
                <span style={{ color: "#6a9955" }}>{"// in seconds"}</span>
                {"\n"}
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> [</span>
                <span style={{ color: "#9cdcfe" }}>status</span>
                <span style={{ color: "#d4d4d4" }}>, </span>
                <span style={{ color: "#9cdcfe" }}>setStatus</span>
                <span style={{ color: "#d4d4d4" }}>] = </span>
                <span style={{ color: "#dcdcaa" }}>useState</span>
                <span style={{ color: "#d4d4d4" }}>&lt;</span>
                <span style={{ color: "#4ec9b0" }}>"idle"</span>
                <span style={{ color: "#d4d4d4" }}> | </span>
                <span style={{ color: "#4ec9b0" }}>"running"</span>
                <span style={{ color: "#d4d4d4" }}> | </span>
                <span style={{ color: "#4ec9b0" }}>"paused"</span>
                <span style={{ color: "#d4d4d4" }}>&gt;(</span>
                <span style={{ color: "#ce9178" }}>"idle"</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
                {"\n"}
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> </span>
                <span style={{ color: "#9cdcfe" }}>intervalRef</span>
                <span style={{ color: "#d4d4d4" }}> = </span>
                <span style={{ color: "#dcdcaa" }}>useRef</span>
                <span style={{ color: "#d4d4d4" }}>&lt;</span>
                <span style={{ color: "#4ec9b0" }}>ReturnType</span>
                <span style={{ color: "#d4d4d4" }}>&lt;</span>
                <span style={{ color: "#569cd6" }}>typeof</span>
                <span style={{ color: "#d4d4d4" }}> </span>
                <span style={{ color: "#dcdcaa" }}>setInterval</span>
                <span style={{ color: "#d4d4d4" }}>&gt; | </span>
                <span style={{ color: "#569cd6" }}>null</span>
                <span style={{ color: "#d4d4d4" }}>&gt;(</span>
                <span style={{ color: "#569cd6" }}>null</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
              </pre>
            </div>

            {/* Snippet 2 */}
            <div>
              <p className="font-medium text-gray-600 text-xs mb-1">2. Cleanup with useEffect</p>
              <pre style={{ background: "#1e1e1e", borderRadius: "6px", padding: "12px 14px", overflowX: "auto", fontSize: "11.5px", lineHeight: "1.7", fontFamily: 'Consolas, "Courier New", monospace', margin: 0 }}>
                <span style={{ color: "#dcdcaa" }}>useEffect</span>
                <span style={{ color: "#d4d4d4" }}>(() </span>
                <span style={{ color: "#569cd6" }}>=&gt;</span>
                <span style={{ color: "#d4d4d4" }}> {"{"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#c586c0" }}>return</span>
                <span style={{ color: "#d4d4d4" }}> () </span>
                <span style={{ color: "#569cd6" }}>=&gt;</span>
                <span style={{ color: "#d4d4d4" }}> {"{"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"    "}</span>
                <span style={{ color: "#c586c0" }}>if</span>
                <span style={{ color: "#d4d4d4" }}> (</span>
                <span style={{ color: "#9cdcfe" }}>intervalRef</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#9cdcfe" }}>current</span>
                <span style={{ color: "#d4d4d4" }}>) </span>
                <span style={{ color: "#dcdcaa" }}>clearInterval</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#9cdcfe" }}>intervalRef</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#9cdcfe" }}>current</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  };"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"}, []);"}</span>
              </pre>
            </div>

            {/* Snippet 3 */}
            <div>
              <p className="font-medium text-gray-600 text-xs mb-1">3. Start — begins the interval</p>
              <pre style={{ background: "#1e1e1e", borderRadius: "6px", padding: "12px 14px", overflowX: "auto", fontSize: "11.5px", lineHeight: "1.7", fontFamily: 'Consolas, "Courier New", monospace', margin: 0 }}>
                <span style={{ color: "#569cd6" }}>function</span>
                <span style={{ color: "#d4d4d4" }}> </span>
                <span style={{ color: "#dcdcaa" }}>start</span>
                <span style={{ color: "#d4d4d4" }}>() {"{"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#c586c0" }}>if</span>
                <span style={{ color: "#d4d4d4" }}> (</span>
                <span style={{ color: "#9cdcfe" }}>status</span>
                <span style={{ color: "#d4d4d4" }}> === </span>
                <span style={{ color: "#ce9178" }}>"running"</span>
                <span style={{ color: "#d4d4d4" }}>) </span>
                <span style={{ color: "#c586c0" }}>return</span>
                <span style={{ color: "#d4d4d4" }}>;</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#9cdcfe" }}>intervalRef</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#9cdcfe" }}>current</span>
                <span style={{ color: "#d4d4d4" }}> = </span>
                <span style={{ color: "#dcdcaa" }}>setInterval</span>
                <span style={{ color: "#d4d4d4" }}>(() </span>
                <span style={{ color: "#569cd6" }}>=&gt;</span>
                <span style={{ color: "#d4d4d4" }}> {"{"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"    "}</span>
                <span style={{ color: "#dcdcaa" }}>setTime</span>
                <span style={{ color: "#d4d4d4" }}>((</span>
                <span style={{ color: "#9cdcfe" }}>t</span>
                <span style={{ color: "#d4d4d4" }}>) </span>
                <span style={{ color: "#569cd6" }}>=&gt;</span>
                <span style={{ color: "#d4d4d4" }}> </span>
                <span style={{ color: "#9cdcfe" }}>t</span>
                <span style={{ color: "#d4d4d4" }}> + </span>
                <span style={{ color: "#b5cea8" }}>1</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  }, "}</span>
                <span style={{ color: "#b5cea8" }}>1000</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#dcdcaa" }}>setStatus</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#ce9178" }}>"running"</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"}"}</span>
              </pre>
            </div>

            {/* Snippet 4 */}
            <div>
              <p className="font-medium text-gray-600 text-xs mb-1">4. Pause & Stop</p>
              <pre style={{ background: "#1e1e1e", borderRadius: "6px", padding: "12px 14px", overflowX: "auto", fontSize: "11.5px", lineHeight: "1.7", fontFamily: 'Consolas, "Courier New", monospace', margin: 0 }}>
                <span style={{ color: "#569cd6" }}>function</span>
                <span style={{ color: "#d4d4d4" }}> </span>
                <span style={{ color: "#dcdcaa" }}>pause</span>
                <span style={{ color: "#d4d4d4" }}>() {"{"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#c586c0" }}>if</span>
                <span style={{ color: "#d4d4d4" }}> (</span>
                <span style={{ color: "#9cdcfe" }}>intervalRef</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#9cdcfe" }}>current</span>
                <span style={{ color: "#d4d4d4" }}>) </span>
                <span style={{ color: "#dcdcaa" }}>clearInterval</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#9cdcfe" }}>intervalRef</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#9cdcfe" }}>current</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#dcdcaa" }}>setStatus</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#ce9178" }}>"paused"</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"}"}</span>
                {"\n\n"}
                <span style={{ color: "#569cd6" }}>function</span>
                <span style={{ color: "#d4d4d4" }}> </span>
                <span style={{ color: "#dcdcaa" }}>stop</span>
                <span style={{ color: "#d4d4d4" }}>() {"{"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#c586c0" }}>if</span>
                <span style={{ color: "#d4d4d4" }}> (</span>
                <span style={{ color: "#9cdcfe" }}>intervalRef</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#9cdcfe" }}>current</span>
                <span style={{ color: "#d4d4d4" }}>) </span>
                <span style={{ color: "#dcdcaa" }}>clearInterval</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#9cdcfe" }}>intervalRef</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#9cdcfe" }}>current</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#dcdcaa" }}>setTime</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#b5cea8" }}>0</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#dcdcaa" }}>setStatus</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#ce9178" }}>"idle"</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"}"}</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
