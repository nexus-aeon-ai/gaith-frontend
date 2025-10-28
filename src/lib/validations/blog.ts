import { z } from "zod";

export const createBlogSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content must be less than 500 characters"),

  contentType: z.enum(["Text", "Image", "Video", "Audio", "File", "Link"]),
  toneStyle: z.enum(["Formal", "Casual", "Friendly"]),
  wordCount: z.enum(["0-100", "100-500", "500-1000", "1000+"]),
});

// Type inference from schema
export type CreateBlogFormData = z.infer<typeof createBlogSchema>;

// Partial schema for updates (all fields optional)
export const updateBlogSchema = createBlogSchema.partial();

// Type for update operations
export type UpdateBlogFormData = z.infer<typeof updateBlogSchema>;

// Validation helper functions
export const validateBlogForm = (data: unknown) => {
  return createBlogSchema.safeParse(data);
};

export const validateBlogUpdate = (data: unknown) => {
  return updateBlogSchema.safeParse(data);
};
