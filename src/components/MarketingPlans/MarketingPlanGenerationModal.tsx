"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const generationSchema = z.object({
  company_website: z.string().min(1, "Company website is required").url("Please enter a valid URL"),
});

export type MarketingPlanGenerationFormData = z.infer<typeof generationSchema>;

interface MarketingPlanGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MarketingPlanGenerationFormData) => void;
  defaultWebsite?: string;
  isSubmitting?: boolean;
}

const MarketingPlanGenerationModal = ({
  open,
  onOpenChange,
  onSubmit,
  defaultWebsite = "",
  isSubmitting = false,
}: MarketingPlanGenerationModalProps) => {
  const form = useForm<MarketingPlanGenerationFormData>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      company_website: defaultWebsite,
    },
  });

  const handleSubmit = (data: MarketingPlanGenerationFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          form.reset({ company_website: defaultWebsite });
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] dark:bg-[#212945] bg-card font-inter rounded-[16px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Generate Marketing Plan</DialogTitle>
          <DialogDescription>Provide the company website to kick off marketing plan generation.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="company_website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset({ company_website: defaultWebsite });
                  onOpenChange(false);
                }}
                className="rounded-[12px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#3072C0] hover:bg-[#184a86] text-white rounded-[12px]"
              >
                {isSubmitting ? "Generating..." : "Generate"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MarketingPlanGenerationModal;

