"use client";
import { format } from "date-fns";
import {
  CircleCheck,
  CirclePlay,
  CirclePlus,
  CircleX,
  EllipsisVertical,
  Search,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
import LeftArrow from "@/components/ui/icons/left-arrow";
import EditIcon from "@/components/ui/icons/options/edit-icon";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import FilterIcon from "@/components/ui/icons/options/filter-icon";
import MenuIcon from "@/components/ui/icons/options/menu-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import ViewIcon from "@/components/ui/icons/options/view-icon";
import RightArrow from "@/components/ui/icons/right-arrow";
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
import { ApiCampaign, deleteCampaign, getCampaigns } from "@/lib/api/campaign/campaign";
import { useCampaignLookups } from "@/lib/api/campaign/campaign-lookups";
import { cn } from "@/lib/utils";

import ViewCampaignDetails from "./ViewCampaignDetails";

const CampaignSubPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [campaignFilters, setCampaignFilters] = useState<{
    campaignTypeId?: string;
    statusTypeId?: string;
    platformTypeIds?: string[];
    minBudget?: number;
    maxBudget?: number;
    startFrom?: string;
    startTo?: string;
  } | null>(null);
  const [showNewCampaignForm, setShowNewCampaignForm] = useState(false);
  const [showEditCampaignForm, setShowEditCampaignForm] = useState(false);
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<ApiCampaign[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const { ageRangeTypes, isLoading } = useCampaignLookups();

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedCampaigns, setSortedCampaigns] = useState(campaigns);

  const handleSortByName = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    const sorted = [...sortedCampaigns].sort((a, b) => {
      const nameA = a?.name.toLowerCase();
      const nameB = b?.name.toLowerCase();
      if (newOrder === "asc") return nameA.localeCompare(nameB);
      else return nameB.localeCompare(nameA);
    });

    setSortedCampaigns(sorted);
  };

  const itemsPerPage = 5;
  const { theme: themNext } = useTheme();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await getCampaigns(currentPage, itemsPerPage, campaignFilters || undefined);
        if (response.data) {
          setCampaigns(response.data.items || []);
          setSortedCampaigns(response.data.items || []);
          setTotalItems(response.data.total);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
      }
    };

    fetchCampaigns();
  }, [currentPage, campaignFilters]);

  // Handle filters applied from the filter sheet
  const handleApplyCampaignFilters = (filters: {
    campaignTypeId?: string;
    statusTypeId?: string;
    platformTypeIds?: string[];
    minBudget?: number;
    maxBudget?: number;
    startFrom?: string;
    startTo?: string;
  }) => {
    setCampaignFilters(filters);
    // reset to first page when filters change
    setCurrentPage(1);
  };

  const handleSelectCampaign = (campaignId: string, checked: boolean) => {
    setSelectedCampaigns(prev =>
      checked ? [...prev, campaignId] : prev.filter(id => id !== campaignId),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCampaigns(campaigns.map(c => c.id));
    } else {
      setSelectedCampaigns([]);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!id) return;

    try {
      const resp = await deleteCampaign(id);
      if (resp && resp.status >= 200 && resp.status < 300) {
        // refetch current page to keep pagination consistent
        try {
          const listResp = await getCampaigns(currentPage, itemsPerPage);
          if (listResp.data) {
            setCampaigns(listResp.data.items);
            setTotalItems(listResp.data.total);
            setTotalPages(listResp.data.totalPages);
          }
        } catch (err) {
          console.error("Error refetching campaigns after delete:", err);
          // fallback: remove locally
          setCampaigns(prev => prev.filter(c => c.id !== id));
          setTotalItems(prev => Math.max(0, prev - 1));
        }

        // cleanup selection state
        setSelectedCampaigns(prev => prev.filter(cid => cid !== id));
      } else {
        console.error("Failed to delete campaign", resp);
        alert("Failed to delete campaign. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      alert("Error deleting campaign. Please try again.");
    }
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

  const calculateDuration = (startAt: string, endAt: string) => {
    const start = new Date(startAt);
    const end = new Date(endAt);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return {
      mainDuration: format(start, "MMM d") + " - " + format(end, "MMM d, yyyy"),
      noOfDays: `${days} days`,
    };
  };

  const getAudienceInfo = (campaign: ApiCampaign) => {
    const campaignAgeRanges = campaign.ageRanges || [];
    const campaignAgeRangeTypeIds = campaignAgeRanges.map(ar => ar.ageRangeTypeId);
    const matchingAgeRanges = ageRangeTypes.filter(art => campaignAgeRangeTypeIds.includes(art.id));

    return {
      group: campaign.genderType?.name,
      location: (campaign.countries || []).map(c => c.countryType?.name).join(", "),
      ageGroups: matchingAgeRanges.map(ar => ar.displayName),
    };
  };

  if (showCampaignDetails) {
    return (
      <ViewCampaignDetails
        campaignId={selectedCampaignId as string}
        closeViewDetails={() => setShowCampaignDetails(false)}
      />
    );
  }
  if (isLoading) return <div>Loading...</div>;

  if (showNewCampaignForm) {
    return <CampaignSubmittedForm mode="create" setCampaignOpen={setShowNewCampaignForm} />;
  }

  if (showEditCampaignForm) {
    return (
      <CampaignSubmittedForm
        mode="edit"
        setCampaignOpen={setShowEditCampaignForm}
        campaignId={selectedCampaignId as string}
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
          disabled
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
            "flex flex-col lg:flex-row items-start lg:items-center justify-between ",
            "gap-2 sm:gap-3 ",
          )}
        >
          <div className="bg-[#F3F5F7] border border-[#DCE0E4] dark:border-[#404663] py-2 rounded-[12px] dark:bg-[#0F1B29] px-4 flex justify-center items-center">
            <Search />
            <Input
              placeholder="Search campaigns"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border-none shadow-none focus:outline-none h-12 xl:min-w-[350px] md:min-w-[250px] min-w-[100px]"
            />
          </div>
          <div className="flex gap-1 sm:gap-2 md:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 ",
                    "bg-card border-border text-xs h-auto",
                    "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                    "hover:bg-card hover:border-blue-500 rounded-[16px]",
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
                "flex items-center gap-1 sm:gap-2 ",
                "bg-card border-border text-xs h-auto",
                "[&_svg]:!w-5 [&_svg]:!h-5 sm:[&_svg]:!w-5 sm:[&_svg]:!h-5",
                "hover:bg-card hover:border-blue-500 rounded-[16px] ",
              )}
              onClick={() => setIsFilterSheetOpen(true)}
            >
              <FilterIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
              <span className="hidden sm:inline dark:text-white text-gray-900">Filter</span>
            </Button>

            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2 ",
                "bg-card border-border text-xs h-auto",
                "hover:bg-card hover:border-blue-500 rounded-[16px] py-[16px]",
              )}
            >
              <ExcelIcon />
              <span className="hidden sm:inline dark:text-white text-gray-900">Export Excel</span>
              <span className="sm:hidden dark:text-white text-gray-900">Excel</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1 sm:gap-2 ",
                "bg-card border-border text-xs h-auto",
                "hover:bg-card hover:border-blue-500 rounded-[16px]",
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
                  checked={(campaigns?.length ?? 0) > 0 && selectedCampaigns.length === campaigns.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead
                className="text-sm font-semibold text-[#303444] dark:text-[#CCCFDB] cursor-pointer select-none"
                onClick={handleSortByName}
              >
                <div className="flex items-center gap-1">
                  Campaign Name
                  {sortOrder === "asc" ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-sm font-semibold text-[#303444] dark:text-[#CCCFDB]">
                Type
              </TableHead>
              <TableHead className="text-sm font-semibold text-[#303444] dark:text-[#CCCFDB]">
                Target Audience
              </TableHead>
              <TableHead className="text-sm font-semibold text-[#303444] dark:text-[#CCCFDB] text-center">
                Budget
              </TableHead>
              <TableHead className="text-sm font-semibold text-[#303444] dark:text-[#CCCFDB] text-center">
                Duration
              </TableHead>
              <TableHead className="text-sm font-semibold text-[#303444] dark:text-[#CCCFDB] text-center">
                Platforms
              </TableHead>
              <TableHead className="text-sm font-semibold text-[#303444] dark:text-[#CCCFDB] text-center">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#303444] dark:text-[#CCCFDB] text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedCampaigns.map(campaign => {
              const duration = calculateDuration(campaign.startAt, campaign.endAt);
              const audience = getAudienceInfo(campaign);
              console.log("audience:", audience);
              return (
                <TableRow
                  key={campaign.id}
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
                        {campaign?.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Submitted {format(new Date(campaign.createdAt), "MMM d, yyyy")}
                      </div>
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell className="text-sm text-gray-900 dark:text-white whitespace-nowrap">
                    {campaign.campaignType?.name}
                  </TableCell>

                  {/* Target Audience */}
                  <TableCell className="min-w-[180px]">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {audience.ageGroups[0] ? "Adults " + audience.ageGroups[0] : "Nil"}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="text-xs text-[#687192]  dark:text-[#CACCD6]">
                          {audience.location}
                        </div>
                        <div className="text-xs text-[#687192]  dark:text-[#CACCD6]">
                          • {audience.group}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Budget */}
                  <TableCell className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${campaign.totalBudget}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ${campaign.dailySpendLimit}/day
                    </div>
                  </TableCell>

                  {/* Duration */}
                  <TableCell className="text-start">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {duration.mainDuration}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {duration.noOfDays}
                    </div>
                  </TableCell>

                  {/* Platforms */}
                  <TableCell className="text-center shrink-0">
                    <div className="flex justify-center items-center gap-2">
                      {(campaign.platforms || []).map((platform, idx) => (
                        <div
                          key={idx}
                          className="transition-colors"
                          title={platform.platformType?.name}
                        >
                          {getPlatformIcon(platform.platformType?.name)}
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        "inline-flex capitalize px-3 py-1 min-w-[80px] justify-center text-xs font-semibold rounded-sm",
                        !campaign.isLaunched
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
                      )}
                    >
                      {!campaign.isLaunched ? "Draft" : "Launched"}
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
                            setSelectedCampaignId(campaign.id);
                            setShowCampaignDetails(true);
                          }}
                        >
                          <ViewIcon color={themNext === "dark" ? "#CCCFDB" : "#303444"} />
                          <span className="ml-2 text-sm dark:text-white text-gray-900">
                            View Details
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled
                          onClick={() => {
                            setSelectedCampaignId(campaign.id);
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
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                        >
                          <Trash2 color="#EA3B1F" />
                          <span className="ml-2 text-sm text-[#EA3B1F]">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="p-4 mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left side - Page info */}
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Page {currentPage} of {totalPages} ({totalItems} total campaigns)
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
              <LeftArrow size={28} color={currentPage === 1 ? "gray" : "#3072C0"} />
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
              <RightArrow size={32} color={currentPage === totalPages ? "gray" : "#3072C0"} />
            </Button>
          </div>
        </div>
      </div>
      <CampaignFilterSheet
        open={isFilterSheetOpen}
        onOpenChange={setIsFilterSheetOpen}
        onApplyFilters={handleApplyCampaignFilters}
      />
    </div>
  );
};

export default CampaignSubPage;
