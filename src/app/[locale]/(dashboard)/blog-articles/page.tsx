import React from "react";

import BlogArticlesPage from "@/components/BlogArticles/BlogArticlesPage";

// This is a server component that can fetch data
export default async function BlogArticlesServerPage() {
  // TODO: Fetch initial blog articles data from API
  // const response = await getBlogs();
  // const initialArticles = response.data || [];

  return <BlogArticlesPage initialArticles={[]} />;
} 