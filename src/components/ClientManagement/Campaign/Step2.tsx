import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepFormProps } from "@/lib/types";

/* Step 2: Target Audience Settings */
function Step2({ form }: StepFormProps) {
  const { control } = form;

  const interests = [
    { value: "technology", label: "Technology" },
    { value: "fashion", label: "Fashion & Style" },
    { value: "sports", label: "Sports & Fitness" },
    { value: "travel", label: "Travel & Adventure" },
    { value: "food", label: "Food & Dining" },
    { value: "entertainment", label: "Entertainment" },
    { value: "business", label: "Business & Finance" },
    { value: "education", label: "Education & Learning" },
  ];

  const countries = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "in", label: "India" },
    { value: "jp", label: "Japan" },
  ];

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
                  defaultValue={field.value}
                  className="grid grid-cols-3 space-x-6"
                >
                  <FormItem className="flex p-3 border rounded-[12px] items-start space-x-3 space-y-0">
                    <FormControl className="mt-1">
                      <RadioGroupItem
                        value="existingCustomers"
                        className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                      />
                    </FormControl>
                    <div className="font-normal flex flex-col">
                      <p className="font-[500]">Existing Customers</p>
                      <p>Target current customer base</p>
                    </div>
                  </FormItem>
                  <FormItem className="flex p-3 border rounded-[12px] items-start space-x-3 space-y-0">
                    <FormControl className="mt-1">
                      <RadioGroupItem
                        value="lookalikeAudience"
                        className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                      />
                    </FormControl>
                    <div className="font-normal flex flex-col">
                      <p className="font-[500]">Lookalike Audience</p>
                      <p>Similar to existing customers</p>
                    </div>
                  </FormItem>

                  <FormItem className="flex p-3 border rounded-[12px] items-start space-x-3 space-y-0">
                    <FormControl className="mt-1">
                      <RadioGroupItem
                        value="newProspects"
                        className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                      />
                    </FormControl>
                    <div className="font-normal flex flex-col">
                      <p className="font-[500]">New Prospects</p>
                      <p>Reach new potential customers</p>
                    </div>
                  </FormItem>
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
                  <SelectItem value="13-17">13-17 years</SelectItem>
                  <SelectItem value="18-24">18-24 years</SelectItem>
                  <SelectItem value="25-34">25-34 years</SelectItem>
                  <SelectItem value="35-44">35-44 years</SelectItem>
                  <SelectItem value="45-54">45-54 years</SelectItem>
                  <SelectItem value="55+">55+ years</SelectItem>
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
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
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
                {interests.map(interest => (
                  <FormField
                    key={interest.value}
                    control={control}
                    name="interests"
                    render={({ field: { value, onChange } }) => {
                      const values = (value as string[]) || [];
                      return (
                        <FormItem
                          key={interest.value}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              className="rounded-md"
                              checked={values.includes(interest.value)}
                              onCheckedChange={checked => {
                                if (checked) {
                                  onChange([...values, interest.value]);
                                } else {
                                  onChange(values.filter(val => val !== interest.value));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{interest.label}</FormLabel>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
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
                  <Input
                    placeholder="Enter state or region"
                    {...field}
                    className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                  />
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
