import type { CSSProperties } from "react";

type WorkTrackerProps = {
  workedHours: number;
  obligationHours: number;
};

function WorkTracker({ workedHours, obligationHours }: WorkTrackerProps) {
  const percentage = Math.max(
    0,
    Math.min(100, (workedHours / (obligationHours || 1)) * 100),
  );

  const progressStyle: CSSProperties = {
    background: `conic-gradient(rgb(16 185 129) ${percentage}%, rgb(229 231 235) ${percentage}%)`,
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-40 w-40 sm:h-48 sm:w-48">
          <div
            className="absolute inset-0 rounded-full p-[3px]"
            style={progressStyle}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-emerald-50/80 dark:bg-emerald-950/40">
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300">
                  worked
                </div>
                <div className="mt-1 text-3xl font-semibold tabular-nums text-emerald-900 dark:text-emerald-50">
                  {workedHours.toFixed(1)}
                </div>
                <div className="text-xs text-emerald-700/80 dark:text-emerald-300/80">
                  / {obligationHours.toFixed(1)} hrs
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          already work {workedHours.toFixed(1)} hours / {obligationHours.toFixed(1)} hours
        </p>
      </div>
    </div>
  );
}

export default WorkTracker