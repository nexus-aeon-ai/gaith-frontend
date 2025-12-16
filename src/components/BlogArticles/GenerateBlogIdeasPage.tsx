"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Home } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { getClients } from "@/lib/api/client/client";

const createBlogFormSchema = (clientIdProvided: boolean) =>
  z.object({
    postContent: z.string().optional(),
    platform: z.string().min(1, "Platform is required"),
    topic: z.string().min(1, "Topic is required"),
    company_website: z.string().url("Please enter a valid URL"),
    clientId: clientIdProvided
      ? z.string().optional()
      : z.string().min(1, "Client is required"),
  });

type BlogFormData = z.infer<ReturnType<typeof createBlogFormSchema>>;

interface GenerateBlogIdeasPageProps {
  onBack: () => void;
  onSubmit: (data: BlogFormData & { clientId?: string }) => void;
  defaultWebsite?: string;
  clientId?: string;
  isLoading?: boolean;
}

const platforms = [
  { value: "Website", label: "Website" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Medium", label: "Medium" },
  { value: "Blog", label: "Blog" },
];

export default function GenerateBlogIdeasPage({
  onBack,
  onSubmit,
  defaultWebsite = "",
  clientId: providedClientId,
  isLoading = false,
}: GenerateBlogIdeasPageProps) {
  // Fetch clients
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await getClients();
      return res.data ?? [];
    },
  });

  const blogFormSchema = createBlogFormSchema(!!providedClientId);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      postContent: "",
      platform: "Website",
      topic: "",
      company_website: defaultWebsite,
      clientId: providedClientId,
    },
  });

  const handleSubmit = (data: BlogFormData) => {
    onSubmit({ ...data, clientId: providedClientId || data.clientId });
    form.reset();
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 font-inter">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Home className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <button
          onClick={onBack}
          className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
        >
          Blogs & Articles
        </button>
        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-gray-700 dark:text-gray-300 font-medium">Generate Ideas</span>
      </div>

      {/* Header */}
      <div className="mb-2">
        <h1 className="text-lg font-bold text-foreground">Generate Blog Ideas</h1>
        <span className="text-[12px] text-muted-foreground">
          Enter your post content and details to generate blog article ideas
        </span>
      </div>

      {/* Form Container */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Text Area Card */}
          <div className="bg-card rounded-lg overflow-hidden border border-border p-6">
            <FormField
              control={form.control}
              name="postContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Post Content (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the post content you want to create blog ideas from..."
                      className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] min-h-[150px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Grid Section */}
          <div className="bg-card rounded-lg overflow-hidden border border-border p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic *</FormLabel>
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
                    <FormLabel>Company Website *</FormLabel>
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

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform *</FormLabel>
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

              {!providedClientId && (
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client *</FormLabel>
                      <Select
                        onValueChange={value => field.onChange(value === "__none__" ? undefined : value)}
                        value={field.value || "__none__"}
                      >
                        <FormControl>
                          <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">None</SelectItem>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.fullName ||
                                client.companyName ||
                                client.clientName ||
                                `Client ${client.id}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="rounded-[12px] dark:bg-[#0F1B29] bg-[#F3F5F7] text-black dark:text-white border-border"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-[12px] dark:bg-[#0F1B29] bg-[#F3F5F7] text-black dark:text-white border-border"
            >
              Advanced Options
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#3072C0] hover:bg-[#184a86] text-white rounded-[12px]"
            >
              {isLoading ? "Generating..." : "Generate Content Ideas"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
