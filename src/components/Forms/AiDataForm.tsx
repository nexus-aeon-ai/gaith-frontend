"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "lucide-react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClientLookups } from "@/lib/api/client/client-lookups";
import { createAiDataSchema, type CreateAiFormData } from "@/lib/validations/ai-data";

import { companySizeOptions } from "../../lib/validations/client";
import { CheckboxSquare } from "../ui/checkbox-square";
import LocationIcon from "../ui/icons/location";
import Instagram from "../ui/icons/social/instagram";
import Fb from "../ui/icons/socials/fb";
import Linkedin from "../ui/icons/socials/linkedin";
import Twitterx from "../ui/icons/socials/twitterx";
import Website from "../ui/icons/socials/website";
import Youtube from "../ui/icons/socials/youtube";

interface AiDataFormProps {
  initialData?: CreateAiFormData;
  onSubmit: (data: CreateAiFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

export const defaultFormData: CreateAiFormData = {
  // Basic Information
  clientName: "",
  industry: "",
  companySize: "",
  businessOverview: "",

  // Contact Information
  email: "",
  phoneNumber: "",
  location: "",
  fullAddress: "",

  // Agreement Information
  agreementStartDate: new Date(),
  agreementEndDate: new Date(),
  contractDuration: 0,
  contractDurationUnit: "MONTH",

  // Market and Target Audience
  primaryRegion: undefined,
  targetAudience: undefined,
  secondaryMarkets: "",
  languagesSupported: [],

  // Company Profile
  visionStatement: "",
  missionStatement: "",
  aiDataProdsServices: [],

  // Social Media Accounts
  linkedinUrl: "",
  facebookUrl: "",
  youtubeUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  websiteUrl: "",

  // Team Assignment
  primaryAccManager: undefined,
  marketingStrategist: undefined,
  priorityLevel: "Medium",

  // Additional Team Members
  additionalTeamMembers: [],

  // Additional Notes
  additionalNotes: "",
};

const AiDataForm = ({ initialData, onSubmit }: AiDataFormProps) => {
  const { theme } = useTheme();

  const form = useForm<CreateAiFormData>({
    resolver: zodResolver(createAiDataSchema),
    defaultValues: initialData || defaultFormData,
    mode: "onChange",
  });

  const {
    clientLanguages,
    clientIndustries,
    clientMarketRegions,
    clientServiceOffers,
    clientTargetAudiences,
    clientTeamRoles,
  } = useClientLookups();

  const handleStartDateClick = () => {
    const input = document.getElementById("date-start") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  const handleEndDateClick = () => {
    const input = document.getElementById("date-end") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  return (
    <Form {...form}>
      <form
        id="aidata-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mx-auto space-y-4 font-inter"
      >
        {/* Basic Information */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-md font-medium">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Client Name"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry Sector</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientIndustries?.map(industry => (
                            <SelectItem key={industry.id} value={industry.id as string}>
                              {industry.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizeOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessOverview"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Business Overview</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Business Overview"
                        className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-md font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email Address"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+976555550"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          placeholder="City, Country"
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] pr-10" // added right padding
                          {...field}
                        />
                        <LocationIcon
                          className="absolute right-4 text-gray-900 dark:text-gray-300 pointer-events-none"
                          color="currentColor"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullAddress"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Complete business address including street, city, state, postal code, and country"
                        className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-md font-medium mb-3">Agreement Information</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
              <FormField
                control={form.control}
                name="agreementStartDate"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Agreement Start Date</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          id="date-start"
                          type="date"
                          value={value ? new Date(value).toISOString().split("T")[0] : ""}
                          onChange={e => {
                            const date = new Date(e.target.value);
                            onChange(date);
                          }}
                          className="
                    dark:bg-[#0F1B29] bg-[#F3F5F7] p-6
                      pr-10
                      [&::-webkit-calendar-picker-indicator]:opacity-0 
                      [&::-webkit-calendar-picker-indicator]:absolute 
                      [&::-webkit-calendar-picker-indicator]:w-full 
                      [&::-webkit-calendar-picker-indicator]:h-full
                    "
                          min={new Date().toISOString().split("T")[0]}
                        />

                        <button
                          type="button"
                          onClick={handleStartDateClick}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreementEndDate"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Agreement End Date</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          id="date-end"
                          type="date"
                          value={value ? new Date(value).toISOString().split("T")[0] : ""}
                          onChange={e => {
                            const date = new Date(e.target.value);
                            onChange(date);
                          }}
                          min={
                            form.getValues().agreementStartDate
                              ? new Date(form.getValues().agreementStartDate)
                                  .toISOString()
                                  .split("T")[0]
                              : undefined
                          }
                          {...field}
                          className="
                    dark:bg-[#0F1B29] bg-[#F3F5F7] p-6
                      pr-10
                      [&::-webkit-calendar-picker-indicator]:opacity-0 
                      [&::-webkit-calendar-picker-indicator]:absolute 
                      [&::-webkit-calendar-picker-indicator]:w-full 
                      [&::-webkit-calendar-picker-indicator]:h-full
                    "
                        />

                        <button
                          type="button"
                          onClick={handleEndDateClick}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractDuration"
                render={({ field: durationField }) => (
                  <FormItem>
                    <FormLabel>Contract Duration</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        {/* Number Input */}
                        <Input
                          type="number"
                          inputMode="numeric"
                          placeholder="0"
                          className="dark:bg-[#0F1B29] text-[16px] shadow-none py-6 bg-[#F3F5F7] rounded-[12px] pr-28"
                          value={durationField.value === 0 ? "" : (durationField.value ?? "")}
                          onChange={e => {
                            const value = e.target.value;
                            if (value === "") durationField.onChange(undefined);
                            else if (!isNaN(Number(value))) durationField.onChange(Number(value));
                          }}
                        />

                        {/* Unit Dropdown */}
                        <div className="absolute right-0 top-0 bottom-0 flex items-center">
                          <FormField
                            control={form.control}
                            name="contractDurationUnit"
                            render={({ field: unitField }) => (
                              <FormControl>
                                <Select value={unitField.value} onValueChange={unitField.onChange}>
                                  <SelectTrigger className="h-full w-[100px] border-0 border-l bg-transparent focus:ring-0 rounded-l-none rounded-r-[12px] dark:border-gray-700 shadow-none">
                                    <SelectValue>
                                      {unitField.value
                                        ? unitField.value === "YEAR"
                                          ? "Year"
                                          : "Month"
                                        : null}
                                    </SelectValue>
                                  </SelectTrigger>

                                  <SelectContent>
                                    <SelectItem value="MONTH">Month</SelectItem>
                                    <SelectItem value="YEAR">Year</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </div>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Marketing and Targeting Audience Management */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-md font-medium">Market & Target Audience</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="primaryRegion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Market Region</FormLabel>
                      <FormControl>
                        <Select value={field.value || undefined} onValueChange={field.onChange}>
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {clientMarketRegions.map(option => (
                              <SelectItem key={option.id} value={option.id as string}>
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select target audience" />
                          </SelectTrigger>
                          <SelectContent>
                            {clientTargetAudiences.map(option => (
                              <SelectItem
                                key={option.id}
                                value={option.id as string} // ✅ store ID instead of name
                              >
                                {option.name} {/* ✅ display readable name */}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryMarkets"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Secondary Markets</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List additional markets or regions (comma-separated)"
                          className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="languagesSupported"
                  render={({ field }) => {
                    const selected = Array.isArray(field.value) ? field.value : [];

                    return (
                      <FormItem className="col-span-2">
                        <FormLabel className="text-sm font-medium">Languages Supported</FormLabel>

                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="space-y-1 grid lg:grid-cols-4 grid-cols-2 w-full mt-1">
                            {clientLanguages.map(option => {
                              const isChecked = selected.includes(option.code as string);

                              return (
                                <label
                                  key={option.code}
                                  className="flex flex-row items-center space-x-2 cursor-pointer"
                                >
                                  <FormControl>
                                    <CheckboxSquare
                                      checked={isChecked}
                                      onCheckedChange={checkedNow => {
                                        const updated = checkedNow
                                          ? [...selected, option.code]
                                          : selected.filter(code => code !== option.code);
                                        field.onChange(updated); // ✅ triggers revalidation
                                      }}
                                    />
                                  </FormControl>
                                  <span className="text-sm">{option.name}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* company profile */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Company Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="visionStatement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vision Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What is the client's long-term vision and aspirations?"
                          className="resize-none dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="missionStatement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mission Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="client's core purpose and how they serve their customers"
                          className="resize-none dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="aiDataProdsServices"
                render={({ field }) => {
                  // Ensure it's always an array
                  const selected = Array.isArray(field.value) ? field.value : [];

                  return (
                    <FormItem className="col-span-2">
                      <FormLabel>Service Offerings</FormLabel>

                      {/* Checkboxes grid */}
                      <div className="grid md:grid-cols-4 grid-cols-2 gap-2 mt-3">
                        {clientServiceOffers.map(service => {
                          const isChecked = selected.includes(service.id as string);
                          return (
                            <label
                              key={service.id}
                              className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                              <CheckboxSquare
                                checked={isChecked}
                                onCheckedChange={checked => {
                                  const updated = checked
                                    ? [...selected, service.id]
                                    : selected.filter(id => id !== service.id);
                                  field.onChange(updated);
                                }}
                              />
                              <span>{service.name}</span>
                            </label>
                          );
                        })}
                      </div>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Accounts */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Social Media Accounts</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                  {/* LinkedIn */}
                  <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                            <div className="bg-[#3072C014] rounded-full h-8 w-8 flex items-center justify-center p-1">
                              {/* LinkedIn SVG */}
                              <Linkedin />
                            </div>
                            <Input
                              placeholder="https://linkedin.com/company/..."
                              {...field}
                              className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Facebook */}
                  <FormField
                    control={form.control}
                    name="facebookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook URL</FormLabel>
                        <FormControl>
                          <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                            <div className="bg-[#3072C014] h-8 w-8 flex items-center justify-center rounded-full p-1">
                              {/* Facebook SVG */}
                              <Fb />
                            </div>
                            <Input
                              placeholder="https://facebook.com/company/..."
                              {...field}
                              className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* YouTube */}
                  <FormField
                    control={form.control}
                    name="youtubeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube URL</FormLabel>
                        <FormControl>
                          <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                            <div className="bg-[#FF000014] rounded-full h-8 w-8 flex items-center justify-center p-1">
                              {/* YouTube SVG */}
                              <Youtube />
                            </div>
                            <Input
                              placeholder="https://youtube.com/channel/..."
                              {...field}
                              className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  {/* Twitter/X */}
                  <FormField
                    control={form.control}
                    name="twitterUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter/X URL</FormLabel>
                        <FormControl>
                          <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                            <div className="bg-[#07091314] rounded-full h-8 w-8 flex items-center justify-center p-1">
                              {/* Twitter SVG */}
                              <Twitterx />
                            </div>
                            <Input
                              placeholder="https://twitter.com/company"
                              {...field}
                              className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Instagram */}
                  <FormField
                    control={form.control}
                    name="instagramUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram URL</FormLabel>
                        <FormControl>
                          <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                            <div className="bg-[#3072C014] h-8 w-8 flex items-center justify-center rounded-full p-1">
                              {/* Reuse Facebook SVG for demo */}
                              <Instagram />
                            </div>
                            <Input
                              placeholder="https://instagram.com/company"
                              {...field}
                              className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Website */}
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                            <div className="h-8 w-8 flex items-center justify-center">
                              {/* Website SVG */}
                              <Website />
                            </div>
                            <Input
                              placeholder="https://company.com"
                              required={false}
                              {...field}
                              className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Add Another Platform button */}
              <div className="flex items-center gap-2 hover:bg-[#c2d6ee] transition-all cursor-pointer w-fit py-4 px-6 bg-[#3072C014] border border-[#3072C0] rounded-[16px]">
                <CirclePlus color="#3072C0" size={20} />
                <span className="text-[#3072C0] text-[16px] font-medium">Add Another Platform</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Assignment */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Team Assignment</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Primary Account Manager */}
                <FormField
                  control={form.control}
                  name="primaryAccManager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Account Manager</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                            <SelectValue placeholder="Select Account Manager" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clientTeamRoles.map(option => (
                            <SelectItem key={option.id} value={option.id as string}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Marketing strategist */}
                <FormField
                  control={form.control}
                  name="marketingStrategist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marketing Strategist</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clientTeamRoles.map(option => (
                            <SelectItem key={option.id} value={option.id as string}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* priority level */}
                <FormField
                  control={form.control}
                  name="priorityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                            <SelectValue placeholder="Select Priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["High", "Medium", "Low"].map(option => (
                            <SelectItem className="capitalize" key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Team Members */}
              <FormField
                control={form.control}
                name="additionalTeamMembers"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Additional Team Members</FormLabel>
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* First column */}
                      <div className="space-y-3">
                        {clientTeamRoles.slice(0, 4).map(option => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="additionalTeamMembers"
                            render={({ field }) => {
                              const checked = field.value?.includes(option.id as string);

                              return (
                                <FormItem className="flex flex-row items-center space-x-2">
                                  <FormControl>
                                    <CheckboxSquare
                                      id={option.id}
                                      checked={checked}
                                      onCheckedChange={checkedNow => {
                                        const newValue = checkedNow
                                          ? [...(field.value || []), option.id]
                                          : field.value?.filter((val: string) => val !== option.id);
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel htmlFor={option.id} className="text-sm">
                                    {option.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>

                      {/* Second column */}
                      <div className="space-y-3">
                        {clientTeamRoles.slice(4, 7).map(option => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="additionalTeamMembers"
                            render={({ field }) => {
                              const checked = field.value?.includes(option.id as string);

                              return (
                                <FormItem className="flex flex-row items-center space-x-2">
                                  <FormControl>
                                    <CheckboxSquare
                                      id={option.id}
                                      checked={checked}
                                      onCheckedChange={checkedNow => {
                                        const newValue = checkedNow
                                          ? [...(field.value || []), option.id]
                                          : field.value?.filter((val: string) => val !== option.id);
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel htmlFor={option.id} className="text-sm">
                                    {option.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">
              Additional Notes (For Internal Use By The Marketing Team)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="internalNotes">Add Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        id="additionalNotes"
                        placeholder="Add Notes"
                        rows={4}
                        className="resize-none dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default AiDataForm;
