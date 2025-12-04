type RiskInResikoProps = {
  minutes: number;
};

function RiskInResiko({ minutes }: RiskInResikoProps) {
  const RISK_RATE_USD_PER_HOUR = 13;
  const USD_TO_IDR = 16600;

  const hours = Math.max(0, minutes) / 60;
  const riskUsd = hours * RISK_RATE_USD_PER_HOUR;
  const riskIdr = riskUsd * USD_TO_IDR;

  const formattedRiskIdr = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(riskIdr);

  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
        in risk
      </p>
      <p className="text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
        {formattedRiskIdr}
      </p>
    </div>
  );
}

export default RiskInResiko;
