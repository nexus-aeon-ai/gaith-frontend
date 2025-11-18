"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

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
import DeleteIcon from "@/components/ui/icons/options/delete-icon-filled";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getClients } from "@/lib/api/client/client";
import { useClientLookups } from "@/lib/api/client/client-lookups";
import { getQuotationCurrencies } from "@/lib/api/quotations";
import {
  createQuoteSchema,
  ServiceInstance,
  statusOptions,
  udpateQuoteSchema,
  type CreateQuotationFormData,
} from "@/lib/validations/quotation";

import { Quotation } from "../../lib/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface QuoteFormProps {
  initialData?: CreateQuotationFormData;
  onSubmit: (data: CreateQuotationFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  quotation?: Quotation | null;
}

interface TotalAccumulation {
  subtotal: number;
  totalTax: number;
  grandTotal: number;
}

const defaultFormData: CreateQuotationFormData = {
  clientId: "",
  validUntil: new Date(),
  title: "",
  description: "",
  serviceInstance: [{ serviceId: "", currencyId: "", servicePrice: 0, taxPercentage: 0, total: 0 }],
  notes: "",
  status: statusOptions[0],
};

const QuotationForm = ({ initialData, onSubmit, mode = "create", quotation }: QuoteFormProps) => {
  const { theme } = useTheme();

  const { clientServiceOffers } = useClientLookups();

  // Fetch clients from API
  const { data: apiClientsData, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await getClients();
      return res.data ?? [];
    },
    initialData: [],
  });

  const { data: currenciesList } = useQuery({
    queryKey: ["currencies"],
    queryFn: async () => {
      const res = await getQuotationCurrencies();
      return res.data ?? [];
    },
    initialData: [],
  });

  type CurrencyItem = { id: string; code: string; name: string; symbol?: string };

  const initialDefaultValues =
    mode === "edit" ? initialData ?? undefined : initialData ?? defaultFormData;

  console.log("initialDataaaaa", initialData);

  const form = useForm<any>({
    // use the partial update schema as resolver in edit mode so missing field's don't block submit
    resolver: zodResolver(mode === "edit" ? udpateQuoteSchema : createQuoteSchema),
    defaultValues: initialDefaultValues,
    mode: "onChange",
  });

  // when initialData loads for edit mode, reset the form values so fields get populated
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset(initialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);
  const { control, setValue } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "serviceInstance",
  });
  const serviceInstances = useWatch({
    control,
    name: "serviceInstance",
  });

  // Fetch currencies list
  const { data: currenciesResp } = useQuery({
    queryKey: ["quotationCurrencies"],
    queryFn: async () => {
      const res = await getQuotationCurrencies();
      return res.data || [];
    },
  });
  const currencies = (currenciesResp || []) as CurrencyItem[];

  // watch selected currencyId to display symbol in price labels
  const selectedCurrencyId = useWatch({ control, name: "currencyId" }) as string | undefined;
  const selectedCurrency = currencies.find(c => c.id === selectedCurrencyId);
  const currencySymbol = selectedCurrency?.symbol || "$";

  useEffect(() => {
    if (!serviceInstances) return;

    serviceInstances.forEach((item: ServiceInstance, index: number) => {
      const servicePrice = Number(item.servicePrice) || 0;
      const tax = Number(item.taxPercentage) || 0;
      const total = parseFloat((servicePrice * (1 + tax / 100)).toFixed(2));

      if (item.total !== total) {
        setValue(`serviceInstance.${index}.total`, total, {
          shouldDirty: false,
          shouldValidate: false,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceInstances]);

  const totals = serviceInstances?.reduce(
    (acc: TotalAccumulation, item: ServiceInstance) => {
      const quantity = 1;
      const servicePrice = Number(item.servicePrice) || 0;
      const tax = Number(item.taxPercentage) || 0;

      const itemSubtotal = quantity * servicePrice;
      const itemTaxAmount = itemSubtotal * (tax / 100);

      acc.subtotal += itemSubtotal;
      acc.totalTax += itemTaxAmount;
      acc.grandTotal += itemSubtotal + itemTaxAmount;

      return acc;
    },
    { subtotal: 0, totalTax: 0, grandTotal: 0 },
  );

  const handleValidDate = () => {
    const input = document.getElementById("date-valid") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  const handleTaxChange = (value: string, onChange: (val: number | undefined) => void) => {
    if (value === "") {
      onChange(undefined);
      return;
    }

    const num = Number(value);
    if (!isNaN(num)) {
      if (num < 0 || num > 100) {
        console.warn("Tax percentage must be between 0 and 100");
        return;
      }
      onChange(num);
    }
  };

  const terms = [
    "Payment terms: 50% upfront, 50% upon completion",
    "Project timeline: 3-4 months",
    "Includes 6 months of technical support",
    "Additional changes may incur extra charges",
    "All work will be completed according to agreed specifications",
    "Client approval required for major changes",
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <Form {...form}>
      <form
        id="quotation-form"
        onSubmit={(e: React.BaseSyntheticEvent) => {
          // debug: log submit event and then delegate to react-hook-form with both
          // success and error handlers so we can see why submission may be blocked
          console.log("QuotationForm onSubmit event", { mode });

          const submit = form.handleSubmit(
            (data: any) => {
              try {
                onSubmit(data);
              } catch (err) {
                console.error("Parent onSubmit threw:", err);
              }
            },
            errors => {
              console.log("QuotationForm handleSubmit errors", errors);
            },
          );

          return submit(e);
        }}
        className="w-full mx-auto space-y-4 font-inter"
      >
        {mode === "edit" && quotation && (
          <Card className="shadow-none dark:bg-[#0F1B29] bg-[#F3F5F7]">
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-md font-medium">Customer Information</h2>
                  <p className="text-sm text-muted-foreground">Customer details are read-only</p>
                </div>
                <Badge
                  variant="secondary"
                  className="rounded-md p-2 px-4 bg-[#ECA33814] text-[#A17607]"
                >
                  Pending
                </Badge>
              </div>
              <hr />
              <div className="flex mt-3 items-center gap-3">
                <Image
                  src={quotation?.customer?.avatar}
                  alt={quotation?.customer?.name}
                  width={40}
                  height={40}
                  className="rounded-full shrink-0"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {quotation.customer.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {quotation.customer.email}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6">
                <div className=" flex flex-col">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-md font-[400] text-[#687192]">Email</p>
                    <p className="text-sm font-[400]">Tech@Techcorp.Com</p>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-md font-[400] text-[#687192]">Phone</p>
                    <p className="text-sm font-[400]">+1 (555) 123-4567</p>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-md font-[400] text-[#687192]">Address</p>
                    <p className="text-sm font-[400]">123 Tech Street, Silicon Valley</p>
                  </div>
                </div>
                <div className="border-l border-accent-background h-full" />
                <div className=" flex flex-col">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-md font-[400] text-[#687192]">Quotation Number</p>
                    <p className="text-sm font-[400]">{quotation.quotationNumber}</p>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-md font-[400] text-[#687192]">Created Date</p>
                    <p className="text-sm font-[400]">December 15, 2024</p>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-md font-[400] text-[#687192]">Created By</p>
                    <p className="text-sm  font-[400]">Sales Manager</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {mode === "edit" && quotation && (
          <Card className="rounded-[16px] shadow-none">
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-md">Quotation Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4 w-full space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="validUntil"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Valid Until Date</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            id="date-valid"
                            type="date"
                            value={
                              value && !isNaN(value.getTime())
                                ? value.toISOString().split("T")[0]
                                : ""
                            }
                            onChange={e => {
                              const dateString = e.target.value;
                              const date = dateString ? new Date(dateString) : undefined;
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
                            onClick={handleValidDate}
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="dark:bg-[#0F1B29] capitalize py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(option => (
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
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Quotation Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Quotation Title"
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
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {mode === "create" && (
          <Card className="rounded-[16px] shadow-none">
            <CardContent className="p-4 w-full space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Client</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={val => field.onChange(val)}>
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select Client" />
                          </SelectTrigger>
                          <SelectContent>
                            {apiClientsData.map(client => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.clientName}
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
                  name="validUntil"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Valid Until</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            id="date-valid"
                            type="date"
                            value={
                              value && !isNaN(value.getTime())
                                ? value.toISOString().split("T")[0]
                                : ""
                            }
                            onChange={e => {
                              const dateString = e.target.value;
                              const date = dateString ? new Date(dateString) : undefined;
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
                            onClick={handleValidDate}
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

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Quotation Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Quotation Title"
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
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* Service and pricing */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="flex items-center flex-row justify-between px-3">
            <CardTitle className="text-lg font-medium">Service & Pricing Details</CardTitle>
            <div className="flex justify-end items-center">
              <Button
                type="button"
                variant={"ghost"}
                onClick={() =>
                  append({
                    serviceId: "",
                    currencyId: "",
                    servicePrice: 0,
                    taxPercentage: 0,
                  })
                }
                className="flex items-center hover:bg-transparent hover:text-[#3072C0] gap-2 text-[#3072C0] dark:text-[#CCCFDB] dark:hover:text-[#CCCFDB] cursor-pointer"
              >
                <Plus className="h-4 w-4 p-[2px] bg-[#bbd9ff] dark:bg-[#495462] rounded-full" />
                Add items
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-6">
            {/* Service Fields */}
            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative grid items-center grid-rows-1 grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto]  gap-4 border rounded-[12px] p-4 dark:border-[#404663] border-[#DCE0E4]"
                >
                  {/* Description */}
                  <FormField
                    control={control}
                    name={`serviceInstance.${index}.serviceId`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2 col-span-1 mt-[6px]">
                        <FormLabel>Service</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value as string}
                            onValueChange={val => field.onChange(val)}
                          >
                            <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {clientServiceOffers.map(option => (
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
                  {/* Service Price */}
                  <FormField
                    control={control}
                    name={`serviceInstance.${index}.servicePrice`}
                    render={({ field: priceField }) => (
                      <FormItem className="lg:col-span-2 col-span-1">
                        <FormLabel className="whitespace-nowrap">Service Price</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center">
                            <Input
                              type="number"
                              inputMode="decimal"
                              placeholder="0"
                              className="dark:bg-[#0F1B29] text-[16px] shadow-none py-6 bg-[#F3F5F7] rounded-[12px] pr-20"
                              value={priceField.value === 0 ? "" : priceField.value ?? ""}
                              onChange={e => {
                                const value = e.target.value;
                                if (value === "") priceField.onChange(undefined);
                                else if (!isNaN(Number(value))) priceField.onChange(Number(value));
                              }}
                            />
                            <div className="absolute right-0 top-0 bottom-0 flex items-center">
                              <FormField
                                control={control}
                                name={`serviceInstance.${index}.currencyId`}
                                render={({ field: currencyField }) => (
                                  <FormControl>
                                    <Select
                                      value={currencyField.value}
                                      onValueChange={currencyField.onChange}
                                    >
                                      <SelectTrigger className="h-full w-[70px] border-0 border-l bg-transparent focus:ring-0 focus:ring-offset-0 rounded-l-none rounded-r-[12px] dark:border-gray-700 shadow-none">
                                        <SelectValue>
                                          {currencyField.value
                                            ? currenciesList.find(
                                                option => option.id === currencyField.value,
                                              )?.symbol
                                            : null}
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        {currenciesList.map(option => (
                                          <SelectItem key={option.id} value={option.id}>
                                            {option.code} - {option.symbol}
                                          </SelectItem>
                                        ))}
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
                  {/* Tax */}
                  <FormField
                    control={control}
                    name={`serviceInstance.${index}.taxPercentage`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="0"
                            inputMode="decimal"
                            className="dark:bg-[#0F1B29] text-[16px] shadow-none py-6 bg-[#F3F5F7] rounded-[12px]"
                            value={field.value === 0 ? "" : field.value ?? ""}
                            onChange={e => handleTaxChange(e.target.value, field.onChange)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Total (non-editable) */}
                  <FormField
                    control={control}
                    name={`serviceInstance.${index}.total`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total</FormLabel>
                        <FormControl>
                          <div className="py-3 px-3 rounded-[12px] text-gray-700 dark:text-gray-300 border border-transparent">
                            <p className="text-[16px] font-[700]">
                              {currencySymbol}
                              {field.value?.toFixed(2)}
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 🗑 Delete Button — Compact */}
                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all  p-1  h-auto w-auto"
                      title="Remove service"
                    >
                      <DeleteIcon className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Summary Section */}
            <div className="w-full flex justify-evenly dark:bg-[#0F1B29] border text-[16px] shadow-none py-6 bg-[#F3F5F7] rounded-[12px]">
              <div className="flex flex-col gap-3 justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Subtotal:
                </span>
                <span className="text-[18px] font-[700] tracking-wide">
                  {currencySymbol}
                  {totals?.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-3 justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Total Tax:
                </span>
                <span className="text-[18px] font-[700] tracking-wide">
                  {currencySymbol}
                  {totals?.totalTax.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-3 justify-between items-center text-sm font-medium ">
                <span className="text-gray-800 dark:text-gray-100">Grand Total:</span>
                <span className="text-[18px] font-[700] tracking-wide">
                  {currencySymbol}
                  {totals?.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* terms and conditions */}
        <Card className="rounded-[16px] shadow-none">
          <CardContent className="p-4 w-full space-y-3">
            <p className="text-md font-medium mb-2">Terms & Conditions</p>
            <div className="w-full flex flex-col px-4 dark:bg-[#0F1B29] border text-[16px] shadow-none py-3 bg-[#F3F5F7] rounded-[12px]">
              <ul className="list-disc ml-6">
                {terms.map((term, index) => (
                  <li key={index}>
                    <span className="text-gray-600 dark:text-gray-300 text-[16px] font-normal">
                      {term}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-md font-medium mb-2">Notes</p>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Textarea
                      placeholder="Notes"
                      className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default QuotationForm;
