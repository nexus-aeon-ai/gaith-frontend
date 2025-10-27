"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { CheckboxSquare } from "../../ui/checkbox-square";
import { Textarea } from "../../ui/textarea";

interface EmailFormState {
  recipientEmail: string;
  deliveryMethod: "email" | "customer_portal";
  subject: string;
  message: string;
  sendCopy: boolean;
}

export default function SendToClientSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // ✅ Proper default state
  const [emailForm, setEmailForm] = useState<EmailFormState>({
    recipientEmail: "",
    deliveryMethod: "email",
    subject: "",
    message: "",
    sendCopy: false,
  });

  const clearForm = () => {
    setEmailForm({
      recipientEmail: "",
      deliveryMethod: "email",
      subject: "",
      message: "",
      sendCopy: false,
    });
    onOpenChange(false);
  };

  const handleSend = () => {
    console.log("Form Data:", emailForm);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] bg-card w-[400px] sm:w-[540px] overflow-y-auto rounded-l-[16px] overflow-x-hidden">
        <SheetHeader className="flex flex-row items-center border-b justify-between space-y-0 pb-4">
          <SheetTitle className="text-lg font-medium">Send Quotation to Client</SheetTitle>
        </SheetHeader>

        <div className="space-y-3 sm:p-4 sm:pt-0 p-2">
          {/* Recipient Email */}
          <div>
            <Label className="mb-2 font-normal">Recipient Email</Label>
            <Input
              type="email"
              value={emailForm.recipientEmail}
              onChange={e => setEmailForm(prev => ({ ...prev, recipientEmail: e.target.value }))}
              placeholder="client@example.com"
              className="dark:bg-[#0F1B29] bg-[#DCE0E4] p-3"
            />
          </div>

          {/* Delivery Method */}
          <div>
            <Label className="mb-2">Delivery Method</Label>
            <RadioGroup
              value={emailForm.deliveryMethod}
              onValueChange={value =>
                setEmailForm(prev => ({
                  ...prev,
                  deliveryMethod: value as "email" | "customer_portal",
                }))
              }
              className="flex flex-col mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="email"
                  id="email"
                  className="border-[#3072C0] data-[state=checked]:text-[#3072C0]"
                />
                <Label htmlFor="email" className="text-[14px] cursor-pointer">
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="customer_portal"
                  id="customer_portal"
                  className="border-[#3072C0] data-[state=checked]:text-[#3072C0]"
                />
                <Label htmlFor="customer_portal" className="text-[14px] cursor-pointer">
                  Customer Portal
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Email Subject */}
          <div>
            <Label className="mb-2 font-normal">Email Subject</Label>
            <Input
              type="text"
              value={emailForm.subject}
              onChange={e => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter subject"
              className="dark:bg-[#0F1B29] bg-[#DCE0E4] p-3"
            />
          </div>

          {/* Email Message */}
          <div>
            <Label className="mb-2 font-normal">Email Message</Label>
            <Textarea
              value={emailForm.message}
              onChange={e => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Write your message here..."
              className="dark:bg-[#0F1B29] bg-[#DCE0E4] p-3"
              rows={6}
            />
          </div>

          {/* Send Copy */}
          <div className="flex items-center space-x-2">
            <CheckboxSquare
              id="send-copy"
              checked={emailForm.sendCopy}
              onCheckedChange={() => setEmailForm(prev => ({ ...prev, sendCopy: !prev.sendCopy }))}
              className="cursor-pointer"
            />
            <Label htmlFor="send-copy" className="text-[14px] cursor-pointer font-normal">
              Send me a copy
            </Label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute w-full flex bottom-0 gap-3 p-4 border-t">
          <Button variant="outline" onClick={clearForm} className="flex-1 rounded-[16px] py-6 bg-card text-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-dark">
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            className="flex items-center flex-1 py-6 sm:px-8 px-6 bg-[#3072C0] hover:bg-[#3072C0]/80 text-white rounded-[16px] text-[16px] font-medium"
          >
            <Send size={28} />
            <p>Send Quotation</p>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
