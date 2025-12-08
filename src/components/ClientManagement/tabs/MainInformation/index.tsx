"use client";

import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MainInformationTabProps } from "@/lib/types";
import { cn } from "@/lib/utils";

import { mockMainInformationData } from "../../data";

const MainInformationTab = ({ client }: MainInformationTabProps) => {
  const clientDetails = mockMainInformationData;

  const formatDate = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleString("en-US", { month: "short", year: "numeric", day: "numeric" });
  };

  return (
    <div className="space-y-6 bg-card p-0">
      {/* Top Row - 3 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agreement Period Card */}
        <Card>
          <CardHeader>
            <CardTitle className="px-0 py-2 text-lg">Agreement Period</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">From</span>
                <span className="text-sm text-muted-foreground">To</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium text-foreground">
                  {formatDate(client.agreementStartDate)}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(client.agreementEndDate)}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Contract Status:</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {clientDetails.agreementPeriod.status}
              </Badge>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Renewal Due:</span>
              <span className="text-sm font-medium text-foreground">
                {clientDetails.agreementPeriod.renewalDue}
              </span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Assigned To:</span>
              <div className="flex -space-x-2">
                {clientDetails.agreementPeriod.assignedTo.map((person, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white dark:border-gray-800",
                      person.color,
                    )}
                    title={person.name}
                  >
                    {person.initial}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="px-0 py-2 text-lg">Business Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground leading-relaxed">
              {clientDetails.businessOverview.description}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Founded:</span>
                <span className="text-sm font-medium text-foreground">
                  {clientDetails.businessOverview.founded}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Employees:</span>
                <span className="text-sm font-medium text-foreground">
                  {clientDetails.businessOverview.employees}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Headquarters:</span>
                <span className="text-sm font-medium text-foreground">
                  {clientDetails.businessOverview.headquarters}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Accounts Card */}
        <Card>
          <CardHeader>
            <CardTitle className="px-0 py-2 text-lg">Social Media Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {clientDetails.socialMedia.accounts.map((account, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white",
                    account.color,
                  )}
                  title={account.name}
                >
                  <account.icon className="h-4 w-4" />
                </div>
              ))}
            </div>
            <Separator />
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

                <span className="text-muted-foreground">contact@globalsolutions.com</span>
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
                    d="M6.37505 17.425C6.35005 17.425 6.31672 17.4417 6.29172 17.4417C4.67505 16.6417 3.35838 15.3167 2.55005 13.7C2.55005 13.675 2.56672 13.6417 2.56672 13.6167C3.58338 13.9167 4.63338 14.1417 5.67505 14.3167C5.85838 15.3667 6.07505 16.4084 6.37505 17.425Z"
                    fill="#3072C0"
                  />
                  <path
                    opacity="0.4"
                    d="M17.45 13.7084C16.625 15.3667 15.25 16.7084 13.575 17.5167C13.8916 16.4584 14.1583 15.3917 14.3333 14.3167C15.3833 14.1417 16.4166 13.9167 17.4333 13.6167C17.425 13.65 17.45 13.6834 17.45 13.7084Z"
                    fill="#3072C0"
                  />
                  <path
                    opacity="0.4"
                    d="M17.5166 6.42507C16.4666 6.1084 15.4083 5.85007 14.3333 5.66673C14.1583 4.59173 13.9 3.52507 13.575 2.4834C15.3 3.3084 16.6916 4.70007 17.5166 6.42507Z"
                    fill="#3072C0"
                  />
                  <path
                    opacity="0.4"
                    d="M6.37494 2.5748C6.07494 3.59147 5.85828 4.6248 5.68328 5.6748C4.60828 5.84147 3.54161 6.10814 2.48328 6.4248C3.29161 4.7498 4.63328 3.3748 6.29161 2.5498C6.31661 2.5498 6.34994 2.5748 6.37494 2.5748Z"
                    fill="#3072C0"
                  />
                  <path
                    d="M12.9083 5.4915C10.975 5.27484 9.02501 5.27484 7.09167 5.4915C7.30001 4.34984 7.56667 3.20817 7.94167 2.10817C7.95834 2.0415 7.95001 1.9915 7.95834 1.92484C8.61667 1.7665 9.29167 1.6665 10 1.6665C10.7 1.6665 11.3833 1.7665 12.0333 1.92484C12.0417 1.9915 12.0417 2.0415 12.0583 2.10817C12.4333 3.2165 12.7 4.34984 12.9083 5.4915Z"
                    fill="#3072C0"
                  />
                  <path
                    d="M5.49163 12.9085C4.34163 12.7001 3.20829 12.4335 2.10829 12.0585C2.04163 12.0418 1.99163 12.0501 1.92496 12.0418C1.76663 11.3835 1.66663 10.7085 1.66663 10.0001C1.66663 9.30013 1.76663 8.6168 1.92496 7.9668C1.99163 7.95846 2.04163 7.95846 2.10829 7.9418C3.21663 7.57513 4.34163 7.30013 5.49163 7.0918C5.28329 9.02513 5.28329 10.9751 5.49163 12.9085Z"
                    fill="#3072C0"
                  />
                  <path
                    d="M18.3333 10.0001C18.3333 10.7085 18.2333 11.3835 18.075 12.0418C18.0083 12.0501 17.9583 12.0418 17.8916 12.0585C16.7833 12.4251 15.65 12.7001 14.5083 12.9085C14.725 10.9751 14.725 9.02513 14.5083 7.0918C15.65 7.30013 16.7916 7.5668 17.8916 7.9418C17.9583 7.95846 18.0083 7.9668 18.075 7.9668C18.2333 8.62513 18.3333 9.30013 18.3333 10.0001Z"
                    fill="#3072C0"
                  />
                  <path
                    d="M12.9083 14.5083C12.7 15.6583 12.4333 16.7916 12.0583 17.8916C12.0417 17.9583 12.0417 18.0083 12.0333 18.075C11.3833 18.2333 10.7 18.3333 10 18.3333C9.29167 18.3333 8.61667 18.2333 7.95834 18.075C7.95001 18.0083 7.95834 17.9583 7.94167 17.8916C7.57501 16.7833 7.30001 15.6583 7.09167 14.5083C8.05834 14.6166 9.02501 14.6916 10 14.6916C10.975 14.6916 11.95 14.6166 12.9083 14.5083Z"
                    fill="#3072C0"
                  />
                  <path
                    d="M13.1361 13.1359C11.0518 13.3989 8.9481 13.3989 6.86385 13.1359C6.60088 11.0517 6.60088 8.94797 6.86385 6.86373C8.9481 6.60076 11.0518 6.60076 13.1361 6.86373C13.399 8.94797 13.399 11.0517 13.1361 13.1359Z"
                    fill="#3072C0"
                  />
                </svg>

                <span className="text-muted-foreground">www.globalsolutions.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - 3 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Location Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="px-0 py-2 text-lg">Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Map placeholder */}
            <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Dubai, UAE Map</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Primary Region:</span>
                <span className="text-sm font-medium text-foreground text-end">
                  {clientDetails.locationDetails.primaryRegion}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Secondary Regions:</span>
                <span className="text-sm font-medium text-foreground text-end">
                  {clientDetails.locationDetails.secondaryRegions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Target Markets:</span>
                <span className="text-sm font-medium text-foreground text-end">
                  {clientDetails.locationDetails.targetMarkets}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vision & Mission Card */}
        <Card>
          <CardHeader>
            <CardTitle className="px-0 py-2 text-lg">Vision & Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium  mb-2">Vision:</h4>
              <p className="text-sm text-foreground leading-relaxed">
                {clientDetails.visionMission.vision}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium  mb-2">Mission:</h4>
              <p className="text-sm text-foreground leading-relaxed">
                {clientDetails.visionMission.mission}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Assigned To Card */}
        <Card>
          <CardHeader>
            <CardTitle className="px-0 py-2 text-lg">Assigned To</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientDetails.assignedTo.map((person, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white",
                      person.color,
                    )}
                  >
                    {person.initial}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainInformationTab;
