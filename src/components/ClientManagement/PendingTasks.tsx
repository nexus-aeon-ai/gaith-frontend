"use client";

import { Clock, Download, Flag, Plus, Target } from "lucide-react";
import Image from "next/image";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import FileIcon from "@/components/ui/icons/file";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import { Client } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckboxSquare } from "../ui/checkbox-square";
import { Separator } from "../ui/separator";

interface ClientDetailsViewProps {
  client: Client;
  onBack: () => void;
}

const attendees = [
  { name: "Alice Johnson", role: "Marketing Manager" },
  { name: "Bob Smith", role: "Sales Manager" },
  { name: "Charlie Davis", role: "Product Manager" },
  { name: "Charlie Davis", role: "Product Manager" },
];

const prepMaterials = [
  {
    title: "Q3 Performance Report",
    size: "2.4 MB",
    updated: "2 hours ago",
    iconColor: "#175E46",
  },
  {
    title: "Campaign Budget Analysis",
    size: "1.8 MB",
    updated: "4 hours ago",
    iconColor: "#EE4F8D",
  },
  {
    title: "Competitor Analysis Summary",
    size: "3.1 MB",
    updated: "1 day ago",
    iconColor: "#853AA6",
  },
];

const PendingTasks = ({ client, onBack }: ClientDetailsViewProps) => {
  return (
    <div
      className={cn(
        "min-h-screen w-full bg-green-300 p-2 sm:p-3 md:p-4 lg:p-6",
        "bg-background overflow-x-hidden",
      )}
    >
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/client-management">Client Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{client.name}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Pending Tasks</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Client Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
          <div className="flex flex-col items-start gap-0">
            <div className="flex gap-2 items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Campaign Strategy Meeting
              </h1>
              <span
                className={cn(
                  "inline-flex px-2 py-1 text-xs font-semibold rounded-sm",
                  client.status === "Inactive"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : client.status === "Active"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                )}
              >
                High Priority
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-muted-foreground">
                2:00 PM - 3:30 PM • Due in 2 hours.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="p-6 px-8 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#ea3b1f] rounded-[16px] bg-transparent"
              onClick={onBack}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="lead-form"
              variant={"outline"}
              className="p-6 px-8 text-[16px] hover:bg-[#3072C0] font-[400] rounded-[16px] border-[#3072C0] text-[#3072C0] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reschedule
            </Button>
            <Button
              type="submit"
              form="lead-form"
              variant={"outline"}
              className="p-6 px-8 text-[16px] bg-[#3072C0] hover:bg-[#3072C0]/80 font-[400] rounded-[16px] border-[#3072C0] text-white  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Lead
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 grid-cols-1 gap-3">
        <div className="lg:col-span-3 col-span-1 space-y-3">
          {/* meeting details  */}
          <Card className="p-2 px-0 rounded-[16px]">
            <CardHeader className="px-3">
              <CardTitle className="border-b text-md font-bold pb-1">Meeting Details</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-md font-bold"> Meeting Agenda</h2>
              <ul className="list-disc list-inside mb-3">
                <li>Review Q3 marketing performance metrics and ROI analysis</li>
                <li>Discuss upcoming holiday campaign strategy and budget allocation</li>
                <li>Present new social media engagement initiatives</li>
                <li>Review competitor analysis and market positioning</li>
                <li>Define action items and next steps for Q4</li>
              </ul>
              <Separator />
              <div className="grid md:grid-cols-2 mt-3 grid-cols-1 gap-2">
                <div>
                  <p className="text-sm font-normal  text-muted-foreground">Meeting Type</p>
                  <p className="text-md font-medium">Internal Strategy Review</p>
                </div>
                <div>
                  <p className="text-sm font-normal  text-muted-foreground">Duration</p>
                  <p className="text-md font-medium">1.5 Hours</p>
                </div>
                <div>
                  <p className="text-sm font-normal  text-muted-foreground">Virtual Meeting Room</p>
                  <p className="text-md font-medium">Internal Strategy Review</p>
                </div>
                <div>
                  <p className="text-sm font-normal  text-muted-foreground">Status</p>
                  <Badge variant={"default"} className="bg-amber-50 rounded-sm text-[#A17607]">
                    Pending
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* attendees */}
          <Card className="p-2 px-0 rounded-[16px]">
            <CardHeader className="px-3">
              <CardTitle className="border-b text-md font-bold pb-1">Meeting Attendees</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4 ">
              {attendees.map((attendee, index) => (
                <div key={index} className="flex flex-col mt-2 items-center mb-3">
                  <Image
                    src={"/images/default-avatar.jpg"}
                    alt={attendee.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <p className="text-md font-medium mt-2">{attendee.name}</p>
                  <p className="text-sm font-normal text-muted-foreground">{attendee.role}</p>
                </div>
              ))}
              <div className="flex flex-col mt-1 items-center mb-3">
                <div className="flex hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-300 items-center mb-2 justify-center rounded-full border-2 border-dashed w-[50px] h-[50px] mt-2">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-md  font-medium">Add</p>
                <p className="text-sm font-normal text-muted-foreground">Participant</p>
              </div>
            </CardContent>
          </Card>
          {/* preparation material details  */}
          <Card className="p-2 px-0 rounded-[16px]">
            <CardHeader className="px-3">
              <CardTitle className="border-b text-md font-bold pb-1">
                Preparation Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3">
              <div className="space-y-2 mt-2">
                {prepMaterials.map((material, index) => (
                  <div
                    key={index}
                    className="bg-[#F3F5F7] dark:bg-[#0F1B29] rounded-lg px-3 p-2 py-3 flex items-center gap-2"
                  >
                    <div
                      className="rounded-full w-8 h-8 flex items-center justify-center"
                      style={{ backgroundColor: `${material.iconColor}1A` }} // CC = ~80% opacity
                    >
                      <FileIcon color={material.iconColor} />
                    </div>
                    <div>
                      <p className="font-bold text-md">{material.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {material.size} - {material.updated}
                      </p>
                    </div>
                    <div className="flex flex-1 justify-end">
                      <Download color="#3072C0" />
                    </div>
                  </div>
                ))}
                <Separator />
                <div>
                  <p>Pre-Meeting Checklist</p>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1">
                      <CheckboxSquare className="mr-2" />
                      <p>Review Q3 performance metrics</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckboxSquare className="mr-2" />
                      <p>Prepare holiday campaign proposals</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckboxSquare className="mr-2" />
                      <p>Update competitor analysis data</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckboxSquare className="mr-2" />
                      <p>Prepare presentation slides</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* activity timeline  */}
          <Card className="p-2 px-0 rounded-[16px]">
            <CardHeader className="px-3">
              <CardTitle className="border-b text-md font-bold pb-1">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pb-0">
              <ol className="relative border-s m-3 border-dashed border-gray-200 dark:border-gray-700">
                <li className="mb-5 ms-6">
                  <span className="absolute flex items-center mt-2 justify-center w-4 h-4 bg-blue-100 rounded-full -start-2 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <Target color="#78A7DD" size={16} />
                  </span>
                  <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 dark:text-white">
                    Meeting Schedule
                  </h3>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    by Sarah Johnson
                  </p>
                </li>
                <li className="mb-5 ms-6">
                  <span className="absolute flex items-center mt-2 justify-center w-4 h-4 bg-blue-100 rounded-full -start-2 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <Target color="#78A7DD" size={16} />
                  </span>
                  <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
                    Attendees added
                  </h3>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    4 participants invited
                  </p>
                </li>
                <li className="mb-5 ms-6">
                  <span className="absolute flex items-center mt-2 justify-center w-4 h-4 bg-blue-100 rounded-full -start-2 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <Target color="#78A7DD" size={16} />
                  </span>
                  <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
                    Documents uploaded
                  </h3>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    3 files added
                  </p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 col-span-1 gap-3 space-y-3">
          <Card className="p-2 px-0 rounded-[16px]">
            <CardHeader className="px-3">
              <CardTitle className="border-b text-md font-bold pb-1">Task Status</CardTitle>
            </CardHeader>
            <CardContent className="px-3">
              <div className="flex flex-col items-start gap-2 w-full mt-2">
                <div className="flex justify-between w-full">
                  <p className="text-sm font-medium text-muted-foreground">Progress</p>
                  <p className="text-sm font-medium">25%</p>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#508CD3] transition-all duration-500"
                    style={{ width: "25%" }}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-3">
                <div className="bg-[#F3F5F7] dark:bg-[#0F1B29] rounded-lg px-3 p-2 py-3 flex items-center gap-2">
                  <div className="rounded-full w-8 h-8 flex items-center justify-center">
                    <Clock size={24} color="#EE4F8D" className="rounded-full p-1 bg-[#EE4F8D]/10" />
                  </div>
                  <div>
                    <p className="font-bold text-md">Due Time</p>
                    <p className="text-sm text-red-400">In 2 hours</p>
                  </div>
                </div>
                <div className="bg-[#F3F5F7] dark:bg-[#0F1B29] rounded-lg px-3 p-2 py-3 flex items-center gap-2">
                  <div className="rounded-full w-8 h-8 flex items-center justify-center">
                    <Flag size={24} color="#ECA338" className="rounded-full p-1 bg-[#EE4F8D]/10" />
                  </div>
                  <div>
                    <p className="font-bold text-md">Priority Level</p>
                    <p className="text-sm text-red-400">High Priority</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    <CheckboxSquare />
                    <p>Mark as Complete</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-2 px-0 rounded-[16px]">
            <CardHeader className="px-3">
              <CardTitle className="border-b text-md font-bold pb-1">Related Items</CardTitle>
            </CardHeader>
            <CardContent className="px-3">
              <div className="flex flex-col items-start gap-2 w-full mt-2">
                <p className="text-md font-medium">Connected Campaigns</p>
                <div className="w-full rounded-lg  flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 dark:bg-gray-800 w-8 h-8 flex items-center justify-center">
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.5"
                        d="M2.33121 6.30697C1.83663 6.43944 1.54339 6.94804 1.67586 7.44212L2.17294 9.29647C2.30541 9.79055 2.81326 10.0843 3.30734 9.95157L4.9571 9.51008L3.98046 5.86523L2.33121 6.30697Z"
                        fill="#3072C0"
                      />
                      <path
                        d="M7.58497 3.63356C7.52487 3.40694 7.29173 3.27196 7.06485 3.33306L6.43279 3.50234C6.22219 3.55894 6.09247 3.76528 6.12477 3.97664L4.40039 5.49818L5.50374 9.61807L7.75801 10.0728C7.83614 10.2719 8.05075 10.3861 8.26285 10.3295L8.89416 10.1607C9.12078 10.0996 9.25601 9.86674 9.19491 9.63986L7.58497 3.63356Z"
                        fill="#3072C0"
                      />
                      <path
                        d="M4.27946 10.209L3.4368 10.4346C3.42678 10.4371 3.41652 10.4381 3.40625 10.4406L3.87353 12.1843C3.93413 12.4114 4.16752 12.5461 4.39465 12.485L4.44524 12.4713C4.67262 12.4107 4.80684 12.1773 4.74674 11.9504L4.27946 10.209Z"
                        fill="#3072C0"
                      />
                      <path
                        opacity="0.5"
                        d="M8.6123 5.53171L9.13543 7.48248C9.67358 7.33798 9.99361 6.78406 9.84937 6.24591C9.70513 5.70676 9.15171 5.38747 8.6123 5.53171Z"
                        fill="#3072C0"
                      />
                      <path
                        d="M11.7882 2.6997C11.6843 2.6093 11.5263 2.62057 11.4356 2.72525L9.96666 4.42309C9.87626 4.52751 9.88778 4.68578 9.99271 4.77618C10.0398 4.81725 10.0984 4.83728 10.1565 4.83703C10.2263 4.83703 10.2962 4.80773 10.3455 4.75038L11.8143 3.05279C11.9047 2.94787 11.8929 2.78986 11.7882 2.6997Z"
                        fill="#3072C0"
                      />
                      <path
                        d="M13.1481 8.02811L11.0268 7.29238C10.9554 7.26734 10.8803 7.27685 10.8197 7.31216C10.7696 7.34121 10.729 7.38754 10.7082 7.44689C10.6629 7.57761 10.732 7.72034 10.8625 7.76567L12.9833 8.50165C13.1145 8.54698 13.257 8.47761 13.3021 8.34739C13.3474 8.21642 13.2783 8.07343 13.1481 8.02811Z"
                        fill="#3072C0"
                      />
                      <path
                        d="M10.7935 6.25135L12.9378 5.67664C13.0716 5.64133 13.151 5.50385 13.1149 5.37037C13.0793 5.23665 12.9426 5.15752 12.8084 5.19308L10.6633 5.76779C10.5303 5.80335 10.4504 5.94083 10.486 6.07455C10.516 6.18649 10.6172 6.26011 10.7282 6.26036C10.7499 6.26036 10.7715 6.25736 10.7935 6.25135Z"
                        fill="#3072C0"
                      />
                    </svg>
                  </div>
                  <p className="text-md">Summer Sale Campaign</p>
                </div>
                <div className="w-full rounded-lg  flex items-center gap-2">
                  <div className="rounded-full bg-green-100 dark:bg-gray-800 w-8 h-8 flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.4"
                        d="M7.1875 13.125C10.4667 13.125 13.125 10.4667 13.125 7.1875C13.125 3.90831 10.4667 1.25 7.1875 1.25C3.90831 1.25 1.25 3.90831 1.25 7.1875C1.25 10.4667 3.90831 13.125 7.1875 13.125Z"
                        fill="#2BAE82"
                      />
                      <path
                        d="M13.3121 13.7501C13.1996 13.7501 13.0871 13.7063 13.0059 13.6251L11.8434 12.4626C11.6746 12.2938 11.6746 12.0188 11.8434 11.8438C12.0121 11.6751 12.2871 11.6751 12.4621 11.8438L13.6246 13.0063C13.7934 13.1751 13.7934 13.4501 13.6246 13.6251C13.5371 13.7063 13.4246 13.7501 13.3121 13.7501Z"
                        fill="#2BAE82"
                      />
                    </svg>
                  </div>
                  <p className="text-md">SEO Optimization</p>
                </div>
                <Separator />
              </div>
              <div className="flex flex-col items-start gap-2 w-full mt-2">
                <p className="text-md font-medium">Related Tasks</p>
                <div className="w-full rounded-lg  flex items-center gap-2">
                  <div className="rounded-full bg-red-100 dark:bg-gray-800 w-8 h-8 flex items-center justify-center">
                    <CalendarIcon color="#A81A10" />
                  </div>
                  <p className="text-md">Campaign Strategy Meeting</p>
                </div>
                <div className="w-full rounded-lg  flex items-center gap-2">
                  <div className="rounded-full bg-amber-100 dark:bg-gray-800 w-8 h-8 flex items-center justify-center">
                    <FileIcon color="#A17607" height={20} width={20} />
                  </div>
                  <p className="text-md">Content Review</p>
                </div>
                <Separator />
              </div>
              <div className="flex flex-col items-start gap-2 w-full mt-2">
                <p className="text-md font-medium">Previous Meetings</p>
                <div className="w-full rounded-lg  flex items-center gap-2">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-800 w-8 h-8 flex items-center justify-center">
                    <CalendarIcon color="#303444" />
                  </div>
                  <p className="text-md">Campaign Strategy Meeting- June 15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PendingTasks;
