"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClientSchema, type CreateClientFormData } from "@/lib/validations/client";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { CheckboxSquare } from "../ui/checkbox-square";

interface ClientFormProps {
  initialData?: CreateClientFormData;
  onSubmit: (data: CreateClientFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const defaultFormData: CreateClientFormData = {
  // Basic Information
  fullName: "",
  industry: "technology",
  businessOverview: "",
  email: "",
  companySize: "0-50",
  // Contact
  contactName: "",
  jobTitle: "",
  phoneNumber: "",
  location: "",
  fullAddress: "",
  linkedinProfile: "",
  department: "",

  // Agreement information
  accountManager: "",
  clientSince: new Date(),
  agreementStartDate: new Date(),
  agreementEndDate: new Date(),
  contractDuration: "",

  clientStatus: "active", // default from enum: active | inactive | Pending | Suspended
  monthlyBudget: "0",
  priorityLevel: "low", // default from enum: low | medium | high

  // Website
  websiteUrl: "",

  // Notes
  internalNotes: "",
};

const GeneratePricingForm = ({ initialData, onSubmit }: ClientFormProps) => {
  const { theme } = useTheme();
  const form = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: initialData || defaultFormData,
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
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mx-auto space-y-4 font-inter grid md:grid-cols-5 grid-cols-1"
      >
        <div className="md:col-span-3 col-span-1">
          {/* Client Information */}
          <Card className="pt-3 rounded-[16px] shadow-none">
            <CardHeader className="px-3">
              <CardTitle className="text-lg font-medium">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
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
                  name="agreementStartDate"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
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
                  name="agreementEndDate"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
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
            <CardHeader className="flex flex-row items-center justify-between px-3">
              <CardTitle className="text-md font-medium">Client Information</CardTitle>
              <Button
                variant="ghost"
                className="flex items-center text-md gap-2 [&_svg]:w-5 [&_svg]:h-5 cursor-pointer text-blue-600 hover:bg-transparent hover:text-blue-500"
              >
                <Plus className="rounded-full p-1 bg-blue-100 dark:bg-blue-400" color="blue" />
                Add Custom Service
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <CheckboxSquare />
                    <div className="flex flex-col">
                      <h3>Digital Marketing Strategy</h3>
                      <p>Comprehensive digital marketing strategy tailored to client needs</p>
                    </div>
                  </div>
                  <Input placeholder="0" className="dark:bg-[#0F1B29] bg-[#F3F5F7] text-center p-6 w-[150px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default GeneratePricingForm;
