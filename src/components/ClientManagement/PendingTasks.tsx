"use client";

import { Plus } from "lucide-react";
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
import { Client } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
        <div className="lg:col-span-3 col-span-1 gap-3">
          <Card className="p-2 px-0">
            <CardHeader className="px-3">
              <CardTitle className="border-b text-md font-bold pb-1">Meeting Details</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-md font-bold"> Meeting Agenda</h2>
              <ul className="list-disc list-inside mb-4">
                <li>Review Q3 marketing performance metrics and ROI analysis</li>
                <li>Discuss upcoming holiday campaign strategy and budget allocation</li>
                <li>Present new social media engagement initiatives</li>
                <li>Review competitor analysis and market positioning</li>
                <li>Define action items and next steps for Q4</li>
              </ul>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
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
          <Card className="p-2 px-0">
            <CardHeader className="px-3">
              <CardTitle className="border-b text-md font-bold pb-1">Meeting Attendees</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              {attendees.map((attendee, index) => (
                <div key={index} className="flex flex-col mt-2 items-center mb-3">
                  <Image
                    src={"/images/default-avatar.jpg"}
                    alt={attendee.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <p className="text-md font-medium">{attendee.name}</p>
                  <p className="text-sm font-normal text-muted-foreground">{attendee.role}</p>
                </div>
              ))}
              <div
                className="flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 w-12 h-12 mt-2 mb-3"
              >
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 col-span-1 gap-3">
          <Card>
            <CardHeader>
              <CardTitle>title 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p>content 1</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PendingTasks;
