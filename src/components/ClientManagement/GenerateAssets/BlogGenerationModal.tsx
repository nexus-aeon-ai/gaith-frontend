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

const blogFormSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  topic: z.string().min(1, "Topic is required"),
  company_website: z.string().url("Please enter a valid URL"),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

interface BlogGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BlogFormData) => void;
  defaultWebsite?: string;
}

const platforms = [
  { value: "Website", label: "Website" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Medium", label: "Medium" },
  { value: "Blog", label: "Blog" },
];

export default function BlogGenerationModal({
  open,
  onOpenChange,
  onSubmit,
  defaultWebsite = "",
}: BlogGenerationModalProps) {
  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      platform: "Website",
      topic: "",
      company_website: defaultWebsite,
    },
  });

  const handleSubmit = (data: BlogFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dark:bg-[#212945] bg-card font-inter rounded-[16px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Generate Blog Post</DialogTitle>
          <DialogDescription>
            Provide the details below to generate a blog post.
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
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter blog topic"
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
              name="company_website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://company.com"
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
                onClick={() => onOpenChange(false)}
                className="rounded-[12px]"
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

