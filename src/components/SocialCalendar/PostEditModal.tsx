"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const postFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  platform: z.string().min(1, "Platform is required"),
  content: z.string().min(1, "Content is required"),
  post_details: z.string().min(1, "Post details are required"),
});

export type PostFormData = z.infer<typeof postFormSchema>;

interface PostEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PostFormData) => void;
  initialData?: PostFormData;
  defaultDate?: string;
}

const platforms = [
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Instagram", label: "Instagram" },
  { value: "Facebook", label: "Facebook" },
  { value: "TikTok", label: "TikTok" },
  { value: "Twitter", label: "Twitter/X" },
];

export default function PostEditModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  defaultDate,
}: PostEditModalProps) {
  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      date: initialData?.date || defaultDate || "",
      platform: initialData?.platform || "",
      content: initialData?.content || "",
      post_details: initialData?.post_details || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        date: initialData?.date || defaultDate || "",
        platform: initialData?.platform || "",
        content: initialData?.content || "",
        post_details: initialData?.post_details || "",
      });
    }
  }, [open, initialData, defaultDate, form]);

  const handleSubmit = (data: PostFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-full dark:bg-[#212945] bg-card font-inter rounded-[16px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? "Edit Post" : "Create New Post"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the post details below"
              : "Fill in the details to create a new post"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      {platforms.map((platform) => (
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter post content"
                      className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="post_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Details</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter detailed post information"
                      className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] min-h-[150px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-[12px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#3072C0] hover:bg-[#184a86] text-white rounded-[12px]"
              >
                {initialData ? "Update Post" : "Create Post"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

