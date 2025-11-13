"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

interface BulkPostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BulkPostSheet({ open, onOpenChange }: BulkPostSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] h-full font-inter bg-white w-auto sm:min-w-[640px] overflow-y-auto rounded-l-[16px] overflow-x-hidden p-0">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
          <SheetTitle className="text-lg font-semibold">Generate Posts</SheetTitle>
        </SheetHeader>

        <div className="p-3 pt-0 space-y-3">
          <Label>Generate Posts AI</Label>
          <Textarea
            id="additionalNotes"
            placeholder="Check out our latest product features! 🚀 Innovation meets functionality in every detail. #ProductLaunch #Innovation"
            rows={4}
            className="resize-none dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
          />
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-card w-full justify-end flex gap-3 p-4 border-t">
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="p-6 px-8 hover:bg-[#637a96] text-[16px] font-[400] border rounded-[16px] bg-transparent"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="p-6 px-8 hover:bg-[#3072C0] text-[16px] font-[400] border-[#3072C0] text-[#3072C0] rounded-[16px] bg-transparent"
            >
              Regenerate
            </Button>
            <Button
              // type="submit"
              // form="aidata-form"
              variant={"outline"}
              className="p-6 px-8 text-white text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Post
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
