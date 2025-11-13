export type AnalyticsSummaryCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendColor: string;
  subLabel?: string;
};

const AnalyticsCard: React.FC<AnalyticsSummaryCardProps> = ({
  label,
  value,
  icon,
  trend,
  trendColor,
  subLabel,
}) => (
  <div
    className={
      "flex flex-col justify-between rounded-xl shadow-md p-4 min-w-[180px] bg-card text-card-foreground"
    }
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col">
        <span className="text-xs font-medium opacity-80">{label}</span>
        <span className="text-2xl font-bold leading-tight mt-2">{value}</span>
      </div>
      <div className={"  p-2  flex items-center justify-center w-12 h-12"}>{icon}</div>
    </div>
    <div className="flex items-center gap-2 mt-2">
      <span className={`text-xs font-semibold ${trendColor}`}>{trend}</span>
      <span className="text-xs opacity-70">{subLabel}</span>
    </div>
  </div>
);

export default AnalyticsCard;
