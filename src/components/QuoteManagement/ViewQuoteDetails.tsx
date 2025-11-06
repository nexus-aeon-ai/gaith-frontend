"use client";

import { Send, SquarePen } from "lucide-react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DashboardListIcon } from "@/components/ui/icons/dashboard-list";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";

import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

type ServiceItem = {
  name: string;
  price: number;
  quantity?: number;
  taxPercentage?: number;
};

type CustomerInfo = {
  name: string;
  subtitle?: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  address: string;
};

type QuoteDetails = {
  number: string;
  createdDate: string;
  currency: string;
  createdBy: string;
};

type QuotationData = {
  title: string;
  description?: string;
  status?: string;
  services: ServiceItem[];
  setupFee?: number;
  customer: CustomerInfo;
  details: QuoteDetails;
  terms: string[];
  notes?: string;
  currencyCode?: string; // e.g. "USD"
};

export type QuotationCardProps = {
  data: QuotationData;
  className?: string;
  closeViewDetails: () => void;
};

const ViewQuoteDetails = ({ closeViewDetails, data }: QuotationCardProps) => {
  const {
    title,
    description,
    status = "Pending Approval",
    services,
    setupFee = 0,
    customer,
    details,
    terms,
    notes,
    currencyCode = "USD",
  } = data;

  const subtotal = services.reduce((sum, s) => sum + (s.price || 0) * (s.quantity || 1), 0);
  const totalTax = services.reduce(
    (sum, s) => sum + (s.price || 0) * (s.quantity || 1) * ((s.taxPercentage || 0) / 100),
    0,
  );
  const total = subtotal + totalTax + (setupFee || 0);

  const handleCancel = () => {
    closeViewDetails();
  };

  function formatMoney(value: number, currency = "USD") {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      // Fallback if an invalid currency code is supplied
      return new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 0,
      }).format(value);
    }
  }

  return (
    <div className="w-full mx-auto p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">
                <DashboardListIcon className="dark:text-[#E6EFF9]" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/quotations"
                className="text-blue-600 font-medium text-md"
                onClick={closeViewDetails}
              >
                Quotations Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quotation Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:gap-12 gap-4 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl whitespace-nowrap font-semibold text-foreground mb-2">
            Quotation Details - QUO-2024-001
          </h1>
          <p className="text-muted-foreground">
            Track quotation details, customer info, and updates.
          </p>
        </div>
        <div className="flex sm:flex-row flex-col gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="p-6 px-4 text-[16px] font-[400] border-none bg-card rounded-[16px] shadow=none border hover:bg-gray-200 dark:hover:bg-card/80 hover:text-dark"
          >
            <PdfIcon />
            <span className="hidden md:block">Export PDF</span>
            <span className="block md:hidden">PDF</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="p-6 px-4 hover:bg-[#3072C0] text-[16px] font-[400] border-[#3072C0] text-[#3072C0] rounded-[16px] bg-transparent"
          >
            <SquarePen />
            <span className="hidden md:block">Edit Quotations</span>
            <span className="block md:hidden">Edit</span>
          </Button>
          <Button
            type="submit"
            form="lead-form"
            variant={"outline"}
            className="p-6 px-5 text-[16px] bg-[#3072C0] font-[400] rounded-[16px] border-none hover:bg-[#3072C0]/80 text-[#fff] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send />
            <span className="hidden md:block">Send to Client</span>
            <span className="block md:hidden">Send</span>
          </Button>
        </div>
      </div>

      <Card
        className={cn("rounded-xl border bg-card", "p-4 md:p-6")}
        role="region"
        aria-label="Quotation"
      >
        {/* Header */}
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <h2 className="text-base md:text-lg font-semibold text-foreground text-pretty">
              {title}
            </h2>
            {description ? (
              <p className="text-sm text-muted-foreground text-pretty">{description}</p>
            ) : null}
          </div>
          <Badge
            variant="secondary"
            className="self-start rounded-full px-3 py-1 text-xs"
            aria-label={`Status: ${status}`}
          >
            {status}
          </Badge>
        </header>

        <Separator className="my-4" />

        {/* Content */}
        <div
          className={cn(
            "grid grid-cols-1 gap-4 md:gap-6",
            "lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]",
          )}
        >
          {/* Left: Services */}
          <section
            className="rounded-lg border p-4 md:p-5 bg-[#F3F5F7] dark:bg-[#0F1B29]"
            aria-labelledby="selected-services-heading"
          >
            <h3 id="selected-services-heading" className="text-sm font-semibold text-foreground">
              Selected Services
            </h3>

            <div className="mt-3 divide-y">
              {services.map(s => {
                const lineSubtotal = (s.price || 0) * (s.quantity || 1);
                const lineTax = lineSubtotal * ((s.taxPercentage || 0) / 100);
                const lineTotal = lineSubtotal + lineTax;
                const key = `${s.name}-${s.price}-${s.quantity}`;
                return (
                  <div
                    key={key}
                    className={cn("flex items-start justify-between gap-4 py-2 text-sm")}
                  >
                    <div>
                      <div className="text-foreground">{s.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.quantity ?? 1} x {formatMoney(s.price, currencyCode)}
                        {s.taxPercentage ? ` • Tax ${s.taxPercentage}%` : ""}
                      </div>
                    </div>
                    <span className="tabular-nums text-foreground">
                      {formatMoney(lineTotal, currencyCode)}
                    </span>
                  </div>
                );
              })}
            </div>

            <Separator className="my-3" />

            <div className="space-y-1">
              <div className="flex items-start justify-between gap-4 py-2 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{formatMoney(subtotal, currencyCode)}</span>
              </div>
              {setupFee > 0 && (
                <div className="flex items-start justify-between gap-4 py-2 text-sm">
                  <span className="text-muted-foreground">Setup Fee</span>
                  <span className="tabular-nums">{formatMoney(setupFee, currencyCode)}</span>
                </div>
              )}
              <div className="pt-1">
                <div className="flex items-start justify-between gap-4 py-2 text-sm">
                  <span className="font-semibold">Total</span>
                  <span className="tabular-nums font-semibold text-primary">
                    {formatMoney(total, currencyCode)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Right: Info Stack */}
          <div className="space-y-4 md:space-y-5">
            {/* Customer Info */}
            <section
              className="rounded-lg border p-4 md:p-5 bg-[#F3F5F7] dark:bg-[#0F1B29]"
              aria-labelledby="customer-info-heading"
            >
              <h3 id="customer-info-heading" className="text-sm mb-2 font-semibold text-foreground">
                Customer Information
              </h3>
              <Separator />
              <div className="mt-3">
                <div className="flex items-center gap-3 pb-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={"/images/girl-avatar.jpg"} alt={customer.name} />
                    <AvatarFallback>
                      {customer.name
                        .split(" ")
                        .map(s => s[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-none">{customer.name}</p>
                    {customer.subtitle ? (
                      <p className="text-xs text-muted-foreground mt-1">{customer.subtitle}</p>
                    ) : null}
                  </div>
                </div>

                {/* Inline key/value rows */}
                <div className="flex flex-col gap-2" role="list">
                  <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium text-foreground text-right break-all">
                      {customer.email}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium text-foreground text-right">{customer.phone}</span>
                  </div>
                  <div
                    className="flex items-start justify-between gap-4 text-sm sm:col-span-3"
                    role="listitem"
                  >
                    <span className="text-muted-foreground">Address</span>
                    <span className="font-medium text-foreground text-right block">
                      {customer.address}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Quotation Details */}
            <section
              className="rounded-lg border p-4 md:p-5 bg-[#F3F5F7] dark:bg-[#0F1B29]"
              aria-labelledby="quotation-details-heading"
            >
              <h3
                id="quotation-details-heading"
                className="text-sm mb-2 font-semibold text-foreground"
              >
                Quotation Details
              </h3>
              <Separator />
              <div className="mt-3 rounded-md">
                {/* Inline key/value rows (was <KeyValueRow />) */}
                <div role="list" className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                    <span className="text-muted-foreground">Quotation Number</span>
                    <span className="font-medium text-[#303444] dark:text-[#CCCFDB] text-right">
                      {details.number}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                    <span className="text-muted-foreground">Created Date</span>
                    <span className="font-medium text-[#303444] dark:text-[#CCCFDB] text-right">
                      {details.createdDate}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                    <span className="text-muted-foreground">Currency</span>
                    <span className="font-medium text-[#303444] dark:text-[#CCCFDB] text-right">
                      {details.currency}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                    <span className="text-muted-foreground">Created By</span>
                    <span className="font-medium text-[#303444] dark:text-[#CCCFDB] text-right">
                      {details.createdBy}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Terms */}
            <h3 id="terms-heading" className="text-sm mb-2 font-semibold text-foreground">
              Terms &amp; Conditions
            </h3>
            <section
              className="rounded-lg border p-3 bg-[#F3F5F7] dark:bg-[#0F1B29]"
              aria-labelledby="terms-heading"
            >
              <div>
                <ul className="list-disc pl-5 text-sm text-foreground/90 space-y-1">
                  {terms.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Notes */}
            <h3 id="notes-heading" className="text-sm mb-2 font-semibold">
              Notes
            </h3>
            {notes ? (
              <section
                className="rounded-lg border p-3 bg-[#F3F5F7] dark:bg-[#0F1B29]"
                aria-labelledby="notes-heading"
              >
                <div className="text-sm leading-relaxed text-foreground/90">{notes}</div>
              </section>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ViewQuoteDetails;
