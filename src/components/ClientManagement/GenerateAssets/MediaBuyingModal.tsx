"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClients } from "@/lib/api/client/client";

const createMediaBuyingFormSchema = (clientIdProvided: boolean) => z.object({
  platform: z.string().min(1, "Platform is required"),
  clientId: clientIdProvided 
    ? z.string().optional() 
    : z.string().min(1, "Client is required"),
});

type MediaBuyingFormData = z.infer<ReturnType<typeof createMediaBuyingFormSchema>>;

interface MediaBuyingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MediaBuyingFormData & { clientId?: string }) => void;
  initialData?: MediaBuyingFormData;
  clientId?: string;
}

const platforms = [
  { value: "meta", label: "Meta (Facebook & Instagram)" },
  { value: "google", label: "Google Ads" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter/X" },
  { value: "tiktok", label: "TikTok" },
];

export default function MediaBuyingModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  clientId: providedClientId,
}: MediaBuyingModalProps) {
  // Fetch clients
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await getClients();
      return res.data ?? [];
    },
    enabled: open,
  });

  const mediaBuyingFormSchema = createMediaBuyingFormSchema(!!providedClientId);

  const form = useForm<MediaBuyingFormData>({
    resolver: zodResolver(mediaBuyingFormSchema),
    defaultValues: {
      platform: initialData?.platform || "meta",
      clientId: providedClientId || initialData?.clientId || undefined,
    },
  });

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        platform: initialData?.platform || "meta",
        clientId: providedClientId || initialData?.clientId || undefined,
      });
    }
  }, [open, initialData, providedClientId, form]);

  const handleSubmit = (data: MediaBuyingFormData) => {
    onSubmit({ ...data, clientId: providedClientId || data.clientId });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dark:bg-[#212945] bg-card font-inter rounded-[16px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Generate Media Buying Plan</DialogTitle>
          <DialogDescription>
            Select the platform for your media buying plan.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platforms.map(platform => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                onClick={() => onOpenChange(false)}
                className="rounded-[12px] dark:bg-[#0F1B29] bg-[#F3F5F7] text-black dark:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#3072C0] hover:bg-[#184a86] text-white rounded-[12px]"
              >
                Generate
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

