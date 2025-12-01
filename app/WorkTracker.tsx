type WorkTrackerProps = {
  workedHours: number;
  obligationHours: number;
};

function WorkTracker({ workedHours, obligationHours }: WorkTrackerProps) {
  return (
    <p className="text-base text-zinc-700 dark:text-zinc-300">
      already work {workedHours.toFixed(1)} hours / {obligationHours.toFixed(1)} hours
    </p>
  );
}

export default WorkTracker