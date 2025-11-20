"use client";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFaqs } from "@/lib/api/support/faqs";
import { cn } from "@/lib/utils";

const FAQ = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState(searchParams.get("searchTerm") || "");

  // Build filter params from URL
  const filterParams = useMemo(() => {
    return {
      searchTerm: searchParams.get("searchTerm") || undefined,
      skip: parseInt(searchParams.get("skip") || "0", 10),
      take: parseInt(searchParams.get("take") || "100", 10),
      orderBy: searchParams.get("orderBy") || "createdAt",
      orderDirection: (searchParams.get("orderDirection") as "asc" | "desc") || "desc",
    };
  }, [searchParams]);

  // Fetch FAQs with React Query
  const {
    data: faqsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["faqs", filterParams],
    queryFn: async () => {
      const response = await getFaqs(filterParams);
      return response.data;
    },
  });

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("searchTerm", value);
    } else {
      params.delete("searchTerm");
    }
    params.set("skip", "0"); // Reset pagination
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  // Group FAQs by category (you can customize this logic)
  const groupedFaqs = useMemo(() => {
    const faqs = faqsData?.data || [];
    
    // For now, we'll create simple categories based on keywords in titles
    const groups: Record<string, typeof faqs> = {
      "General Questions": [],
      "Technical Issues": [],
      "Account Management": [],
    };

    faqs.forEach((faq) => {
      const title = faq.title.toLowerCase();
      if (title.includes("account") || title.includes("password") || title.includes("login")) {
        groups["Account Management"].push(faq);
      } else if (
        title.includes("technical") ||
        title.includes("error") ||
        title.includes("bug") ||
        title.includes("issue")
      ) {
        groups["Technical Issues"].push(faq);
      } else {
        groups["General Questions"].push(faq);
      }
    });

    // Remove empty groups
    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [faqsData]);

  const totalFaqs = faqsData?.total || 0;

  return (
    <div className={cn("min-h-screen w-full p-2 sm:p-3 md:p-4 lg:p-6")}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">FAQ</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Get help, submit tickets, and access support resources
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-8">
        <div className="flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 h-12 rounded-xl bg-card"
            />
          </div>
          <Button
            type="submit"
            className="h-10 px-6 rounded-xl bg-[#508CD3] hover:bg-blue-600"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading FAQs...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400">
            Error loading FAQs. Please try again.
          </div>
        </div>
      )}

      {/* FAQs Content */}
      {!isLoading && !error && (
        <>
          {groupedFaqs.length === 0 ? (
            <div className="bg-card rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No FAQs found. {searchInput && "Try a different search term."}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {groupedFaqs.map(([category, faqs]) => (
                <div key={category} className="bg-background rounded-[16px] p-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {category}
                  </h2>
                  <div className="bg-card rounded-lg shadow-sm px-3 border border-gray-200 dark:border-gray-700">
                    <Accordion type="single" collapsible className="w-full">
                      {faqs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {faq.title}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-gray-600 dark:text-gray-400">
                            {faq.description}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Count */}
          {totalFaqs > 0 && (
            <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
              Showing {faqsData?.data.length || 0} of {totalFaqs} FAQs
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FAQ;

