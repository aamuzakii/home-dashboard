/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { PRAYER_TIMES } from './constants'

const AzanTable = ({currentIndex}: any) => {
  return (
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
  )
}

export default AzanTable