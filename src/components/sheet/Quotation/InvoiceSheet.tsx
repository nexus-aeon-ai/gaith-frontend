"use client";

import { Button } from "@/components/ui/button";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { cn } from "../../../lib/utils";

export default function InvoiceSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {

  const generateInvoice = () => {
    onOpenChange(false);
  };

  const services = [
    {
      name: "Digital Marketing Strategy",
      price: 2500,
    },
    {
      name: "Social Media Management",
      price: 2500,
    },
    {
      name: "SEO Optimization",
      price: 2500,
    },
    {
      name: "Branding",
      price: 2500,
    },
    {
      name: "One-Time Setup Fee",
      price: 500,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] bg-card w-auto sm:min-w-[450px] overflow-y-auto rounded-l-[16px] overflow-x-hidden">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
          <SheetTitle className="text-lg font-medium">Generate Invoice - QUO-2024-001</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 sm:pt-0 pt-0 sm:p-4 p-2">
          {/* info */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-[#070913] dark:text-[#F6FBFE] text-[16px] font-[700]">
              Enterprise Software Solution
            </p>
            <p className="text-muted-foreground text-[14px]">Quotation #QUO-2024-001</p>
            <p className="text-muted-foreground text-[14px]">Valid until: January 15, 2025</p>
          </div>
          <hr />
          {/* form - to section */}
          <div className="flex sm:flex-row flex-col gap-3 justify-between">
            <div className="flex flex-col items-start gap-1">
              <p className="text-[#070913] dark:text-[#F6FBFE] text-[17px] font-medium">From</p>
              <p className="text-muted-foreground text-[14px]">Your Company Name</p>
              <p className="text-muted-foreground text-[14px]">123 Business Street</p>
              <p className="text-muted-foreground text-[14px]">City, State 12345</p>
              <p className="text-muted-foreground text-[14px]">contact@company.com</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <p className="text-[#070913] dark:text-[#F6FBFE] text-[17px] font-medium">To</p>
              <p className="text-muted-foreground text-[14px]">Your Company Name</p>
              <p className="text-muted-foreground text-[14px]">123 Business Street</p>
              <p className="text-muted-foreground text-[14px]">City, State 12345</p>
              <p className="text-muted-foreground text-[14px]">contact@company.com</p>
            </div>
          </div>

          {/* services */}
          <div className="flex flex-col border px-3 space-y-2 p-2 rounded-[12px] bg-[#F3F5F7] dark:bg-card">
            {services.map((service, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <p>{service.name}</p>
                <p>{service.price}</p>
              </div>
            ))}
            <hr />
            <div className="flex justify-between items-center">
              <p>Subtotal</p>
              <p>2500</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Setup Fee</p>
              <p>500</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Total</p>
              <p>4500</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky w-full items-center justify-end flex bottom-0 gap-3 p-4 bg-card">
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              "bg-card border-border text-xs h-8 sm:h-10",
              "hover:bg-card hover:border-blue-500",
            )}
          >
            <PdfIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="hidden sm:inline dark:text-white text-gray-900">Export PDF</span>
            <span className="sm:hidden dark:text-white text-gray-900">PDF</span>
          </Button>
          <Button
            onClick={generateInvoice}
            className="flex items-center p-6 bg-[#3072C0] text-white rounded-[16px] text-[16px] font-normal"
          >
            <p>Send Invoice</p>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
