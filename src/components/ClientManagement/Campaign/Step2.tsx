import { useWatch } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCampaignLookups } from "@/lib/api/campaign/campaign-lookups";
import { StepFormProps } from "@/lib/types";


/* Step 2: Target Audience Settings */
function Step2({ form }: StepFormProps) {
  const selectedCountry = useWatch({ control: form.control, name: "country" });
  const { control } = form;
  const {
    audienceTypes,
    ageRangeTypes,
    genderTypes,
    interestTypes,
    countryTypes,
    regionTypes,
    isLoading,
  } = useCampaignLookups();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4 ">
      <div>
        <p className="pb-2 text-[#303444] dark:text-[white] font-[700]">Targeting Settings</p>
        <FormField
          control={control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-3 space-x-6"
                >
                  {audienceTypes.map(audienceType => (
                    <FormItem
                      key={audienceType.id}
                      className="flex p-3 border rounded-[12px] items-start space-x-3 space-y-0"
                    >
                      <FormControl className="mt-1">
                        <RadioGroupItem
                          value={audienceType.id}
                          className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                        />
                      </FormControl>
                      <div className="font-normal flex flex-col">
                        <p className="font-[500]">{audienceType.name}</p>
                        <p className="text-sm">{audienceType.description || "No Description"}</p>
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

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="ageRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Range</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ageRangeTypes.map(ageRangeType => (
                    <SelectItem key={ageRangeType.id} value={ageRangeType.id}>
                      {ageRangeType.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {genderTypes.map(genderType => (
                    <SelectItem key={genderType.id} value={genderType.id}>
                      {genderType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-2">
        <FormField
          control={control}
          name="interests"
          render={() => (
            <FormItem>
              <FormLabel>Interests & Behaviors</FormLabel>
              <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
                {interestTypes.map(interest => (
                  <FormField
                    key={interest.value}
                    control={control}
                    name="interests"
                    render={({ field: { value, onChange } }) => {
                      const values = (value as string[]) || [];
                      return (
                        <FormItem
                          key={interest.id}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              className="rounded-md"
                              checked={values.includes(interest.id)}
                              onCheckedChange={checked => {
                                if (checked) {
                                  onChange([...values, interest.id]);
                                } else {
                                  onChange(values.filter(val => val !== interest.id));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">{interest.name}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className=" col-span-3  flex flex-col gap-4">
        <p>Geographic Targeting</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countryTypes.map(country => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="stateRegion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Region</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger disabled={!selectedCountry} className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regionTypes
                        .filter(region => region.countryTypeId === selectedCountry)
                        .map(region => (
                          <SelectItem key={region.id} value={region.id}>
                            {region.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default Step2;
