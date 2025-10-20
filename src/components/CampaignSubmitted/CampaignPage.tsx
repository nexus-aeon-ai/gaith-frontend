"use client";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CirclePlay,
  CirclePlus,
  CircleX,
  EllipsisVertical,
  Search,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { CampaignSubmittedForm } from "@/components/CampaignSubmitted/Campaign/Campaign";
import CampaignFilterSheet from "@/components/sheet/Campaign/CampaignFilter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditIcon from "@/components/ui/icons/options/edit-icon";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import FilterIcon from "@/components/ui/icons/options/filter-icon";
import MenuIcon from "@/components/ui/icons/options/menu-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import ViewIcon from "@/components/ui/icons/options/view-icon";
import FbIcon from "@/components/ui/icons/social/fb";
import GoogleIcon from "@/components/ui/icons/social/google";
import IgIcon from "@/components/ui/icons/social/instagram";
import LkIcon from "@/components/ui/icons/social/linkedin";
import TwIcon from "@/components/ui/icons/social/twitterx";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockCampaigns } from "@/lib/mockdata";
import { cn } from "@/lib/utils";

import ViewCampaignDetails from "./ViewCampaignDetails";

const CampaignSubPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [showNewCampaignForm, setShowNewCampaignForm] = useState(false);
  const [showEditCampaignForm, setShowEditCampaignForm] = useState(false);

  const [showCampaignDetails, setShowCampaignDetails] = useState(false);

  const itemsPerPage = 5;
  const { theme: themNext } = useTheme();

  const handleSelectCampaign = (campaignId: string, checked: boolean) => {
    setSelectedCampaigns(prev =>
      checked ? [...prev, campaignId] : prev.filter(id => id !== campaignId),
    );
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all campaign IDs from current page
      setSelectedCampaigns(currentCampaigns.map(c => c.id));
    } else {
      // Clear all selections
      setSelectedCampaigns([]);
    }
  };

  const filteredCampaigns = mockCampaigns.filter(c =>
    c.campaign.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCampaigns = filteredCampaigns.slice(startIndex, endIndex);

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

  if (showCampaignDetails) {
    return <ViewCampaignDetails closeViewDetails={() => setShowCampaignDetails(false)} />;
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <FbIcon />;
      case "instagram":
        return <IgIcon />;
      case "twitter":
        return <TwIcon />;
      case "linkedin":
        return <LkIcon />;
      case "google":
        return <GoogleIcon />;
      default:
        return null;
    }
  };

  if (showNewCampaignForm) {
    return <CampaignSubmittedForm mode="create" setCampaignOpen={setShowNewCampaignForm} />;
  }
  if (showEditCampaignForm) {
    return <CampaignSubmittedForm mode="edit" setCampaignOpen={setShowEditCampaignForm} />;
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
            Submitted Campaigns
          </h1>
          <p className={cn("text-xs sm:text-sm", "text-gray-600 dark:text-gray-300")}>
            View and manage all submitted campaign proposals and their current status in the
            approval workflow
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
          onClick={() => setShowNewCampaignForm(true)}
        >
          <CirclePlus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Create New Campaign</span>
          <span className="sm:hidden">Create Campaign</span>
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
              placeholder="Search campaigns"
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
                <DropdownMenuItem>
                  <CircleCheck color="#2BAE82" />
                  <span className="hidden sm:inline dark:text-white text-gray-900">
                    Bulk Approve
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CircleX color="#EA3B1F" />
                  <span className="hidden sm:inline dark:text-white text-gray-900">
                    Bulk Reject
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CirclePlay color="#853AA6" />
                  <span className="hidden sm:inline dark:text-white text-gray-900">
                    Bulk Launch
                  </span>
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
                    selectedCampaigns.length === currentCampaigns.length &&
                    currentCampaigns.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold">Campaign Name</TableHead>
              <TableHead className="text-xs font-semibold">Type</TableHead>
              <TableHead className="text-xs font-semibold">Target Audience</TableHead>
              <TableHead className="text-xs font-semibold text-center">Budget</TableHead>
              <TableHead className="text-xs font-semibold text-center">Duration</TableHead>
              <TableHead className="text-xs font-semibold text-center">Platforms</TableHead>
              <TableHead className="text-xs font-semibold text-center">Status</TableHead>
              <TableHead className="text-xs font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentCampaigns.map((campaign, index) => (
              <TableRow
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {/* Checkbox */}
                <TableCell className="px-4 py-3">
                  <Checkbox
                    className="!rounded-[8px]"
                    checked={selectedCampaigns.includes(campaign.id)}
                    onCheckedChange={checked =>
                      handleSelectCampaign(campaign.id, checked as boolean)
                    }
                  />
                </TableCell>
                {/* Campaign Name */}
                <TableCell className="min-w-[200px]">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.campaign.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {campaign.campaign.submittedDate}
                    </div>
                  </div>
                </TableCell>

                {/* Type */}
                <TableCell className="text-sm text-gray-900 dark:text-white whitespace-nowrap">
                  {campaign.type}
                </TableCell>

                {/* Target Audience */}
                <TableCell className="min-w-[180px]">
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {campaign.targetAudience.group}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {campaign.targetAudience.location}
                    </div>
                  </div>
                </TableCell>

                {/* Budget */}
                <TableCell className="text-center">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {campaign.budget.totalBudget}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {campaign.budget.perDayBudget}/day
                  </div>
                </TableCell>

                {/* Duration */}
                <TableCell className="text-center">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {campaign.duration.mainDuration}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {campaign.duration.noOfDays}
                  </div>
                </TableCell>

                {/* Platforms */}
                <TableCell className="text-center">
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    {campaign.platforms.map((platform, idx) => (
                      <div key={idx} className="transition-colors" title={platform}>
                        {getPlatformIcon(platform)}
                      </div>
                    ))}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="text-center">
                  <span
                    className={cn(
                      "inline-flex px-3 py-1 min-w-[80px] justify-center text-xs font-semibold rounded-sm",
                      campaign.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                        : campaign.status === "active"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                          : campaign.status === "approved"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200"
                            : campaign.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                    )}
                  >
                    {campaign.status}
                  </span>
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
                          setShowCampaignDetails(true);
                        }}
                      >
                        <ViewIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                        <span className="ml-2 text-sm dark:text-white text-gray-900">
                          View Details
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setShowEditCampaignForm(true);
                        }}
                      >
                        <EditIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                        <span className="ml-2 text-sm dark:text-white text-gray-900">Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        <CirclePlay color="#853AA6" />
                        <span className="ml-2 text-sm dark:text-white text-gray-900">Launch</span>
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
            Page {currentPage} of {totalPages} ({filteredCampaigns.length} total quotations)
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
      <CampaignFilterSheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen} />
    </div>
  );
};

export default CampaignSubPage;
