import React from "react";

import BlogArticlesPage from "@/components/BlogArticles/BlogArticlesPage";
import { getBlogs, BlogPostListItem } from "@/lib/api/reports";

export default async function BlogArticlesServerPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  let initialArticles: BlogPostListItem[] = [];

  try {
    const response = await getBlogs(page);
    if (response.status === 200 && response.data?.details?.message) {
      initialArticles = response.data.details.message;
    }
  } catch (error) {
    console.error("Error fetching blog articles:", error);
  }

  return <BlogArticlesPage initialArticles={initialArticles} />;
} 