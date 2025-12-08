"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, CirclePlus, EllipsisVertical, Search } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState } from "react";

import PopupModal from "@/components/PopupModal/PopupModal";
import InvoiceSheet from "@/components/sheet/Quotation/InvoiceSheet";
import QuotationFilterSheet from "@/components/sheet/Quotation/QuotationFilter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FolderIcon from "@/components/ui/icons/folder";
import CopyIcon from "@/components/ui/icons/options/copy-icon";
import DeleteIcon from "@/components/ui/icons/options/delete-icon";
import DeleteIconFilled from "@/components/ui/icons/options/delete-icon-filled";
import EditIcon from "@/components/ui/icons/options/edit-icon";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import FilterIcon from "@/components/ui/icons/options/filter-icon";
import InvoiceIcon from "@/components/ui/icons/options/invoice-icon";
import MenuIcon from "@/components/ui/icons/options/menu-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import SendIcon from "@/components/ui/icons/options/send-icon";
import ViewIcon from "@/components/ui/icons/options/view-icon";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteQuotation,
  getQuotationById,
  getQuotations,
  type BackendQuotationItem,
} from "@/lib/api/quotations";
import { cn } from "@/lib/utils";

import { Quotation } from "../../lib/types";
// import { ConfirmDialog } from "../Popups/PopupModal";
import SendToClientSheet from "../sheet/Quotation/SendToClient";

import EditQuote from "./EditQuote";
import NewQuote from "./NewQuote";
import ViewQuoteDetails from "./ViewQuoteDetails";

const data = {
  title: "Enterprise Software Solution",
  description: "Complete software development and implementation package",
  status: "Pending Approval",
  services: [
    { name: "Digital Marketing Strategy", price: 2500 },
    { name: "Social Media Management", price: 2500 },
    { name: "SEO Optimization", price: 2500 },
    { name: "One-Time Setup Fee", price: 2500 },
    { name: "Digital Marketing Strategy", price: 2500 },
    { name: "Social Media Management", price: 2500 },
    { name: "SEO Optimization", price: 2500 },
    { name: "One-Time Setup Fee", price: 500 },
    { name: "Digital Marketing Strategy", price: 2500 },
    { name: "Social Media Management", price: 2500 },
    { name: "SEO Optimization", price: 2500 },
    { name: "One-Time Setup Fee", price: 2500 },
    { name: "Digital Marketing Strategy", price: 2500 },
    { name: "Social Media Management", price: 2500 },
    { name: "SEO Optimization", price: 2500 },
    { name: "One-Time Setup Fee", price: 500 },
  ],
  setupFee: 0,
  customer: {
    name: "TechCorp Solutions",
    subtitle: "Technology Company",
    email: "tech@techcorp.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, Silicon Valley",
  },
  details: {
    number: "QUO-2024-001",
    createdDate: "December 15, 2024",
    currency: "USD",
    createdBy: "Sales Manager",
  },
  terms: ["Payment terms: 50% upfront, 50% upon completion"],
  notes:
    "This quotation includes comprehensive software development with modern technologies and best practices. Regular progress updates will be provided throughout the project. The solution will be scalable and maintainable for future enhancements.",
  currencyCode: "USD",
};

const QuotesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotationFilters, setQuotationFilters] = useState<{
    startDate?: string;
    endDate?: string;
    status?: string | string[];
    minAmount?: number;
    maxAmount?: number;
  }>({});
  const {
    data: quotationsResponse,
    isLoading,
    isError,
  } = useQuery<
    {
      status: number;
      data: { results: Quotation[]; count: number };
    },
    Error
  >({
    queryKey: ["quotations", quotationFilters],
    queryFn: async () => getQuotations({
      startDate: quotationFilters.startDate,
      endDate: quotationFilters.endDate,
      status: quotationFilters.status,
      minAmount: quotationFilters.minAmount,
      maxAmount: quotationFilters.maxAmount,
    }),
    initialData: { status: 200, data: { results: [], count: 0 } },
  });
  const quotations: Quotation[] = quotationsResponse?.data.results || [];
  const [quoteToEdit, setQuoteToEdit] = useState<Quotation | null>(null);
  const [selectedQuotations, setSelectedQuotations] = useState<string[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [showNewLeadForm, setShowNewQuoteForm] = useState(false);
  const [showEditQuoteForm, setShowEditQuoteForm] = useState(false);
  const [isInvoiceSheetOpen, setIsInvoiceSheetOpen] = useState(false);
  const [showSendToClientSheet, setShowSendToClientSheet] = useState(false);
  const [showQuoteDetails, setShowQuoteDetails] = useState(false);
  // const [showDeleteAllPopup, setShowDeleteAllPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // const [showSendInvoicePopup, setShowSendInvoicePopup] = useState(false);

  // fetch single quotation when user opens view details
  const { data: fetchedQuotationResp } = useQuery<BackendQuotationItem | null>({
    queryKey: ["quotation", selectedQuoteId],
    queryFn: async () => {
      if (!selectedQuoteId) return null;
      const resp = await getQuotationById(selectedQuoteId);
      return resp.data;
    },
    enabled: !!selectedQuoteId && showQuoteDetails,
  });

  const itemsPerPage = 5;
  const { theme: themNext } = useTheme();
  const queryClient = useQueryClient();

  const { mutate: deleteQuotationMutate } = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteQuotation(id);
      return res.status;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
  });

  const handleSelectQuotation = (quotationId: string, checked: boolean) => {
    setSelectedQuotations(prev =>
      checked ? [...prev, quotationId] : prev.filter(id => id !== quotationId),
    );
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all quotation IDs
      setSelectedQuotations(currentQuotations.map(q => q.quotationNumber));
    } else {
      // Clear all selections
      setSelectedQuotations([]);
    }
  };

  const filteredQuotations = quotations.filter(
    q =>
      q.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuotations = filteredQuotations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "min-h-fit w-full p-2 mt-4 rounded-[12px] sm:p-3 md:p-4 lg:p-6 pb-0 sm:pb-0",
          "bg-backgrournd mb-3 overflow-x-hidden",
        )}
      >
        Loading quotations...
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          "min-h-fit w-full p-2 mt-4 rounded-[12px] sm:p-3 md:p-4 lg:p-6 pb-0 sm:pb-0",
          "bg-backgrournd mb-3 overflow-x-hidden",
        )}
      >
        Failed to load quotations.
      </div>
    );
  }

  if (showNewLeadForm) {
    return <NewQuote closeNewQuoteForm={() => setShowNewQuoteForm(false)} />;
  }

  if (showEditQuoteForm) {
    return (
      <EditQuote quotation={quoteToEdit} closeEditQuoteForm={() => setShowEditQuoteForm(false)} />
    );
  }
  if (showQuoteDetails) {
    // transform backend item into the shape expected by ViewQuoteDetails
    const transformToViewData = (item: BackendQuotationItem) => {
      const services = (item.pricingItems || []).map(p => {
        const name = p.serviceDescription || p.serviceId || "Service";
        const price = p.servicePrice ?? 0;
        const quantity = p.quantity ?? 1;
        const taxPercentage = p.taxPercentage ?? 0;
        return { name, price, quantity, taxPercentage };
      });

      const terms = item.termsAndConditions
        ? item.termsAndConditions.split(/\.\s*/).filter((t: string) => t.trim().length > 0)
        : [];

      const details = {
        number: item.quotationNumber || item.id,
        createdDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
        currency: item.currencyId || "",
        createdBy: item.createdBy || "",
      };

      return {
        title: item.title || "",
        description: item.description || "",
        status: item.isDeleted ? "rejected" : item.isActive ? "pending" : "draft",
        services,
        setupFee: 0,
        customer: {
          name: item.title || "",
          subtitle: "",
          avatarUrl: "/images/girl-avatar.jpg",
          email: "-",
          phone: "",
          address: "",
        },
        details,
        terms,
        notes: item.notes || "",
        currencyCode: item.currencyId || "USD",
      };
    };

    const viewData = fetchedQuotationResp ? transformToViewData(fetchedQuotationResp) : data;

    return (
      <ViewQuoteDetails
        data={viewData}
        closeViewDetails={() => {
          setShowQuoteDetails(false);
          setSelectedQuoteId(null);
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        "min-h-fit w-full p-2 mt-4 rounded-[12px] sm:p-3 md:p-4 lg:p-6 pb-0 sm:pb-0",
        "bg-backgrournd mb-3 overflow-x-hidden",
      )}
    >
      {/* Title Section */}
      <div
        className={cn(
          "flex flex-col sm:flex-row justify-between items-start",
          "gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6",
        )}
      >
        <div className="flex-1 min-w-0">
          <h1
            className={cn(
              "text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold",
              "text-gray-900 dark:text-white mb-1 sm:mb-2 truncate",
            )}
          >
            Quotations Management
          </h1>
          <p className={cn("text-xs sm:text-sm", "text-gray-600 dark:text-gray-300")}>
            Create, manage, and track customer quotations
          </p>
        </div>

        <Button
          className={cn(
            "flex items-center gap-1 sm:gap-2",
            "bg-[#3072C0] rounded-[16px] w-full sm:w-auto",
            "px-3 sm:px-4 lg:px-6 h-9 sm:h-10 lg:h-12",
            "hover:bg-blue-700 text-white",
            "text-xs sm:text-sm lg:text-base",
          )}
          onClick={() => setShowNewQuoteForm(true)}
        >
          <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Create New Quotation</span>
          <span className="sm:hidden">Create Quotation</span>
        </Button>
      </div>
      {/* Search and Actions Section */}
      <div
        className={cn(" items-center justify-center bg-card rounded-lg px-3 py-2 mb-3 shadow-sm")}
      >
        <div
          className={cn(
            "flex flex-col md:flex-row items-start md:items-center justify-between ",
            "gap-2 md:gap-3 ",
          )}
        >
          <div className="bg-[#F3F5F7] py-2 w-full lg:max-w-md rounded-[12px] dark:bg-[#0F1B29] px-4 flex justify-center items-center">
            <Search />
            <Input
              placeholder="Search quotations"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border-none shadow-none focus:outline-none h-12 lg:max-w-md w-full"
            />
          </div>
          <div className="flex gap-1 sm:gap-2 md:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1 sm:gap-2",
                    "bg-card border-border text-xs h-8 sm:h-10",
                    "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                    "hover:bg-card hover:border-blue-500",
                  )}
                >
                  <MenuIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  // onClick={() => {
                  //   setShowDeleteAllPopup(true);
                  // }}
                >
                  <DeleteIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                  <span className="hidden sm:inline dark:text-white text-gray-900">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-8 sm:h-10",
                "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                "hover:bg-card hover:border-blue-500",
              )}
              onClick={() => setIsFilterSheetOpen(true)}
            >
              <FilterIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
              <span className="hidden sm:inline dark:text-white text-gray-900">Filter</span>
            </Button>

            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-8 sm:h-10",
                "hover:bg-card hover:border-blue-500",
              )}
            >
              <ExcelIcon />
              <span className="hidden sm:inline dark:text-white text-gray-900">Export Excel</span>
              <span className="sm:hidden dark:text-white text-gray-900">Excel</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                "bg-card border-border text-xs h-8 sm:h-10",
                "hover:bg-card hover:border-blue-500",
              )}
            >
              <PdfIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="hidden sm:inline dark:text-white text-gray-900">Export PDF</span>
              <span className="sm:hidden dark:text-white text-gray-900">PDF</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Table Section */}
      <div className="w-full overflow-auto border border-gray-200 rounded-lg shadow dark:border-gray-800">
        <Table className="bg-card">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-left">
                <Checkbox
                  className="!rounded-[8px]"
                  checked={
                    selectedQuotations.length === currentQuotations.length &&
                    currentQuotations.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#303444] dark:text-[#CCCFDB]">
                Quotation ID
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#303444] dark:text-[#CCCFDB]">
                Customer
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#303444] dark:text-[#CCCFDB] text-center">
                Amount
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#303444] dark:text-[#CCCFDB] text-center">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#303444] dark:text-[#CCCFDB] text-center">
                Created Date
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#303444] dark:text-[#CCCFDB] text-center">
                Valid Until
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#303444] dark:text-[#CCCFDB] text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentQuotations.length === 0 ? (
              <TableRow className="pointer-events-none">
                <TableCell colSpan={8} className="p-0">
                  <div className="min-h-[300px] flex flex-col items-center justify-center">
                    <FolderIcon />
                    <p className="text-muted-foreground text-sm mt-2 font-medium">No Data</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentQuotations.map(quote => (
                <TableRow
                  key={quote.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {/* Checkbox */}
                  <TableCell className="px-4 py-3">
                    <Checkbox
                      className="!rounded-[8px]"
                      checked={selectedQuotations.includes(quote.quotationNumber)}
                      onCheckedChange={checked =>
                        handleSelectQuotation(quote.quotationNumber, checked as boolean)
                      }
                    />
                  </TableCell>

                  {/* Quotation ID */}
                  <TableCell className="text-sm font-medium text-[#3072C0] whitespace-nowrap">
                    {quote.quotationNumber}
                  </TableCell>

                  {/* Customer */}
                  <TableCell className="min-w-[220px]">
                    <div className="flex items-center gap-3">
                      <Image
                        src={quote.customer.avatar}
                        alt={quote.customer.name}
                        width={40}
                        height={40}
                        className="rounded-full shrink-0"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {quote.customer.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {quote.customer.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="text-center text-sm text-gray-900 dark:text-white whitespace-nowrap">
                    ${quote.amount.toLocaleString()}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        "inline-flex px-3 py-1 min-w-[80px] justify-center text-xs font-semibold rounded-sm",
                        quote.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : quote.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : quote.status === "draft"
                              ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                      )}
                    >
                      {quote.status}
                    </span>
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="text-center text-sm text-gray-900 dark:text-white whitespace-nowrap">
                    {quote.createdDate}
                  </TableCell>

                  {/* Valid Until */}
                  <TableCell className="text-center text-sm text-gray-900 dark:text-white">
                    <div>{quote.validUntil.date}</div>
                    <div className="text-xs text-[#2BAE82] ">{quote.validUntil.text}</div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() => {
                            // prefer backend id when available
                            // otherwise fall back to the table's quotationId
                            setSelectedQuoteId(quote.id as string);
                            setShowQuoteDetails(true);
                          }}
                        >
                          <ViewIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                          <span className="ml-2 text-sm dark:text-white text-gray-900">
                            View Details
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setQuoteToEdit(quote);
                            setShowEditQuoteForm(true);
                          }}
                        >
                          <EditIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                          <span className="ml-2 text-sm dark:text-white text-gray-900">Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setShowSendToClientSheet(true);
                          }}
                        >
                          <SendIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                          <span className="ml-2 text-sm dark:text-white text-gray-900">
                            Send To Client
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setIsInvoiceSheetOpen(true);
                          }}
                        >
                          <InvoiceIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                          <span className="ml-2 text-sm dark:text-white text-gray-900">
                            Generate Invoice
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {}}>
                          <CopyIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                          <span className="ml-2 text-sm dark:text-white text-gray-900">Copy</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          //  onClick={() => deleteQuotationMutate(quote.id)}
                          onClick={() => {
                            setSelectedQuoteId(quote.id as string);
                            setShowDeletePopup(true);
                          }}
                        >
                          <DeleteIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                          <span className="ml-2 text-sm dark:text-white text-gray-900">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Section */}
      <div className="p-4 mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left side - Page info */}
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Page {currentPage} of {totalPages} ({filteredQuotations.length} total quotations)
          </div>

          {/* Right side - Pagination controls */}
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "h-8 w-8 p-0",
                "text-gray-500 dark:text-gray-400",
                "hover:text-gray-700 dark:hover:text-gray-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {getVisiblePages().map((page, index) => (
                <Button
                  key={index}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "h-8 w-8 p-0 transition-all duration-200",
                    currentPage === page
                      ? cn(
                        "bg-[#3072C0] text-white border border-[#3072C0]",
                        "hover:bg-blue-700 hover:border-blue-700",
                        "dark:bg-blue-600 dark:border-blue-600",
                        "dark:hover:bg-blue-700 dark:hover:border-blue-700",
                      )
                      : cn(
                        "text-gray-500 dark:text-gray-400",
                        "hover:text-gray-700 dark:hover:text-gray-200",
                      ),
                  )}
                >
                  {page}
                </Button>
              ))}
            </div>

            {/* Next button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                "h-8 w-8 p-0",
                "text-gray-500 dark:text-gray-400",
                "hover:text-gray-700 dark:hover:text-gray-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <QuotationFilterSheet
        open={isFilterSheetOpen}
        onOpenChange={setIsFilterSheetOpen}
        onApplyFilters={filters => {
          // Map payload to API expected param names
          setQuotationFilters({
            startDate: filters.startDate,
            endDate: filters.endDate,
            status: filters.statuses && filters.statuses.length === 1 ? filters.statuses[0] : filters.statuses,
            minAmount: filters.minAmount,
            maxAmount: filters.maxAmount,
          });
        }}
      />
      <InvoiceSheet open={isInvoiceSheetOpen} onOpenChange={setIsInvoiceSheetOpen} />
      <SendToClientSheet open={showSendToClientSheet} onOpenChange={setShowSendToClientSheet} />
      {/* Delete Single Quotation Popup */}
      <PopupModal
        open={showDeletePopup}
        onOpenChange={setShowDeletePopup}
        title="Delete Quotation"
        iconComponent={<DeleteIconFilled width={70} height={70} />}
        description="Are you sure you want to Delete this Quotation? This action cannot be undone."
        cancelButton={{
          label: "Yes, Delete",
          onClick: () => {
            setShowDeletePopup(false);
            deleteQuotationMutate(selectedQuoteId as string);
          },
        }}
        confirmButton={{ label: "No, Keep", onClick: () => setShowDeletePopup(false) }}
      />
      {/* <ConfirmDialog
        open={showDeletePopup}
        onOpenChange={setShowDeletePopup}
        title="Delete Quotation"
        description="Are you sure you want to Delete this Quotation? This action cannot be undone."
        confirmText="No, Keep"
        onCancel={()=>deleteQuotationMutate(selectedQuoteId as string)}
        cancelText="Yes, Delete"
        icon={<DeleteIconFilled width={70} height={70} />}
      /> */}
      {/* Delete all Quotations Popup */}
      {/* <ConfirmDialog
        open={showDeleteQuotePopup}
        onOpenChange={setShowDeleteQuotePopup}
        title="Delete Quotations"
        description="Are you sure you want to Delete ? This action cannot be undone."
        confirmText="No, Keep"
        cancelText="Yes, Cancel"
        icon={<DeleteIconFilled width={70} height={70} />}
      /> */}
    </div>
  );
};

export default QuotesPage;
