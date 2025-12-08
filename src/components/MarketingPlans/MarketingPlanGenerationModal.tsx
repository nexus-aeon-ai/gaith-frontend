"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClients } from "@/lib/api/client/client";

const createGenerationSchema = (clientIdProvided: boolean) => z.object({
  company_website: z.string().min(1, "Company website is required").url("Please enter a valid URL"),
  clientId: clientIdProvided 
    ? z.string().optional() 
    : z.string().min(1, "Client is required"),
});

export type MarketingPlanGenerationFormData = z.infer<ReturnType<typeof createGenerationSchema>>;

interface MarketingPlanGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MarketingPlanGenerationFormData & { clientId?: string }) => void;
  defaultWebsite?: string;
  isSubmitting?: boolean;
  clientId?: string;
}

const MarketingPlanGenerationModal = ({
  open,
  onOpenChange,
  onSubmit,
  defaultWebsite = "",
  isSubmitting = false,
  clientId: providedClientId,
}: MarketingPlanGenerationModalProps) => {
  // Fetch clients
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await getClients();
      return res.data ?? [];
    },
    enabled: open,
  });

  const generationSchema = createGenerationSchema(!!providedClientId);

  const form = useForm<MarketingPlanGenerationFormData>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      company_website: defaultWebsite,
      clientId: providedClientId || undefined,
    },
  });

  const handleSubmit = (data: MarketingPlanGenerationFormData) => {
    onSubmit({ ...data, clientId: providedClientId || data.clientId });
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
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client {providedClientId ? "(Pre-selected)" : "*"}</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === "__none__" ? undefined : value)} 
                    value={field.value || "__none__"}
                    disabled={!!providedClientId}
                  >
                    <FormControl>
                      <SelectTrigger 
                        className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6"
                        disabled={!!providedClientId}
                      >
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!providedClientId && <SelectItem value="__none__">None</SelectItem>}
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.fullName || client.companyName || client.clientName || `Client ${client.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                className="rounded-[12px] dark:bg-[#0F1B29] bg-[#F3F5F7] text-black dark:text-white"
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

