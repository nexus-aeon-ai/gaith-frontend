export type AnalyticsSummaryCardProps = {
  label: string;
  value: string | number;
  icon: string;
  trend: string;
  trendColor: string;
  subLabel: string;
};

const AnalyticsCard: React.FC<AnalyticsSummaryCardProps> = ({ label, value, icon, trend, trendColor, subLabel }) => (
  <div className={`flex flex-col justify-between rounded-xl shadow-md p-4 min-w-[180px] bg-[#212945] text-white h-28`}> 
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col">
        <span className="text-xs font-medium opacity-80">{label}</span>
        <span className="text-2xl font-bold leading-tight">{value}</span>
      </div>
      <div className="text-2xl bg-white/20 rounded-full p-2 w-4 h-4 flex items-center justify-center">{icon}</div>
    </div>
    <div className="flex items-center gap-2 mt-2">
      <span className={`text-xs font-semibold ${trendColor}`}>{trend}</span>
      <span className="text-xs opacity-70">{subLabel}</span>
    </div>
  </div>
);

export default AnalyticsCard;