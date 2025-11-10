"use client";

import { Globe, Mail, MapPin, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import { MainInformationTabProps } from "@/lib/types";
import { mockMainInformationData } from "../../data";

const MainInformationTab = ({ client }: MainInformationTabProps) => {
  const clientDetails = mockMainInformationData;

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
              <span className="text-sm font-medium text-foreground">{clientDetails.agreementPeriod.from}</span>

                <span className="text-sm font-medium text-foreground">{clientDetails.agreementPeriod.to}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Contract Status:</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {clientDetails.agreementPeriod.status}
              </Badge>
            </div>
            
            <div className="flex justify-between ">
              <span className="text-sm text-muted-foreground">Renewal Due:</span>
              <span className="text-sm font-medium text-foreground">{clientDetails.agreementPeriod.renewalDue}</span>
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
                <span className="text-sm font-medium text-foreground">{clientDetails.businessOverview.founded}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Employees:</span>
                <span className="text-sm font-medium text-foreground">{clientDetails.businessOverview.employees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Headquarters:</span>
                <span className="text-sm font-medium text-foreground">{clientDetails.businessOverview.headquarters}</span>
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
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{clientDetails.socialMedia.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{clientDetails.socialMedia.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{clientDetails.socialMedia.contact.website}</span>
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
                <span className="text-sm font-medium text-foreground">{clientDetails.locationDetails.primaryRegion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Secondary Regions:</span>
                <span className="text-sm font-medium text-foreground">{clientDetails.locationDetails.secondaryRegions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Target Markets:</span>
                <span className="text-sm font-medium text-foreground">{clientDetails.locationDetails.targetMarkets}</span>
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
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Vision:</h4>
              <p className="text-sm text-foreground leading-relaxed">
                {clientDetails.visionMission.vision}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Mission:</h4>
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
