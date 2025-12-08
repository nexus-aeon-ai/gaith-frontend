import { JSX } from "react";

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
import { useCampaignLookups } from "@/lib/api/campaign/campaign-lookups";
import { StepFormProps } from "@/lib/types";

const iconMap: Record<string, JSX.Element> = {
  "Social Media": <Fb />,
  "Search Engine": <SearchEngine />,
  "Email Marketing": <Email />,
  "Content Marketing": <Content />,
};

const subTextMap: Record<string, string> = {
  "Social Media": "Facebook, Instagram, Twitter",
  "Search Engine": "Google Ads, Bing Ads",
  "Email Marketing": "Newsletter, Campaigns",
  "Content Marketing": "Blog, Video, Infographics",
};

interface Distribution {
  channel: string;
  percentage?: number;
  percent?: number;
}

function StepPreferences({ form }: StepFormProps) {
  const { control } = form;
  const { biddingStrategyTypes, channelTypes } = useCampaignLookups();

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
                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
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
        <p className="text-sm font-medium">Budget Distribution</p>

        <div className="flex flex-col gap-2">
          {channelTypes?.map(option => (
            <FormField
              key={option.id}
              control={control}
              name="budgetDistribution"
              render={({ field }) => {
                const distributions: Distribution[] = field.value || [];
       
                const currentDist: Distribution = distributions.find(
                  d => d.channel === option.id,
                ) ?? {
                  channel: option.id,
                };

                const currentValue = currentDist.percentage ?? currentDist.percent ?? 25;
                return (
                  <FormItem className="space-y-0">
                    <div className="flex flex-row border p-3 rounded-[12px] items-center space-x-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-[#508CD3] dark:text-[white]">
                          {iconMap[option.name] ?? <div className="w-5 h-5" />} {/* fallback */}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-[500]">{option.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {subTextMap[option.name] ?? ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[#303444] dark:text-[white] font-[500]">
                        <FormControl>
                          <Slider
                            value={[currentValue]}
                            min={0}
                            max={100}
                            step={5}
                            className="w-[100px]"
                            onValueChange={([value]) => {
                              const newDist = distributions.filter(d => d.channel !== option.id);
                              if (value > 0) {
                                newDist.push({
                                  channel: option.id,
                                  percentage: value, // standardize going forward
                                });
                              }
                              field.onChange(newDist);
                            }}
                          />
                        </FormControl>

                        <div className="dark:bg-[#0F1B29] min-w-[60px] px-3 py-2 text-center bg-[#F3F5F7] rounded-[12px]">
                          {currentValue}%
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
                  {biddingStrategyTypes?.map(option => (
                    <FormItem
                      key={option.id}
                      className="flex p-3 border rounded-[12px] items-start space-x-3 space-y-0"
                    >
                      <FormControl className="mt-1">
                        <RadioGroupItem
                          value={option.id}
                          className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                        />
                      </FormControl>
                      <div className="font-normal flex flex-col">
                        <p className="font-[500]">{option.name}</p>
                        <p className="text-sm">{option.description || "No description"}</p>
                      </div>
                    </FormItem>
                  ))}
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
