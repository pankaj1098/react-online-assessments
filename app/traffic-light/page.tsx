"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Light = "red" | "yellow" | "green";

const DURATIONS: Record<Light, number> = {
  red: 5,
  yellow: 2,
  green: 5,
};

const NEXT_LIGHT: Record<Light, Light> = {
  red: "green",
  green: "yellow",
  yellow: "red",
};

const LIGHT_STYLES: Record<Light, { active: string; inactive: string; label: string }> = {
  red: {
    active: "bg-red-500 shadow-[0_0_32px_8px_rgba(239,68,68,0.6)]",
    inactive: "bg-red-950",
    label: "Stop",
  },
  yellow: {
    active: "bg-yellow-400 shadow-[0_0_32px_8px_rgba(250,204,21,0.6)]",
    inactive: "bg-yellow-950",
    label: "Slow",
  },
  green: {
    active: "bg-green-500 shadow-[0_0_32px_8px_rgba(34,197,94,0.6)]",
    inactive: "bg-green-950",
    label: "Go",
  },
};

export default function TrafficLightPage() {
  const [light, setLight] = useState<Light>("red");
  const [countdown, setCountdown] = useState(DURATIONS.red);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lightRef = useRef<Light>("red");
  const countdownRef = useRef(DURATIONS.red);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function start() {
    if (running) return;
    intervalRef.current = setInterval(() => {
      countdownRef.current -= 1;
      if (countdownRef.current <= 0) {
        const next = NEXT_LIGHT[lightRef.current];
        lightRef.current = next;
        countdownRef.current = DURATIONS[next];
        setLight(next);
      }
      setCountdown(countdownRef.current);
    }, 1000);
    setRunning(true);
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    lightRef.current = "red";
    countdownRef.current = DURATIONS.red;
    setLight("red");
    setCountdown(DURATIONS.red);
    setRunning(false);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
            ← Back
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-700">Traffic Light System</span>
          <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            Beginner
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Task description */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Build a Traffic Light System
          </h1>
          <p className="text-gray-500 text-sm mb-4">
            Implement an auto-cycling traffic light using React hooks. The light
            should cycle through the sequence below automatically once started:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1" />
              <span>
                <strong>Red (5s)</strong> — Stop. Transitions to Green after 5 seconds.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-3 h-3 rounded-full bg-green-500 flex-shrink-0 mt-1" />
              <span>
                <strong>Green (5s)</strong> — Go. Transitions to Yellow after 5 seconds.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0 mt-1" />
              <span>
                <strong>Yellow (2s)</strong> — Slow down. Transitions back to Red after 2 seconds.
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

        {/* Traffic Light UI */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center gap-8">
          {/* Traffic light housing */}
          <div className="bg-gray-900 rounded-2xl px-8 py-6 flex flex-col items-center gap-5 border-4 border-gray-800 shadow-xl">
            {(["red", "yellow", "green"] as Light[]).map((l) => (
              <div
                key={l}
                className={`w-24 h-24 rounded-full transition-all duration-300 ${
                  light === l ? LIGHT_STYLES[l].active : LIGHT_STYLES[l].inactive
                }`}
              />
            ))}
          </div>

          {/* Status */}
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-medium">
              {running ? LIGHT_STYLES[light].label : "Stopped"}
            </p>
            {running && (
              <p className="font-mono text-4xl font-bold text-gray-900">
                {countdown}s
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={start}
              disabled={running}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-200 disabled:cursor-not-allowed text-white font-medium px-8 py-2.5 rounded-lg transition-colors"
            >
              Start
            </button>
            <button
              onClick={stop}
              disabled={!running}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-200 disabled:cursor-not-allowed text-white font-medium px-8 py-2.5 rounded-lg transition-colors"
            >
              Stop
            </button>
          </div>
        </div>

        {/* Code Explanation */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">How it works</h2>

          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-600 text-xs mb-1">1. Light cycle config</p>
              <pre style={{ background: "#1e1e1e", borderRadius: "6px", padding: "12px 14px", overflowX: "auto", fontSize: "11.5px", lineHeight: "1.7", fontFamily: 'Consolas, "Courier New", monospace', margin: 0 }}>
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> DURATIONS = {"{ red: 5, yellow: 2, green: 5 }"};</span>
                {"\n"}
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> NEXT_LIGHT = {"{ red: \"green\", green: \"yellow\", yellow: \"red\" }"};</span>
              </pre>
            </div>

            <div>
              <p className="font-medium text-gray-600 text-xs mb-1">2. Refs track mutable values across ticks</p>
              <pre style={{ background: "#1e1e1e", borderRadius: "6px", padding: "12px 14px", overflowX: "auto", fontSize: "11.5px", lineHeight: "1.7", fontFamily: 'Consolas, "Courier New", monospace', margin: 0 }}>
                <span style={{ color: "#6a9955" }}>{"// useRef avoids stale closures inside setInterval"}</span>
                {"\n"}
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> lightRef = </span>
                <span style={{ color: "#dcdcaa" }}>useRef</span>
                <span style={{ color: "#d4d4d4" }}>(</span>
                <span style={{ color: "#ce9178" }}>"red"</span>
                <span style={{ color: "#d4d4d4" }}>);</span>
                {"\n"}
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> countdownRef = </span>
                <span style={{ color: "#dcdcaa" }}>useRef</span>
                <span style={{ color: "#d4d4d4" }}>(DURATIONS.red);</span>
              </pre>
            </div>

            <div>
              <p className="font-medium text-gray-600 text-xs mb-1">3. Interval tick — decrement and transition</p>
              <pre style={{ background: "#1e1e1e", borderRadius: "6px", padding: "12px 14px", overflowX: "auto", fontSize: "11.5px", lineHeight: "1.7", fontFamily: 'Consolas, "Courier New", monospace', margin: 0 }}>
                <span style={{ color: "#9cdcfe" }}>countdownRef</span>
                <span style={{ color: "#d4d4d4" }}>.</span>
                <span style={{ color: "#9cdcfe" }}>current</span>
                <span style={{ color: "#d4d4d4" }}> -= </span>
                <span style={{ color: "#b5cea8" }}>1</span>
                <span style={{ color: "#d4d4d4" }}>;</span>
                {"\n"}
                <span style={{ color: "#c586c0" }}>if</span>
                <span style={{ color: "#d4d4d4" }}> (countdownRef.current {"<="} </span>
                <span style={{ color: "#b5cea8" }}>0</span>
                <span style={{ color: "#d4d4d4" }}>) {"{"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#569cd6" }}>const</span>
                <span style={{ color: "#d4d4d4" }}> next = NEXT_LIGHT[lightRef.current];</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  lightRef.current = next;"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  countdownRef.current = DURATIONS[next];"}</span>
                {"\n"}
                <span style={{ color: "#d4d4d4" }}>{"  "}</span>
                <span style={{ color: "#dcdcaa" }}>setLight</span>
                <span style={{ color: "#d4d4d4" }}>(next);</span>
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
