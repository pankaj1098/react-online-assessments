"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OTPPage() {
  const [length, setLength] = useState(6);
  const [otp, setOtp] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [input, setInput] = useState([]);
  const [verifyStatus, setVerifyStatus] = useState(null); // "success" | "error" | null
  const inputRefs = useRef([]);

  function generateOTP(len) {
    const digits = "0123456789";
    let result = "";
    for (let i = 0; i < len; i++) {
      result += digits[Math.floor(Math.random() * 10)];
    }
    return result;
  }

  function handleGenerate() {
    setOtp(generateOTP(length));
    setCopied(false);
    setTimeLeft(30);
    setInput(Array(length).fill(""));
    setVerifyStatus(null);
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  }

  function handleCopy() {
    if (!otp) return;
    navigator.clipboard.writeText(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleInputChange(value, index) {
    if (!/^\d?$/.test(value)) return;
    const next = [...input];
    next[index] = value;
    setInput(next);
    setVerifyStatus(null);
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && !input[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    const next = Array(length).fill("");
    pasted.split("").forEach((ch, i) => (next[i] = ch));
    setInput(next);
    setVerifyStatus(null);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  function handleVerify() {
    const entered = input.join("");
    if (entered.length < length) return;
    setVerifyStatus(entered === otp ? "success" : "error");
  }

  // countdown timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) {
      setOtp("");
      setTimeLeft(null);
      setVerifyStatus(null);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  const generatedDigits = otp ? otp.split("") : Array(length).fill("");
  const inputFilled = input.join("").length === length;

  const router = useRouter();
  const checkedmannual = () => {
    router.push("/otp/manual");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            ← Back
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-700">
            OTP Generator
          </span>
          <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
            Beginner
          </span>
        </div>
      </header>

      <button onClick={checkedmannual}> manual</button>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Task description */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Build an OTP Generator
          </h1>
          <p className="text-gray-500 text-sm mb-4">
            Build a one-time password generator component with the following
            features:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">⚙</span>
              <span>
                <strong>Configurable length</strong> — pick OTP length (4, 6, or
                8 digits).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">🔢</span>
              <span>
                <strong>Generate</strong> — produce a random numeric OTP on
                button click.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">📋</span>
              <span>
                <strong>Copy to clipboard</strong> — copy the generated OTP with
                one click.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">⏱</span>
              <span>
                <strong>Auto-expire</strong> — OTP clears automatically after 30
                seconds.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">✓</span>
              <span>
                <strong>Verify</strong> — enter the OTP digit-by-digit and
                validate it.
              </span>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-xs text-gray-400 flex-wrap">
            <span>
              Concepts:{" "}
              <code className="bg-gray-100 px-1 rounded">useState</code>
            </span>
            <span>
              <code className="bg-gray-100 px-1 rounded">useEffect</code>
            </span>
            <span>
              <code className="bg-gray-100 px-1 rounded">useRef</code>
            </span>
            <span>
              <code className="bg-gray-100 px-1 rounded">clipboard API</code>
            </span>
          </div>
        </div>

        {/* OTP UI */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center gap-7">
          {/* Length selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">OTP Length:</span>
            {[4, 6, 8].map((len) => (
              <button
                key={len}
                onClick={() => {
                  setLength(len);
                  setOtp("");
                  setTimeLeft(null);
                  setInput(Array(len).fill(""));
                  setVerifyStatus(null);
                }}
                className={`w-10 h-10 rounded-lg text-sm font-semibold border transition-colors ${
                  length === len
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                }`}
              >
                {len}
              </button>
            ))}
          </div>

          {/* Generated OTP display */}
          <div className="w-full">
            <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wide font-medium">
              Generated OTP
            </p>
            <div className="flex justify-center gap-3">
              {generatedDigits.map((d, i) => (
                <div
                  key={i}
                  className={`w-12 h-14 flex items-center justify-center rounded-xl border-2 text-2xl font-bold font-mono transition-colors ${
                    d
                      ? "border-purple-400 bg-purple-50 text-purple-800"
                      : "border-gray-200 bg-gray-50 text-gray-300"
                  }`}
                >
                  {d || "—"}
                </div>
              ))}
            </div>
          </div>

          {/* Expiry bar */}
          {timeLeft !== null && (
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Expires in</span>
                <span
                  className={timeLeft <= 10 ? "text-red-500 font-medium" : ""}
                >
                  {timeLeft}s
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    timeLeft <= 10 ? "bg-red-400" : "bg-purple-400"
                  }`}
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Generate / Copy */}
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {otp ? "Regenerate" : "Generate OTP"}
            </button>
            <button
              onClick={handleCopy}
              disabled={!otp}
              className="border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Divider */}
          {otp && (
            <>
              <div className="w-full border-t border-gray-100" />

              {/* Verify section */}
              <div className="w-full flex flex-col items-center gap-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Enter OTP to Verify
                </p>

                {/* Input boxes */}
                <div className="flex justify-center gap-3">
                  {Array(length)
                    .fill("")
                    .map((_, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={input[i] || ""}
                        onChange={(e) => handleInputChange(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        onPaste={handlePaste}
                        className={`w-12 h-14 text-center text-2xl font-bold font-mono rounded-xl border-2 outline-none transition-colors ${
                          verifyStatus === "success"
                            ? "border-green-400 bg-green-50 text-green-700"
                            : verifyStatus === "error"
                              ? "border-red-400 bg-red-50 text-red-700"
                              : input[i]
                                ? "border-purple-400 bg-purple-50 text-purple-800"
                                : "border-gray-200 bg-gray-50 text-gray-700 focus:border-purple-400"
                        }`}
                      />
                    ))}
                </div>

                {/* Verify button + result */}
                <button
                  onClick={handleVerify}
                  disabled={!inputFilled}
                  className="bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-8 py-2.5 rounded-lg transition-colors"
                >
                  Verify OTP
                </button>

                {verifyStatus === "success" && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-2.5 rounded-lg">
                    <span>✓</span> OTP verified successfully!
                  </div>
                )}
                {verifyStatus === "error" && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-2.5 rounded-lg">
                    <span>✕</span> Incorrect OTP. Please try again.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
