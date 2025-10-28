"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import BlogAdvancedOptions from "@/components/sheet/BlogAdvancedOptions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DashboardListIcon } from "@/components/ui/icons/dashboard-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CreateBlogFormData, createBlogSchema } from "@/lib/validations/blog";

const defaultFormData: CreateBlogFormData = {
  content: "",
  contentType: "Text",
  toneStyle: "Formal",
  wordCount: "0-100",
};

const BulkPostSchedule = () => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const form = useForm<CreateBlogFormData>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: defaultFormData,
    mode: "onChange",
  });

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
            <BreadcrumbPage>Bulk Post Scheduling</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Bulk Post Scheduling</h1>
          <p className="text-muted-foreground">
            Upload and schedule multiple social media posts at once to save time and improve
            efficiency.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form id="lead-form" className="w-full mx-auto space-y-4">
          <Card className="pt-3 rounded-[16px] shadow-none">
            <CardHeader className="px-3">
              <CardTitle className="text-md font-medium">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>What would you like to write about?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter post content"
                          className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Text">Text</SelectItem>
                            <SelectItem value="Video">Video</SelectItem>
                            <SelectItem value="Image">Image</SelectItem>
                            <SelectItem value="Audio">Audio</SelectItem>
                            <SelectItem value="File">File</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="toneStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone Style</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Formal">Formal</SelectItem>
                            <SelectItem value="Casual">Casual</SelectItem>
                            <SelectItem value="Friendly">Friendly</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="wordCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Word Count</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select word count" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-100">0-100</SelectItem>
                            <SelectItem value="100-500">100-500</SelectItem>
                            <SelectItem value="500-1000">500-1000</SelectItem>
                            <SelectItem value="1000+">1000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-end gap-2">
            <Button
              className={cn(
                "flex items-center gap-1 sm:gap-2 bg-transparent hover:bg-transparent",
                "border border-[#3072C0] rounded-[16px] w-full sm:w-auto",
                "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12",
                "hover:border-blue-700 text-blue-700",
                "text-xs sm:text-sm lg:text-base",
              )}
              onClick={() => setShowAdvancedOptions(true)}
              type="button"
            >
              <span className="hidden sm:inline">Advanced Options</span>
              <span className="sm:hidden">Advanced</span>
            </Button>
            <Button
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-[#3072C0] rounded-[16px] w-full sm:w-auto",
                "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12",
                "hover:bg-blue-700 text-white",
                "text-xs sm:text-sm lg:text-base",
              )}
              type="button"
            >
              <span className="hidden sm:inline">Generate Content Ideas</span>
              <span className="sm:hidden">Generate</span>
            </Button>
          </div>
        </form>
      </Form>
      <BlogAdvancedOptions open={showAdvancedOptions} onOpenChange={setShowAdvancedOptions} />
    </div>
  );
};

export default BulkPostSchedule;
