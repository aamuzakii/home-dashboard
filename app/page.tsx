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
/**
 * Get the last prayer time (could be Isha of yesterday if before Fajr),
 * and how many seconds have passed since that azan.
 */
function getLastPrayer(now: Date) {
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

  let lastIndex = PRAYER_TIMES.length - 1;
  let lastDate: Date | null = null;

  // Find the most recent prayer today that is <= now
  for (let i = 0; i < PRAYER_TIMES.length; i++) {
    const p = PRAYER_TIMES[i];
    const candidate = new Date(todayMidnight);
    candidate.setHours(p.hour, p.minute, 0, 0);

    if (candidate <= now) {
      lastIndex = i;
      lastDate = candidate;
    } else {
      break;
    }
  }

  // If no prayer yet today (before Fajr), use Isha from yesterday
  if (!lastDate) {
    const p = PRAYER_TIMES[PRAYER_TIMES.length - 1];
    const candidate = new Date(todayMidnight);
    candidate.setDate(candidate.getDate() - 1);
    candidate.setHours(p.hour, p.minute, 0, 0);
    lastIndex = PRAYER_TIMES.length - 1;
    lastDate = candidate;
  }

  const secondsSince = Math.max(0, Math.floor((now.getTime() - lastDate.getTime()) / 1000));

  return {
    index: lastIndex,
    secondsSince,
  };
}

export default function Home() {
  const [timeSince, setTimeSince] = useState(0); // seconds since last azan
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const { index, secondsSince } = getLastPrayer(now);
      setCurrentIndex(index);
      setTimeSince(secondsSince);
    };

    update();

    const interval = setInterval(() => {
      update();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeSince / 60);
  const seconds = timeSince % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const currentPrayer = PRAYER_TIMES[currentIndex];
  const showTimer = timeSince > 0 && timeSince <= 30 * 60;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 px-6 py-12 text-center text-black dark:text-zinc-50">
        {showTimer && (
          <>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
                After azan
              </p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {currentPrayer.name} – {currentPrayer.label}
              </h1>
            </div>

            <div className="text-[4.5rem] font-semibold leading-none tracking-tight sm:text-[6rem]">
              {formattedMinutes}:{formattedSeconds}
            </div>

            <p className="text-base text-zinc-600 dark:text-zinc-400">
              Time since <span className="font-semibold">{currentPrayer.name}</span> azan.
            </p>
          </>
        )}

        <div className="mt-6 w-full max-w-md rounded-2xl border border-zinc-200 bg-white/70 p-4 text-left shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Today&apos;s times
          </h2>
          <div className="grid grid-cols-2 gap-y-1 text-sm sm:grid-cols-3">
            {PRAYER_TIMES.map((p, idx) => (
              <div
                key={p.name}
                className={`flex items-center justify-between rounded-lg px-2 py-1 ${
                  idx === currentIndex
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
