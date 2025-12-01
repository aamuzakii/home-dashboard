"use client";
import { useEffect, useState } from "react";
import { PRAYER_TIMES } from "./constants";
import AzanTimer from "./AzanTimer";
import WorkTracker from "./WorkTracker";

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
    0
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

  const secondsSince = Math.max(
    0,
    Math.floor((now.getTime() - lastDate.getTime()) / 1000)
  );

  return {
    index: lastIndex,
    secondsSince,
  };
}

export default function Home() {
  const [timeSince, setTimeSince] = useState(0); // seconds since last azan
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [weeklyMinutes, setWeeklyMinutes] = useState<number | null>(null);
  const [obligationMinutes, setObligationMinutes] = useState<number | null>(
    null
  );
  const [hasTodayPrayerStarted, setHasTodayPrayerStarted] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const { index, secondsSince } = getLastPrayer(now);
      setCurrentIndex(index);
      setTimeSince(secondsSince);

      // Determine if today's first prayer time has started
      const todayMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );
      const firstPrayer = PRAYER_TIMES[0];
      const firstPrayerToday = new Date(todayMidnight);
      firstPrayerToday.setHours(firstPrayer.hour, firstPrayer.minute, 0, 0);
      setHasTodayPrayerStarted(now >= firstPrayerToday);
    };

    update();

    const interval = setInterval(() => {
      update();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;

        if (typeof data.name === "string") {
          setUserName(data.name);
        }

        if (typeof data.weeklyMinutes === "number") {
          setWeeklyMinutes(data.weeklyMinutes);
        }

        if (typeof data.obligationMinutes === "number") {
          setObligationMinutes(data.obligationMinutes);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);

  const MINUTES_BEFORE_FADE = 30;

  const minutes = Math.floor(timeSince / 60);
  const seconds = timeSince % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const currentPrayer = PRAYER_TIMES[currentIndex];
  const showTimer =
    hasTodayPrayerStarted &&
    timeSince > 0 &&
    timeSince <= MINUTES_BEFORE_FADE * 60;

  const hasWorkData =
    typeof weeklyMinutes === "number" && typeof obligationMinutes === "number";
  const workedHours = hasWorkData ? weeklyMinutes / 60 : 0;
  const obligationHours = hasWorkData ? obligationMinutes / 60 : 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 px-6 py-12 text-center text-black dark:text-zinc-50">
        {userName && (
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            hello, {userName}
          </p>
        )}

        {showTimer && (
          <AzanTimer
            currentPrayer={currentPrayer}
            formattedMinutes={formattedMinutes}
            formattedSeconds={formattedSeconds}
          />
        )}

        {!showTimer && hasWorkData && (
          <WorkTracker
            workedHours={workedHours}
            obligationHours={obligationHours}
          />
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
