import { useEffect, useRef } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import RiskInResiko from "./RiskInResiko";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase";

type WorkTrackerProps = {
  workedHours: number;
  obligationHours: number;
};

function WorkTracker({ workedHours, obligationHours }: WorkTrackerProps) {
  const lastThreadsAccessValue = useRef<boolean | null>(null);
  const threadsAccessEnabled = Number.isFinite(obligationHours) && obligationHours < 3;

  useEffect(() => {
    if (lastThreadsAccessValue.current === threadsAccessEnabled) return;

    const controller = new AbortController();

    const updateThreadsAccess = async () => {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/extension_flags?key=eq.threads_access`,
          {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({ enabled: threadsAccessEnabled }),
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`Supabase returned ${response.status}`);
        }

        lastThreadsAccessValue.current = threadsAccessEnabled;
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to update Threads access", error);
        }
      }
    };

    updateThreadsAccess();

    return () => controller.abort();
  }, [threadsAccessEnabled]);

  const percentage = Math.max(
    0,
    Math.min(100, (workedHours / (obligationHours || 1)) * 100),
  );

  const hours = Math.floor(workedHours);
  const minutes = Math.round((workedHours - hours) * 60);
  const remaining = Math.max(0, obligationHours - workedHours);
  const remainingHours = Math.floor(remaining);
  const remainingMinutes = Math.round((remaining - remainingHours) * 60);

  const remainingTotalMinutes = Math.round(remaining * 60);

  const obligationHoursPart = Math.floor(obligationHours);
  const obligationMinutesPart = Math.round((obligationHours - obligationHoursPart) * 60);

  return (
    <div className="flex w-full flex-col items-center gap-4">
  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
    <Box position="relative" display="inline-flex">
      {/* background ring */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={152}
        thickness={4}
        sx={{ color: "#e01cd5" }}
      />
      {/* progress ring */}
      <Box
        position="absolute"
        top={0}
        left={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
      >
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={152}
          thickness={4}
        />
      </Box>
      {/* center content */}
      <Box
        position="absolute"
        top={0}
        left={0}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
      >
        <Typography
          variant="caption"
          sx={{
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            fontWeight: 600,
          }}
        >
          need
        </Typography>
        <Typography
          variant="h4"
          sx={{
            mt: 0.5,
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {remainingHours}h {remainingMinutes}m
        </Typography>
        <Typography variant="caption">
          {/* Remaining {remainingHours}h {remainingMinutes}m */}
        </Typography>
      </Box>
    </Box>

    <p className="text-sm text-zinc-600 dark:text-zinc-400">
      already work {hours}h {minutes}m / {obligationHoursPart}h {obligationMinutesPart}m
    </p>
  </Box>

  {/* <RiskInResiko minutes={remainingTotalMinutes} /> */}
</div>
  );
}

export default WorkTracker
