import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Content from "@/components/ui/icons/social/content";
import Email from "@/components/ui/icons/social/email";
import Fb from "@/components/ui/icons/social/fb";
import SearchEngine from "@/components/ui/icons/social/search-engine";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { StepFormProps } from "@/lib/types";

function StepPreferences({ form }: StepFormProps) {
  const { control } = form;

  const budgetDistributionOptions = [
    {
      id: "socialMedia",
      label: "Social Media",
      subText: "Facebook, Instagram, Twitter",
      icon: <Fb />,
      channel: "social_media",
    },
    {
      id: "searchEngine",
      label: "Search Engine",
      subText: "Google Ads, Bing Ads",
      icon: <SearchEngine />,
      channel: "search_engine",
    },
    {
      id: "emailMarketing",
      label: "Email Marketing",
      subText: "Newsletter, Campaigns",
      icon: <Email />,
      channel: "email_marketing",
    },
    {
      id: "contentMarketing",
      label: "Content Marketing",
      subText: "Blog, Video, Infographics",
      icon: <Content />,
      channel: "content_marketing",
    },
  ];

  return (
    <div className="flex flex-col gap-4 ">
      <div>
        <p className="pb-2 text-[#303444] dark:text-[white] font-[700]">Budget Allocation</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="totalBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Budget</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter budget amount"
                    className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="dailySpendLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily Spend Limit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                      <SelectValue placeholder="Select daily spend limit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0-50">$0 - $50</SelectItem>
                    <SelectItem value="51-100">$51 - $100</SelectItem>
                    <SelectItem value="101-200">$101 - $200</SelectItem>
                    <SelectItem value="201-500">$201 - $500</SelectItem>
                    <SelectItem value="500+">$500+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p>Budget Distribution</p>
        <div className="flex flex-col gap-2">
          {budgetDistributionOptions.map(option => (
            <FormField
              key={option.id}
              control={control}
              name="budgetDistribution"
              render={({ field }) => {
                const distributions = field.value || [];
                const currentDist = distributions.find(d => d.channel === option.channel) || {
                  percentage: 25,
                };

                return (
                  <FormItem className="space-y-0">
                    <div className="flex flex-row border p-3 rounded-[12px] items-center space-x-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-[#508CD3] dark:text-[white]">{option.icon}</div>
                        <div className="flex flex-col">
                          <p className="font-[500]">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.subText}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[#303444] dark:text-[white] font-[500]">
                        <FormControl>
                          <Slider
                            value={[currentDist.percentage]}
                            min={0}
                            max={100}
                            step={5}
                            className="w-[100px]"
                            onValueChange={([value]) => {
                              const newDist = distributions.filter(
                                d => d.channel !== option.channel,
                              );
                              if (value > 0) {
                                newDist.push({ channel: option.channel, percentage: value });
                              }
                              field.onChange(newDist);
                            }}
                          />
                        </FormControl>
                        <div className="dark:bg-[#0F1B29] min-w-[60px] px-3 py-2 text-center bg-[#F3F5F7] rounded-[12px]">
                          {currentDist.percentage}%
                        </div>
                      </div>
                    </div>
                  </FormItem>
                );
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <FormField
          control={control}
          name="biddingStrategy"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Bidding Strategy</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  <FormItem className="flex p-3 border rounded-[12px] items-start space-x-3 space-y-0">
                    <FormControl className="mt-1">
                      <RadioGroupItem
                        value="maximize_clicks"
                        className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                      />
                    </FormControl>
                    <div className="font-normal flex flex-col">
                      <p className="font-[500]">Maximize Clicks</p>
                      <p>Get the most clicks for your budget</p>
                    </div>
                  </FormItem>
                  <FormItem className="flex p-3 border rounded-[12px] items-start space-x-3 space-y-0">
                    <FormControl className="mt-1">
                      <RadioGroupItem
                        value="maximize_conversions"
                        className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                      />
                    </FormControl>
                    <div className="font-normal flex flex-col">
                      <p className="font-[500]">Maximize Conversions</p>
                      <p>Optimize for conversion actions</p>
                    </div>
                  </FormItem>
                  <FormItem className="flex p-3 border rounded-[12px] items-start space-x-3 space-y-0">
                    <FormControl className="mt-1">
                      <RadioGroupItem
                        value="target_cpa"
                        className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                      />
                    </FormControl>
                    <div className="font-normal flex flex-col">
                      <p className="font-[500]">Target CPA</p>
                      <p>Set a target cost per acquisition</p>
                    </div>
                  </FormItem>
                  <FormItem className="flex p-3 border rounded-[12px] items-start space-x-3 space-y-0">
                    <FormControl className="mt-1">
                      <RadioGroupItem
                        value="manual_cpc"
                        className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                      />
                    </FormControl>
                    <div className="font-normal flex flex-col">
                      <p className="font-[500]">Manual CPC</p>
                      <p>Set your own cost per click</p>
                    </div>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default StepPreferences;
