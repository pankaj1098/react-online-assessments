"use client";
import { useRef, useState, useEffect } from "react";

export default function Page({ params }) {
  const [time, setTime] = useState(0);
  const [state, setState] = useState("idel");
  const [otp, setOtp] = useState(0);
  const [verifyOtp, setVerifyOtp] = useState(0);
  const [isVarified, setIsVarified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    if (otpTimer === 0) {
      setOtp(0);
      setIsVarified(false);
      return;
    }
    if (otpTimer < 0) return;
    const id = setTimeout(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [otpTimer]);

  const intervalRef = useRef(null);

  const startTime = () => {
    intervalRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    setState("running");
  };
  const pauseTime = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState("paused");
  };
  const endTime = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState("idel");
    setTime(0);
  };

  const hours = String(Math.floor(time / 3600)).padStart(2, 0);
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, 0);
  const seconds = String(time % 60).padStart(2, 0);

  const generateOtp = () => {
    setOtp(Math.floor(Math.random() * 1000000));
    setOtpTimer(60);
    setIsVarified(false);
  };

  const verifyHandle = () => {
    console.log(verifyOtp);
    if (otp == 0) {
      setIsVarified(false);
    } else if (otp === Number(verifyOtp)) {
      setIsVarified(true);
      console.log(verifyOtp);
    }
  };
  return (
    <div className="p-8 flex flex-col items-center gap-8">
      <div>
        <h1>Stop watch</h1>
      </div>

      <div>
        <h1>
          {hours}:{minutes}:{seconds}
        </h1>
      </div>

      <div className="flex gap-3">
        <button
          className="bg-green-500 px-6 py-2.5 rounded-lg"
          onClick={startTime}
          disabled={state === "running"}
        >
          start
        </button>
        <button
          className="bg-yellow-500 px-6 py-2.5 rounded-lg"
          onClick={pauseTime}
          disabled={state !== "running"}
        >
          Pause
        </button>
        <button
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-200 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          onClick={endTime}
          disabled={state === "idle"}
        >
          End
        </button>
      </div>

      <div>Generate otp</div>

      {otp && (
        <>
          <h1>{otp}</h1>
          <p className="text-sm text-gray-500">
            Expires in{" "}
            <span
              className={otpTimer <= 10 ? "text-red-500 font-semibold" : ""}
            >
              {otpTimer}s
            </span>
          </p>
        </>
      )}

      <button
        className="bg-yellow-500 px-6 py-2.5 rounded-lg"
        onClick={generateOtp}
      >
        Generate your otp
      </button>

      {otp && (
        <>
          <h1>Verify your otp</h1>
          <input
            type="number"
            value={verifyOtp}
            onChange={(e) => {
              if (e.target.value.length <= 6) setVerifyOtp(e.target.value);
            }}
            className="w-48 px-4 py-2 border-2 border-gray-300 rounded-lg text-center text-lg font-mono outline-none focus:border-purple-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={verifyHandle}
            className="bg-green-500 px-6 py-2.5 rounded-lg"
          >
            Verify
          </button>
        </>
      )}

      {isVarified && <h1>Your otp is varified</h1>}
    </div>
  );
}
