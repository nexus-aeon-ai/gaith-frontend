
import ChoreCard from "@/components/CampaignSubmitted/Analytics/ChoreCard";

const StatsGeographic = () => {
  const data = [
    {
      label: "18-24",
      value: 92,
    },
    {
      label: "25-34",
      value: 92,
    },
    {
      label: "35-44",
      value: 92,
    },
    {
      label: "45+",
      value: 92,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <ChoreCard title="Audience Demographics">
        <div className="flex flex-col gap-0">
          <p className="text-sm text-muted-foreground mb-2">Age Groups</p>
          {data.map((item, index) => (
            <div key={index} className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-md font-medium">{item.label}</span>
                <div className="flex gap-2 max-w-[130px] w-1/2 items-center">
                  <span className="text-sm font-semibold">{item.value}%</span>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                    <div
                      className="h-2 bg-[#3FD09F] rounded-full transition-all duration-500"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">Gender Distribution</p>
            <div className="flex justify-between lg:w-1/2 w-full">
              <div className="text-md flex gap-2 items-center font-medium">
                <div className="w-3 h-3 rounded-full bg-[#EE4F8D]" />
                <span>Female 75%</span>
              </div>
              <div className="text-md flex gap-2 items-center font-medium">
                <div className="w-3 h-3 rounded-full bg-[#3072C0]" />
                <span>Male 25%</span>
              </div>
            </div>
          </div>
        </div>
      </ChoreCard>
      <ChoreCard title="Geographic Performance">
        <div className="flex items-center justify-center h-full">
          <div className="bg-[url('/images/maps.png')] bg-cover bg-center w-full rounded-[16px] min-h-[180px] flex items-center justify-center">
            <div className="bg-card w-[80%] md:max-w-[300px] p-3 rounded-[16px] flex flex-col gap-2 items-start">
              <h3 className="text-md font-bold">Top Performing Regions</h3>
              <div className="flex w-full justify-between items-center ">
                <p className="text-sm text-muted-foreground">United States</p>
                <p className="text-sm font-bold">45%</p>
              </div>
              <div className="flex w-full justify-between items-center ">
                <p className="text-sm text-muted-foreground">United Kingdom</p>
                <p className="text-sm font-bold">45%</p>
              </div>
              <div className="flex w-full justify-between items-center ">
                <p className="text-sm text-muted-foreground">Australia</p>
                <p className="text-sm font-bold">45%</p>
              </div>
            </div>
          </div>
        </div>
      </ChoreCard>
    </div>
  );
};

export default StatsGeographic;
