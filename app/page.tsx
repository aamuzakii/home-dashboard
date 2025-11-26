"use client";
import { useEffect, useState } from "react";

type PrayerName = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

const PRAYER_TIMES: { name: PrayerName; hour: number; minute: number; label: string }[] = [
  { name: "Fajr", hour: 4, minute: 3, label: "04:03" },
  { name: "Sunrise", hour: 5, minute: 27, label: "05:27" },
  { name: "Dhuhr", hour: 11, minute: 40, label: "11:40" },
  { name: "Asr", hour: 15, minute: 5, label: "15:05" },
  { name: "Maghrib", hour: 17, minute: 53, label: "17:53" },
  { name: "Isha", hour: 19, minute: 8, label: "19:08" },
];

function getNextPrayer(now: Date) {
  const today = new Date(now);
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0,
    0,
  );

  let nextIndex = 0;
  let nextDate: Date | null = null;

  for (let i = 0; i < PRAYER_TIMES.length; i++) {
    const p = PRAYER_TIMES[i];
    const candidate = new Date(todayMidnight);
    candidate.setHours(p.hour, p.minute, 0, 0);

    if (candidate > now) {
      nextIndex = i;
      nextDate = candidate;
      break;
    }
  }

  // If all prayers for today are in the past, next is Fajr tomorrow
  if (!nextDate) {
    const p = PRAYER_TIMES[0];
    const candidate = new Date(todayMidnight);
    candidate.setDate(candidate.getDate() + 1);
    candidate.setHours(p.hour, p.minute, 0, 0);
    nextIndex = 0;
    nextDate = candidate;
  }

  const secondsLeft = Math.max(0, Math.floor((nextDate.getTime() - now.getTime()) / 1000));

  return {
    index: nextIndex,
    secondsLeft,
  };
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [nextIndex, setNextIndex] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const { index, secondsLeft } = getNextPrayer(now);
      setNextIndex(index);
      setTimeLeft(secondsLeft);
    };

    update();

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Recompute next prayer when we hit zero
          const now = new Date();
          const { index, secondsLeft } = getNextPrayer(now);
          setNextIndex(index);
          return secondsLeft;
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

  const nextPrayer = PRAYER_TIMES[nextIndex];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 px-6 py-12 text-center text-black dark:text-zinc-50">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
            Next prayer
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {nextPrayer.name} – {nextPrayer.label}
          </h1>
        </div>

        <div className="text-[4.5rem] font-semibold leading-none tracking-tight sm:text-[6rem]">
          {formattedMinutes}:{formattedSeconds}
        </div>

        <p className="text-base text-zinc-600 dark:text-zinc-400">
          Time remaining until <span className="font-semibold">{nextPrayer.name}</span> azan.
        </p>

        <div className="mt-6 w-full max-w-md rounded-2xl border border-zinc-200 bg-white/70 p-4 text-left shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Today&apos;s times
          </h2>
          <div className="grid grid-cols-2 gap-y-1 text-sm sm:grid-cols-3">
            {PRAYER_TIMES.map((p, idx) => (
              <div
                key={p.name}
                className={`flex items-center justify-between rounded-lg px-2 py-1 ${
                  idx === nextIndex
                    ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <span className="font-medium">{p.name}</span>
                <span className="tabular-nums">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
