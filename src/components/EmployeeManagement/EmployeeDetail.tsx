"use client";
import { CalendarDays, SquarePen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import EmployeeReviewSheet from "@/components/sheet/EmployeeReview";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import CupIcon from "@/components/ui/icons/cup";
import { DashboardListIcon } from "@/components/ui/icons/dashboard-list";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import ChecklistIcon from "@/components/ui/icons/task-tracking/checklist";
import TeacherHatIcon from "@/components/ui/icons/TeacherHat";

import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

export type EmployeeDetailsProps = {
  employeeId?: string | null;
  closeEmployeeDetails: () => void;
};

const EmployeeDetails = ({ employeeId, closeEmployeeDetails }: EmployeeDetailsProps) => {
  const [showEmployeeReviewSheet, setShowEmployeeReviewSheet] = useState(false);

  const skills = [
    {
      name: "Team Leadership",
      color: "#175E46",
    },
    {
      name: "Strategic Planning",
      color: "#A81A10",
    },
    {
      name: "Problem Solving",
      color: "#EE4F8D",
    },
    {
      name: "Communication",
      color: "#853AA6",
    },
    {
      name: "Negotiation",
      color: "#A17607",
    },
  ];

  console.log("Employee ID:", employeeId);
  return (
    <div className="w-full mx-auto p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">
                <DashboardListIcon className="dark:text-[#E6EFF9]" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/submitted"
                className="text-blue-600 font-medium text-md"
                onClick={closeEmployeeDetails}
              >
                Employees Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>View Employee</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col xl:flex-row gap-4 xl:gap-0 items-start justify-between mb-8">
        <div className="flex items-center gap-2">
          <Image
            src="/images/girl-pfp.jpg"
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <div className="flex md:gap-2 gap-1 md:items-center items-start">
              <h1 className="text-2xl font-semibold text-foreground">Holiday Season Sale 2025</h1>
              <Badge className="md:mt-0 mt-2 rounded-sm bg-yellow-100 pointer-events-none dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-500">
                Pending
              </Badge>
            </div>
            <p className="text-muted-foreground">Submitted Dec 18, 2024</p>
          </div>
        </div>
        <div className="flex md:flex-row flex-col gap-2">
          <div className="flex md:flex-row flex-col gap-2">
            <Button
              variant="outline"
              className={cn(
                "w-fit p-6 px-8 text-[16px] font-[400]  rounded-[16px] border-none",
                "flex items-center gap-2",
                "bg-card",
                "hover:bg-card hover:text-dark-foreground",
              )}
            >
              <ExcelIcon />
              <span>Export Excel</span>
            </Button>
            <Button
              variant="outline"
              className="w-fit p-6 px-8 hover:bg-[#3072C0] text-[16px] font-[400] border-[#3072C0] text-[#3072C0] rounded-[16px] bg-transparent"
              onClick={() => setShowEmployeeReviewSheet(true)}
            >
              <CalendarDays />
              Schedule Review
            </Button>
          </div>
          <div className="flex md:flex-row flex-col gap-2">
            <Button
              variant="outline"
              className="w-fit p-6 px-8 hover:bg-[#687192]/30 text-[16px] font-[400] border-[#687192] text-[#687192] hover:text-[#687192] rounded-[16px] bg-transparent"
              onClick={() => setShowEmployeeReviewSheet(true)}
            >
              <SquarePen color="#687192" />
              Edit Profile
            </Button>
            <Button
              type="submit"
              form="lead-form"
              variant={"outline"}
              className="w-fit p-6 px-8 text-[16px] font-[400]  rounded-[16px] border-none bg-[#3072C0]  hover:bg-[#3072C0]/80 text-[#fff] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChecklistIcon color="white" />
              Assign Task
            </Button>
          </div>
        </div>
      </div>

      <Card
        className={cn("rounded-xl border bg-card ", "p-4")}
        role="region"
        aria-label="Quotation"
      >
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Left */}
          <div className="flex flex-col gap-2">
            <section
              className="rounded-lg h-fit border p-4 md:p-5 "
              aria-labelledby="selected-services-heading"
            >
              <h3
                id="selected-services-heading"
                className="text-[18px] font-[700] text-[#070913] dark:text-[#E6EFF9]"
              >
                Employee Details
              </h3>

              <div className="flex flex-col gap-2 mt-2" role="list">
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Employee ID</span>
                  <span className="font-medium text-foreground text-right break-all">EMP001</span>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-medium text-foreground text-right">North Region</span>
                </div>
                <div
                  className="flex items-start justify-between gap-4 text-sm sm:col-span-3"
                  role="listitem"
                >
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium text-foreground text-right block">
                    January 15, 2025
                  </span>
                </div>
                <div
                  className="flex items-start justify-between gap-4 text-sm sm:col-span-3"
                  role="listitem"
                >
                  <span className="text-muted-foreground">Employment Type</span>
                  <span className="font-medium text-foreground text-right block">Full Time</span>
                </div>
              </div>
            </section>

            <section
              className="rounded-lg h-fit border p-4 md:p-5 "
              aria-labelledby="selected-services-heading"
            >
              <h3
                id="selected-services-heading"
                className="text-[18px] font-[700] text-[#070913] dark:text-[#E6EFF9]"
              >
                Performance Metrics
              </h3>

              <div className="flex flex-col gap-2 mt-2" role="list">
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Target Achievement</span>
                  <div className="flex gap-2 items-center font-medium text-foreground text-right break-all">
                    90%
                    <div className="bg-gray-400 h-[5px] w-[90px] rounded-sm overflow-hidden">
                      <div style={{ width: "90%", height: "5px", backgroundColor: "#3FD09F" }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4 text-sm" role="listitem">
                  <span className="text-muted-foreground">Overall Performance</span>
                  <span className="font-medium  text-right text-[#3FD09F]">115%</span>
                </div>
                <div
                  className="flex items-start justify-between gap-4 text-sm sm:col-span-3"
                  role="listitem"
                >
                  <span className="text-muted-foreground">Customer Satisfaction</span>
                  <span className="font-medium  text-right block text-[#3FD09F]">4.8/5.0</span>
                </div>
              </div>
            </section>
          </div>
          {/* Right */}
          <div className="flex flex-col gap-2">
            <section
              className="rounded-lg h-fit border p-4 md:p-5 "
              aria-labelledby="selected-services-heading"
            >
              <h3
                id="selected-services-heading"
                className="text-[18px] font-[700] text-[#070913] dark:text-[#E6EFF9]"
              >
                Contact Information
              </h3>

              <div className="flex flex-col gap-2 mt-2" role="list">
                <div className="flex items-center gap-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.4"
                      d="M14.1666 17.0827H5.83329C3.33329 17.0827 1.66663 15.8327 1.66663 12.916V7.08268C1.66663 4.16602 3.33329 2.91602 5.83329 2.91602H14.1666C16.6666 2.91602 18.3333 4.16602 18.3333 7.08268V12.916C18.3333 15.8327 16.6666 17.0827 14.1666 17.0827Z"
                      fill="#3072C0"
                    />
                    <path
                      d="M9.99998 10.7259C9.29998 10.7259 8.59165 10.5093 8.04998 10.0676L5.44164 7.98429C5.17498 7.76762 5.12498 7.37595 5.34165 7.10928C5.55831 6.84262 5.94998 6.79262 6.21665 7.00929L8.82497 9.09262C9.45831 9.60096 10.5333 9.60096 11.1666 9.09262L13.775 7.00929C14.0416 6.79262 14.4416 6.83428 14.65 7.10928C14.8666 7.37595 14.825 7.77595 14.55 7.98429L11.9416 10.0676C11.4083 10.5093 10.7 10.7259 9.99998 10.7259Z"
                      fill="#3072C0"
                    />
                  </svg>

                  <span className="text-muted-foreground">Publishing Schedule</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.6833 8.95768C14.325 8.95768 14.0416 8.66602 14.0416 8.31602C14.0416 8.00768 13.7333 7.36602 13.2166 6.80768C12.7083 6.26602 12.15 5.94935 11.6833 5.94935C11.325 5.94935 11.0416 5.65768 11.0416 5.30768C11.0416 4.95768 11.3333 4.66602 11.6833 4.66602C12.5166 4.66602 13.3916 5.11602 14.1583 5.92435C14.875 6.68268 15.3333 7.62435 15.3333 8.30768C15.3333 8.66602 15.0416 8.95768 14.6833 8.95768Z"
                      fill="#3072C0"
                    />
                    <path
                      d="M17.6917 8.95768C17.3334 8.95768 17.05 8.66602 17.05 8.31602C17.05 5.35768 14.6417 2.95768 11.6917 2.95768C11.3334 2.95768 11.05 2.66602 11.05 2.31602C11.05 1.96602 11.3334 1.66602 11.6834 1.66602C15.35 1.66602 18.3334 4.64935 18.3334 8.31602C18.3334 8.66602 18.0417 8.95768 17.6917 8.95768Z"
                      fill="#3072C0"
                    />
                    <path
                      opacity="0.4"
                      d="M9.82496 11.841L7.09996 14.566C6.79996 14.2993 6.50829 14.0243 6.22496 13.741C5.36663 12.8743 4.59163 11.966 3.89996 11.016C3.21663 10.066 2.66663 9.11602 2.26663 8.17435C1.86663 7.22435 1.66663 6.31602 1.66663 5.44935C1.66663 4.88268 1.76663 4.34102 1.96663 3.84102C2.16663 3.33268 2.48329 2.86602 2.92496 2.44935C3.45829 1.92435 4.04163 1.66602 4.65829 1.66602C4.89163 1.66602 5.12496 1.71602 5.33329 1.81602C5.54996 1.91602 5.74163 2.06602 5.89163 2.28268L7.82496 5.00768C7.97496 5.21602 8.08329 5.40768 8.15829 5.59102C8.23329 5.76602 8.27496 5.94102 8.27496 6.09935C8.27496 6.29935 8.21663 6.49935 8.09996 6.69102C7.99163 6.88268 7.83329 7.08268 7.63329 7.28268L6.99996 7.94102C6.90829 8.03268 6.86663 8.14102 6.86663 8.27435C6.86663 8.34102 6.87496 8.39935 6.89163 8.46602C6.91663 8.53268 6.94163 8.58268 6.95829 8.63268C7.10829 8.90768 7.36663 9.26602 7.73329 9.69935C8.10829 10.1327 8.50829 10.5743 8.94163 11.016C9.24163 11.3077 9.53329 11.591 9.82496 11.841Z"
                      fill="#3072C0"
                    />
                    <path
                      d="M18.308 15.2742C18.308 15.5076 18.2663 15.7492 18.183 15.9826C18.158 16.0492 18.133 16.1159 18.0996 16.1826C17.958 16.4826 17.7746 16.7659 17.533 17.0326C17.1246 17.4826 16.6746 17.8076 16.1663 18.0159C16.158 18.0159 16.1496 18.0242 16.1413 18.0242C15.6496 18.2242 15.1163 18.3326 14.5413 18.3326C13.6913 18.3326 12.783 18.1326 11.8246 17.7242C10.8663 17.3159 9.90797 16.7659 8.95797 16.0742C8.63297 15.8326 8.30797 15.5909 7.99963 15.3326L10.7246 12.6076C10.958 12.7826 11.1663 12.9159 11.3413 13.0076C11.383 13.0242 11.433 13.0492 11.4913 13.0742C11.558 13.0992 11.6246 13.1076 11.6996 13.1076C11.8413 13.1076 11.9496 13.0576 12.0413 12.9659L12.6746 12.3409C12.883 12.1326 13.083 11.9742 13.2746 11.8742C13.4663 11.7576 13.658 11.6992 13.8663 11.6992C14.0246 11.6992 14.1913 11.7326 14.3746 11.8076C14.558 11.8826 14.7496 11.9909 14.958 12.1326L17.7163 14.0909C17.933 14.2409 18.083 14.4159 18.1746 14.6242C18.258 14.8326 18.308 15.0409 18.308 15.2742Z"
                      fill="#3072C0"
                    />
                  </svg>

                  <span className="text-muted-foreground">+9670000000000</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.4"
                      d="M17.1833 7.04232C16.3083 3.19232 12.95 1.45898 9.99996 1.45898C9.99996 1.45898 9.99996 1.45898 9.99162 1.45898C7.04996 1.45898 3.68329 3.18398 2.80829 7.03398C1.83329 11.334 4.46662 14.9756 6.84996 17.2673C7.73329 18.1173 8.86662 18.5423 9.99996 18.5423C11.1333 18.5423 12.2666 18.1173 13.1416 17.2673C15.525 14.9756 18.1583 11.3423 17.1833 7.04232Z"
                      fill="#3072C0"
                    />
                    <path
                      d="M10 11.2168C11.4497 11.2168 12.625 10.0415 12.625 8.5918C12.625 7.14205 11.4497 5.9668 10 5.9668C8.55025 5.9668 7.375 7.14205 7.375 8.5918C7.375 10.0415 8.55025 11.2168 10 11.2168Z"
                      fill="#3072C0"
                    />
                  </svg>

                  <span className="text-muted-foreground">New York, NY, United States</span>
                </div>
              </div>
            </section>
            <section
              className="rounded-lg h-fit border p-4 md:p-5 "
              aria-labelledby="selected-services-heading"
            >
              <h3
                id="selected-services-heading"
                className="text-[18px] font-[700] text-[#070913] dark:text-[#E6EFF9]"
              >
                Skills & Competencies
              </h3>

              <div className="space-x-1 space-y-1 mt-2" role="list">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="rounded-[8px] p-[5px] px-[8px]"
                    style={{
                      backgroundColor: `${skill.color}1A`, // "B3" = ~70% opacity (in HEX)
                      color: skill.color,
                    }}
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </section>
          </div>
        </div>
      </Card>

      <Card
        className={cn("rounded-xl mt-3 border bg-card ", "p-4")}
        role="region"
        aria-label="Quotation"
      >
        <div className="flex flex-col gap-2">
          <section aria-labelledby="selected-services-heading">
            <h3
              id="selected-services-heading"
              className="text-[18px] font-[700] text-[#070913] dark:text-[#E6EFF9]"
            >
              Recent Activity & Notes
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center p-4 rounded-xl border transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#3072C014] flex items-center justify-center  rounded-lg shadow-sm">
                    <CupIcon color="#3072C0" />
                  </div>
                  <div>
                    <p className="font-semibold ">Achievement Unlocked</p>
                    <p className="text-sm text-muted-foreground">
                      Exceeded quarterly sales target by 15%. Outstanding performance in Q4 2024.
                    </p>
                  </div>
                </div>
                <span className="text-sm  font-normal ">1 week ago</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl border transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#3072C014] flex items-center justify-center  rounded-lg shadow-sm">
                    <TeacherHatIcon color="#2BAE82" />
                  </div>
                  <div>
                    <p className="font-semibold ">Training Completed</p>
                    <p className="text-sm text-muted-foreground">
                      Completed Advanced Sales Leadership certification program with distinction.{" "}
                    </p>
                  </div>
                </div>
                <span className="text-sm  font-normal ">2 weeks ago</span>
              </div>
            </div>
          </section>
        </div>
      </Card>
      <EmployeeReviewSheet
        open={showEmployeeReviewSheet}
        onOpenChange={setShowEmployeeReviewSheet}
        employeeId={employeeId}
      />
    </div>
  );
};

export default EmployeeDetails;
