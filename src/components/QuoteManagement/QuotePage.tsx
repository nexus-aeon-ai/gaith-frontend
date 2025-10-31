"use client";
import { ChevronLeft, ChevronRight, CirclePlus, EllipsisVertical, Search } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";

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
import { mockQuotations } from "@/lib/mockdata/quotations";
import { cn } from "@/lib/utils";

import { Quotation } from "../../lib/types";
import { ConfirmDialog } from "../Popups/PopupModal1";
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
  terms: [
    "Payment terms: 50% upfront, 50% upon completion",
    "Project timeline: 3–4 months",
    "Includes 6 months of technical support",
    "Additional changes may incur extra charges",
    "All work will be completed according to agreed specifications",
    "Client approval required for major changes",
  ],
  notes:
    "This quotation includes comprehensive software development with modern technologies and best practices. Regular progress updates will be provided throughout the project. The solution will be scalable and maintainable for future enhancements.",
  currencyCode: "USD",
};

const QuotesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quoteToEdit, setQuoteToEdit] = useState<Quotation | null>(null);
  const [selectedQuotations, setSelectedQuotations] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [showNewLeadForm, setShowNewQuoteForm] = useState(false);
  const [showEditQuoteForm, setShowEditQuoteForm] = useState(false);
  const [isInvoiceSheetOpen, setIsInvoiceSheetOpen] = useState(false);
  const [showSendToClientSheet, setShowSendToClientSheet] = useState(false);
  const [showQuoteDetails, setShowQuoteDetails] = useState(false);
  const [showDeleteAllPopup, setShowDeleteAllPopup] = useState(false);

  const itemsPerPage = 5;
  const { theme: themNext } = useTheme();

  const handleSelectQuotation = (quotationId: string, checked: boolean) => {
    setSelectedQuotations(prev =>
      checked ? [...prev, quotationId] : prev.filter(id => id !== quotationId),
    );
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all quotation IDs
      setSelectedQuotations(mockQuotations.map(q => q.quotationId));
    } else {
      // Clear all selections
      setSelectedQuotations([]);
    }
  };

  const filteredQuotations = mockQuotations.filter(
    q =>
      q.quotationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  if (showNewLeadForm) {
    return <NewQuote closeNewQuoteForm={() => setShowNewQuoteForm(false)} />;
  }

  if (showEditQuoteForm) {
    return (
      <EditQuote quotation={quoteToEdit} closeEditQuoteForm={() => setShowEditQuoteForm(false)} />
    );
  }
  if (showQuoteDetails) {
    return <ViewQuoteDetails data={data} closeViewDetails={() => setShowQuoteDetails(false)} />;
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
                  onClick={() => {
                    setShowDeleteAllPopup(true);
                  }}
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
            <TableRow className="text-[#303444] dark:text-[#CCCFDB]">
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
              <TableHead className="text-xs font-semibold">Quotation ID</TableHead>
              <TableHead className="text-xs font-semibold">Customer</TableHead>
              <TableHead className="text-xs font-semibold text-center">Amount</TableHead>
              <TableHead className="text-xs font-semibold text-center">Status</TableHead>
              <TableHead className="text-xs font-semibold text-center">Created Date</TableHead>
              <TableHead className="text-xs font-semibold text-center">Valid Until</TableHead>
              <TableHead className="text-xs font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentQuotations.map((quote, index) => (
              <TableRow
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {/* Checkbox */}
                <TableCell className="px-4 py-3">
                  <Checkbox
                    className="!rounded-[8px]"
                    checked={selectedQuotations.includes(quote.quotationId)}
                    onCheckedChange={checked =>
                      handleSelectQuotation(quote.quotationId, checked as boolean)
                    }
                  />
                </TableCell>

                {/* Quotation ID */}
                <TableCell className="text-sm font-medium text-[#3072C0] whitespace-nowrap">
                  {quote.quotationId}
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
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {quote.validUntil.text}
                  </div>
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
                      <DropdownMenuItem onClick={() => {}}>
                        <DeleteIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                        <span className="ml-2 text-sm dark:text-white text-gray-900">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
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
      <QuotationFilterSheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen} />
      <InvoiceSheet open={isInvoiceSheetOpen} onOpenChange={setIsInvoiceSheetOpen} />
      <SendToClientSheet open={showSendToClientSheet} onOpenChange={setShowSendToClientSheet} />

      {/* Delete Popup */}
      <ConfirmDialog
        open={showDeleteAllPopup}
        onOpenChange={setShowDeleteAllPopup}
        title="Delete Quotations?"
        description="Are you sure you want to Delete Quotations? This action cannot be undone."
        confirmText="No, Keep"
        cancelText="Yes, Cancel"
        icon={<DeleteIconFilled width={70} height={70} />}
      />
    </div>
  );
};

export default QuotesPage;
