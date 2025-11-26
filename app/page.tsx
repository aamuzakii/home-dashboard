"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(0); // seconds

  useEffect(() => {
    const getNextAzanTime = () => {
      const now = new Date();
      const azan = new Date();
      // Hard-coded azan time: 18:00 (6 PM)
      azan.setHours(18, 0, 0, 0);

      if (azan <= now) {
        // If azan time already passed today, use tomorrow
        azan.setDate(azan.getDate() + 1);
      }

      return Math.floor((azan.getTime() - now.getTime()) / 1000);
    };

    setTimeLeft(getNextAzanTime());

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return getNextAzanTime();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 py-12 text-center text-black dark:text-zinc-50">
        <h1 className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
          Countdown to Azan
        </h1>
        <div className="text-[5rem] font-semibold leading-none tracking-tight sm:text-[7rem]">
          {formattedMinutes}:{formattedSeconds}
        </div>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          Time remaining until the next azan at <span className="font-semibold">18:00</span>.
        </p>
      </main>
    </div>
  );
}
