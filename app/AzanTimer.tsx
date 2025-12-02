type AzanTimerProps = {
  currentPrayer: { name: string; label: string };
  formattedMinutes: string;
  formattedSeconds: string;
};

function AzanTimer({ currentPrayer, formattedMinutes, formattedSeconds }: AzanTimerProps) {
  return (
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
  );
}


export default AzanTimer