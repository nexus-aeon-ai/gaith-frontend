"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Plus } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useForm } from "react-hook-form";

import PricingPackageConfiguration from "@/components/ClientManagement/GenerateAssets/PricingPackageConfiguration";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  generatePricingSchema,
  type GeneratePricingFormData,
} from "@/lib/validations/generate-pricing";

import { Button } from "../ui/button";
import { CheckboxSquare } from "../ui/checkbox-square";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

interface PricingFormProps {
  onSubmit: (data: GeneratePricingFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

export const defaultFormData: GeneratePricingFormData = {
  // Basic Info
  fullName: "",
  email: "",

  // Agreement Dates
  proposalDate: new Date(),
  validUntilDate: new Date(),

  // Services
  services: [
    {
      name: "",
      description: "",
      price: 0,
      isSelected: false,
    },
  ],

  // Discount Section
  applyDiscount: false,
  discountType: undefined,
  discountAmount: undefined,
  discountReason: undefined,
  discountNotes: "",

  // Additional Items
  additionalItems: [
    {
      name: "",
      description: "",
      price: 0,
      isSelected: false,
    },
  ],

  // Currency
  currency: "USD",
};

const services = [
  {
    name: "Digital Marketing Strategy",
    description: "Comprehensive digital marketing strategy tailored to client needs",
  },
  {
    name: "Social Media Management",
    description: "Content creation, scheduling, and engagement across platforms",
  },
  {
    name: "SEO Optimization",
    description: "Optimize website for search engines and improve visibility",
  },
  {
    name: "Content Creation",
    description: "Blog posts, articles, and copywriting for websites and campaigns",
  },
  {
    name: "Email Marketing",
    description: "Campaign strategy, design, and deployment with analytics",
  },
];

const services2 = [
  { name: "Digital Marketing Strategy", price: "₿ 2,500" },
  { name: "Social Media Management", price: "₿ 2,500" },
  { name: "SEO Optimization", price: "₿ 2,500" },
  { name: "One-Time Setup Fee", price: "₿ 2,500" },
];

const packages2 = [
  {
    name: "Starter",
    subtitle: "Basic digital marketing services",
    price: "₿ 2,500",
    popular: false,
    features: ["Digital Marketing Strategy", "Digital Marketing Strategy"],
  },
  {
    name: "Professional",
    subtitle: "Premium full-service package",
    price: "₿ 2,500",
    popular: true,
    features: ["Digital Marketing Strategy", "Digital Marketing Strategy", "SEO Optimization"],
  },
  {
    name: "Enterprise",
    subtitle: "Premium full-service package",
    price: "₿ 2,500",
    popular: false,
    features: [
      "Digital Marketing Strategy",
      "Digital Marketing Strategy",
      "SEO Optimization",
      "SEO Optimization",
    ],
  },
];

const GeneratePricingForm = ({ onSubmit }: PricingFormProps) => {
  const { theme } = useTheme();
  const [customServices, setCustomServices] = useState<
    Array<{
      name: string;
      description: string;
      price: string;
    }>
  >([]);

  const handleAddCustomService = () => {
    setCustomServices(prev => [...prev, { name: "", description: "", price: "" }]);
  };

  const handleCustomChange = (index: number, field: string, value: string) => {
    const updated: { name: string; description: string; price: string }[] = [...customServices];
    updated[index] = { ...updated[index], [field]: value };
    setCustomServices(updated);
  };

  const handleRemoveCustomService = (index: number) => {
    setCustomServices(prev => prev.filter((_, i) => i !== index));
  };

  const form = useForm<GeneratePricingFormData>({
    resolver: zodResolver(generatePricingSchema),
    defaultValues: defaultFormData,
    mode: "onChange",
  });

  const handleProposalDateClick = () => {
    const input = document.getElementById("date-start") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  const handleValidDateClick = () => {
    const input = document.getElementById("date-end") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  return (
    <Form {...form}>
      <form
        id="pricing-form"
        onSubmit={form.handleSubmit(onSubmit, errors => {
          console.warn("Pricing form validation errors:", errors);
        })}
        className="w-full mx-auto space-y-4 font-inter grid lg:grid-cols-5 grid-cols-1 gap-2"
      >
        <div className="lg:col-span-3 col-span-1 space-y-3">
          {/* Client Information */}
          <Card className="pt-3 rounded-[16px] shadow-none">
            <CardHeader className="px-3">
              <CardTitle className="text-[14px] font-bold">Client Information</CardTitle>
              <Separator />
            </CardHeader>

            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-10 gap-3">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-4 col-span-1">
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-6 col-span-1">
                      <FormLabel>Client Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Client Email"
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
                  name="proposalDate"
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="md:col-span-5 col-span-1">
                      <FormLabel>Proposal Date</FormLabel>
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
                            onClick={handleProposalDateClick}
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
                  name="validUntilDate"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem className="md:col-span-5 col-span-1">
                      <FormLabel>Valid Until</FormLabel>
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
                              form.getValues().proposalDate
                                ? new Date(form.getValues().proposalDate)
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
                            onClick={handleValidDateClick}
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
              </div>
            </CardContent>
          </Card>

          {/* Service Selection */}
          <Card className="pt-3 rounded-[16px] shadow-none">
            <CardHeader className="flex flex-col px-3">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-[14px] font-bold">Service Selection</CardTitle>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleAddCustomService}
                  className="flex items-center text-md gap-2 [&_svg]:w-5 [&_svg]:h-5 cursor-pointer text-blue-600 hover:bg-transparent hover:text-blue-500"
                >
                  <Plus className="rounded-full p-1 bg-blue-100 dark:bg-blue-400" color="blue" />
                  Add Custom Service
                </Button>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-[12px] border border-[#DCE0E4] dark:border-[#404663] p-2 py-4"
                  >
                    <div className="flex items-start gap-2">
                      <CheckboxSquare />
                      <div className="flex flex-col">
                        <h3 className="font-bold text-[14px]">{service.name}</h3>
                        <p className="max-w-sm text-[12px]">{service.description}</p>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[150px]">
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                          fill="#687192"
                        />
                      </svg>
                      <Input
                        placeholder="0"
                        className="text-start ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                ))}
                {/* Dynamically rendered custom services */}
                {customServices.map((service, index) => (
                  <div
                    key={`custom-${index}`}
                    className="flex items-center justify-between rounded-[12px] border border-[#DCE0E4] dark:border-[#404663] p-2 py-4"
                  >
                    <div className="flex items-start w-full gap-2">
                      <CheckboxSquare />
                      <div className="flex flex-col w-full max-w-sm gap-2">
                        <Input
                          placeholder="Service Name"
                          value={service.name}
                          onChange={e => handleCustomChange(index, "name", e.target.value)}
                          className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px]"
                        />
                        <Input
                          placeholder="Service Description"
                          value={service.description}
                          onChange={e => handleCustomChange(index, "description", e.target.value)}
                          className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px]"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[150px]">
                        <svg
                          width="15"
                          height="13"
                          viewBox="0 0 15 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                            fill="#687192"
                          />
                        </svg>
                        <Input
                          placeholder="0"
                          value={service.price}
                          onChange={e => handleCustomChange(index, "price", e.target.value)}
                          className="text-start ring-0 focus:outline-0 border-none shadow-none"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCustomService(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 5L15 15M5 15L15 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Package Configuration */}
          <PricingPackageConfiguration />

          {/* discount options */}
          <Card className="pt-3 rounded-[16px] shadow-none">
            <CardHeader className="flex flex-row items-center justify-between px-3">
              <CardTitle className="text-[14px] font-bold">Discount Options</CardTitle>
              <div className="flex items-center gap-1">
                <Label htmlFor="apply-discount" className="text-muted-foreground">
                  Apply Discount
                </Label>
                <Switch
                  id="apply-discount"
                  className="
          data-[state=checked]:bg-blue-600
          data-[state=unchecked]:bg-gray-300
          dark:data-[state=unchecked]:bg-gray-700
          dark:data-[state=checked]:bg-blue-500
          transition-colors duration-200
        "
                />
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-6">
              <div className="grid md:grid-cols-2 grid-cols-1">
                {/* Discount Type */}
                <div>
                  <Label className="block mb-2 font-medium text-sm">Discount Type</Label>
                  <div className="flex items-center gap-6">
                    <RadioGroup>
                      <Label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="percentage" id="discount-percentage" />
                        <span className="text-sm">Percentage</span>
                      </Label>
                      <Label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="fixed" id="discount-fixed" />
                        <span className="text-sm">Fixed Amount</span>
                      </Label>
                    </RadioGroup>
                  </div>
                </div>

                {/* Discount Amount */}
                <div>
                  <Label htmlFor="discount-amount" className="block mb-2 font-medium text-sm">
                    Discount Amount
                  </Label>
                  <div className="relative w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      %
                    </span>
                    <Input
                      id="discount-amount"
                      placeholder="1,285.00"
                      className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] pl-8 py-6"
                    />
                  </div>
                </div>
              </div>

              {/* Discount Reason */}
              <div>
                <Label htmlFor="discount-reason" className="block mb-2 font-medium text-sm">
                  Discount Reason
                </Label>
                <Select>
                  <SelectTrigger
                    id="discount-reason"
                    className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6"
                  >
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new-client">New client discount</SelectItem>
                    <SelectItem value="seasonal">Seasonal offer</SelectItem>
                    <SelectItem value="loyalty">Loyalty discount</SelectItem>
                    <SelectItem value="custom">Custom reason</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Discount Notes */}
              <div>
                <Label htmlFor="discount-notes" className="block mb-2 font-medium text-sm">
                  Discount Notes
                </Label>
                <Textarea
                  id="discount-notes"
                  placeholder="Add notes about the discount"
                  className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-4"
                />
              </div>
            </CardContent>
          </Card>

          {/* additional items */}
          <Card className="pt-3 rounded-[16px] shadow-none">
            <CardHeader className="flex flex-row items-center justify-between px-3">
              <CardTitle className="text-[14px] font-bold">Additional Items</CardTitle>
              <Button
                variant="ghost"
                type="button"
                className="flex items-center text-md gap-2 [&_svg]:w-5 [&_svg]:h-5 cursor-pointer text-blue-600 hover:bg-transparent hover:text-blue-500"
              >
                <Plus className="rounded-full p-1 bg-blue-100 dark:bg-blue-400" color="blue" />
                Add Items
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between rounded-[12px] border border-[#DCE0E4] dark:border-[#404663] p-2 py-4">
                  <div className="flex items-start gap-2">
                    <CheckboxSquare />
                    <div className="flex flex-col">
                      <h3 className="font-bold text-[14px]">One Time Setup Fee</h3>
                      <p className="max-w-sm text-[12px]">Initial account setup and onboarding</p>
                    </div>
                  </div>
                  <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[150px]">
                    <svg
                      width="15"
                      height="13"
                      viewBox="0 0 15 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                        fill="#687192"
                      />
                    </svg>

                    <Input
                      placeholder="0"
                      className="text-start ring-0 focus:outline-0 border-none shadow-none"
                    />
                  </div>
                </div>{" "}
                <div className="flex items-center justify-between rounded-[12px] border border-[#DCE0E4] dark:border-[#404663] p-2 py-4">
                  <div className="flex items-start gap-2">
                    <CheckboxSquare />
                    <div className="flex flex-col">
                      <h3 className="font-bold text-[14px]">Analytics Dashboard</h3>
                      <p className="max-w-sm text-[12px]">
                        Custom reporting dashboard with real-time metrics
                      </p>
                    </div>
                  </div>
                  <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[150px]">
                    <svg
                      width="15"
                      height="13"
                      viewBox="0 0 15 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                        fill="#687192"
                      />
                    </svg>

                    <Input
                      placeholder="0"
                      className="text-start ring-0 focus:outline-0 border-none shadow-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between rounded-[12px] border border-[#DCE0E4] dark:border-[#404663] p-2 py-4">
                  <div className="flex items-start w-full gap-2">
                    <CheckboxSquare />
                    <div className="flex flex-col w-full max-w-sm gap-2">
                      <Input
                        placeholder="Item Name"
                        className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] "
                      />
                      <Input
                        placeholder="Item Description"
                        className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] "
                      />
                    </div>
                  </div>
                  <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[150px]">
                    <svg
                      width="15"
                      height="13"
                      viewBox="0 0 15 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                        fill="#687192"
                      />
                    </svg>

                    <Input
                      placeholder="0"
                      className="text-start ring-0 focus:outline-0 border-none shadow-none"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pt-3 rounded-[16px] shadow-none">
            <CardHeader className="flex flex-row items-center justify-between px-3">
              <CardTitle className="text-[14px] font-bold">Terms And Notes</CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-6">
              {/* Payment Terms */}
              <div>
                <Label htmlFor="payment-terms" className="block mb-2 font-medium text-sm">
                  Payment Terms
                </Label>
                <Select>
                  <SelectTrigger
                    id="payment-terms"
                    className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6"
                  >
                    <SelectValue placeholder="Net 30" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net-15">Net 15</SelectItem>
                    <SelectItem value="net-30">Net 30</SelectItem>
                    <SelectItem value="net-45">Net 45</SelectItem>
                    <SelectItem value="due-on-receipt">Due on receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Proposal Notes */}
              <div>
                <Label htmlFor="proposal-notes" className="block mb-2 font-medium text-sm">
                  Proposal Notes
                </Label>
                <Textarea
                  id="proposal-notes"
                  placeholder="Add proposal notes here..."
                  className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-4 min-h-[100px]"
                  defaultValue="This proposal is valid for 30 days from the date of issue. Services will commence within 7 business days of signed agreement. Monthly reporting included with all services."
                />
              </div>

              {/* Terms & Conditions */}
              <div>
                <Label htmlFor="terms-conditions" className="block mb-2 font-medium text-sm">
                  Terms & Conditions
                </Label>
                <Textarea
                  id="terms-conditions"
                  placeholder="Enter terms and conditions..."
                  className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-4 min-h-[120px]"
                  defaultValue={`1. All prices are in AED and exclude applicable taxes.
                2. Payment is due according to the selected payment terms.
                3. Cancellation requires 30 days written notice.
                4. Client-requested revisions beyond the scope may incur additional charges.
                5. Global Solutions Inc. retains ownership of all creative work until final payment is received.`}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 col-span-1 space-y-3 h-fit rounded-2xl dark:bg-gray-900 min-h-screen">
          <Card className="pt-3 rounded-[16px] shadow-none">
            <CardHeader className="px-2">
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
                <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Proposal Preview #988800
                </h1>
                <Button
                  type="button"
                  className="p-6 px-4 text-white dark:text-black text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate
                  <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="p-4 space-y-3">
                {/* Company Info */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col items-start gap-3">
                    <Image
                      src={"/images/logo.svg"}
                      alt="Logo"
                      width={100}
                      height={100}
                      className="w-12 h-12"
                    />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Prepared For:</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Global Solutions Inc.
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">anderson@email.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Pricing Proposal
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">May 27, 2025</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Prepared By:</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Sara Johnson
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Marketing Manager</p>
                  </div>
                </div>

                <Separator />

                {/* Selected Services */}
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Selected Services
                  </h2>
                  <div>
                    {services2.map((service, index) => (
                      <div key={index} className="flex items-center justify-between py-1">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{service.name}</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {service.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Packages */}
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Available Packages
                  </h2>
                  <div className="grid lg:grid-cols-1 md:grid-cols-3 sm:grid-cols-3 xl:grid-cols-3 grid-cols-1 gap-3">
                    {packages2.map((pkg, index) => (
                      <Card
                        key={index}
                        className={`relative rounded-2xl ${
                          pkg.popular
                            ? "border-2 border-blue-500 dark:border-blue-400"
                            : "border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-2 -right-2 ">
                            <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                              Popular
                            </span>
                          </div>
                        )}
                        <CardContent className="p-3 pt-4">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white text-center">
                            {pkg.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1 mb-3">
                            {pkg.subtitle}
                          </p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 text-center mb-3">
                            {pkg.price}
                          </p>
                          <div className="space-y-2">
                            {pkg.features.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Check className="w-3 h-3 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-gray-600 dark:text-gray-300 leading-tight">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />
                {/* Pricing Summary */}
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Pricing Summary
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
                      <p className="text-sm text-gray-900 dark:text-white">₿ 2,500</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Setup Fee</p>
                      <p className="text-sm text-gray-900 dark:text-white">₿ 500</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Total</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">₿ 4,500</p>
                    </div>
                  </div>
                </div>

                {/* Payment Terms */}
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Payment Terms
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Net 30 days from invoice date
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Notes</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    This proposal is valid for 30 days from the date of issue. Services will
                    commence within 7 business days of signed agreement. Monthly reporting included
                    with all services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Header */}
        </div>
      </form>
    </Form>
  );
};

export default GeneratePricingForm;
