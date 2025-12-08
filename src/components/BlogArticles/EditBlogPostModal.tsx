"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";

const blogPostFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  keywords: z.array(z.string().min(1, "Keyword cannot be empty")).min(1, "At least one keyword is required"),
  reference_links: z.array(z.string().url("Please enter a valid URL")).optional(),
});

export type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

interface EditBlogPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BlogPostFormData) => void;
  initialData?: BlogPostFormData;
  isSubmitting?: boolean;
}

export default function EditBlogPostModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
}: EditBlogPostModalProps) {
  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      keywords: initialData?.keywords || [""],
      reference_links: initialData?.reference_links || [""],
    },
  });

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        title: initialData?.title || "",
        content: initialData?.content || "",
        keywords: initialData?.keywords && initialData.keywords.length > 0 ? initialData.keywords : [""],
        reference_links: initialData?.reference_links && initialData.reference_links.length > 0 ? initialData.reference_links : [""],
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (data: BlogPostFormData) => {
    // Filter out empty strings from arrays
    const filteredData = {
      ...data,
      keywords: data.keywords.filter((k) => k.trim() !== ""),
      reference_links: data.reference_links?.filter((l) => l.trim() !== "") || [],
    };
    onSubmit(filteredData);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] dark:bg-[#212945] w-full bg-card font-inter rounded-[16px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? "Edit Blog Post" : "Create Blog Post"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the blog post details below." : "Fill in the details to create a new blog post."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter blog post title"
                      className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter blog post content"
                      className="min-h-[200px] resize-none dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Keywords - Array field with Controller */}
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <Controller
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <div className="space-y-2">
                    {(field.value || []).map((keyword, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Keyword ${index + 1}`}
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                          value={keyword}
                          onChange={(e) => {
                            const newKeywords = [...(field.value || [])];
                            newKeywords[index] = e.target.value;
                            field.onChange(newKeywords);
                          }}
                        />
                        {(field.value || []).length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newKeywords = (field.value || []).filter((_, i) => i !== index);
                              field.onChange(newKeywords.length > 0 ? newKeywords : [""]);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        field.onChange([...(field.value || []), ""]);
                      }}
                      className="mt-2"
                    >
                      Add Keyword
                    </Button>
                    {form.formState.errors.keywords && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.keywords.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </FormItem>

            {/* Reference Links - Array field with Controller */}
            <FormItem>
              <FormLabel>Reference Links (Optional)</FormLabel>
              <Controller
                control={form.control}
                name="reference_links"
                render={({ field }) => (
                  <div className="space-y-2">
                    {field.value?.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Reference link ${index + 1}`}
                          type="url"
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                          value={link}
                          onChange={(e) => {
                            const newLinks = [...(field.value || [])];
                            newLinks[index] = e.target.value;
                            field.onChange(newLinks);
                          }}
                        />
                        {(field.value?.length || 0) > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newLinks = field.value?.filter((_, i) => i !== index) || [];
                              field.onChange(newLinks.length > 0 ? newLinks : [""]);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        field.onChange([...(field.value || []), ""]);
                      }}
                      className="mt-2"
                    >
                      Add Reference Link
                    </Button>
                    {form.formState.errors.reference_links && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.reference_links.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </FormItem>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded-[12px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#3072C0] hover:bg-[#184a86] text-white rounded-[12px]"
              >
                {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

