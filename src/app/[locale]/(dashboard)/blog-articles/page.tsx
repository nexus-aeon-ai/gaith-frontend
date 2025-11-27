import React from "react";

import BlogArticlesPage from "@/components/BlogArticles/BlogArticlesPage";
import { getBlogs, type BlogPostListItem } from "@/lib/api/reports";

export default async function BlogArticlesServerPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  let initialArticles: BlogPostListItem[] = [];
  let pagination = {
    count: 0,
    num_pages: 1,
    current_page: 1,
    has_next: false,
    has_previous: false,
    next_page: null as number | null,
    previous_page: null as number | null,
  };

  try {
    const response = await getBlogs(page);
    if (response.status === 200 && response.data?.details?.message) {
      const message = response.data.details.message;
      initialArticles = message.results || [];
      pagination = {
        count: message.count || 0,
        num_pages: message.num_pages || 1,
        current_page: message.current_page || 1,
        has_next: message.has_next || false,
        has_previous: message.has_previous || false,
        next_page: message.next_page ?? null,
        previous_page: message.previous_page ?? null,
      };
    }
  } catch (error) {
    console.error("Error fetching blog articles:", error);
  }

  return <BlogArticlesPage initialArticles={initialArticles} pagination={pagination} />;
} 