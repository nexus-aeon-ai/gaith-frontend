"use client";
import { ArrowLeft, Building2, Download, Edit, Globe, Mail, MapPin, Phone, Plus } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { Client } from "./TableConfig";

interface ClientDetailProfileProps {
  client: Client;
  onBack: () => void;
}

// Extended client data structure for detailed profile
interface ClientDetailData {
  // Basic Info
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive" | "Pending";
  services: string;
  clientSince: string;
  
  // Agreement Details
  agreementPeriod: {
    start: string;
    end: string;
  };
  contractStatus: string;
  renewalDue: string;
  
  // Business Info
  businessOverview: {
    description: string;
    founded: string;
    employees: string;
    headquarters: string;
  };
  
  // Contact & Social
  contactInfo: {
    email: string;
    phone: string;
    website: string;
  };
  socialMedia: {
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
  };
  
  // Market Info
  marketInfo: {
    primaryRegion: string;
    secondaryRegions: string;
    targetMarkets: string;
  };
  
  // Vision & Mission
  vision: string;
  mission: string;
  
  // Team Assignment
  assignedTeam: Array<{
    id: string;
    name: string;
    role: string;
    initial: string;
    color: string;
  }>;
}

const ClientDetailProfile = ({ client, onBack }: ClientDetailProfileProps) => {
  const [activeTab, setActiveTab] = useState("main-info");

  // Mock detailed client data - this will be fetched from backend
  const clientDetailData: ClientDetailData = {
    id: client.id,
    name: client.name,
    email: client.email,
    status: client.status,
    services: client.services,
    clientSince: "March 2023",
    
    agreementPeriod: client.agreementPeriod,
    contractStatus: "Active",
    renewalDue: "In 8 Months",
    
    businessOverview: {
      description: "Global Solutions Inc. is a leading technology company specializing in enterprise software solutions and digital transformation services for Fortune 500 companies.",
      founded: "2010",
      employees: "1,200+",
      headquarters: "AED",
    },
    
    contactInfo: {
      email: client.email,
      phone: client.contactInfo,
      website: "www.globalsolutions.com",
    },
    
    socialMedia: {
      linkedin: "linkedin.com/company/globalsolutions",
      twitter: "twitter.com/globalsolutions",
      instagram: "instagram.com/globalsolutions",
      facebook: "facebook.com/globalsolutions",
    },
    
    marketInfo: {
      primaryRegion: client.marketRegion,
      secondaryRegions: "(MENA)",
      targetMarkets: "Enterprise, Mid-Market",
    },
    
    vision: "To be the global leader in innovative technology solutions that empower businesses to achieve digital excellence and sustainable growth.",
    mission: "We deliver cutting-edge technology solutions that solve complex business challenges, drive efficiency, and create lasting value for our clients and stakeholders.",
    
    assignedTeam: [
      { id: "1", name: "MA Michael Anderson", role: "Account Manager", initial: "MA", color: "bg-blue-500" },
      { id: "2", name: "JB James Brown", role: "Data Analyst", initial: "JB", color: "bg-green-500" },
      { id: "3", name: "MA Michael Anderson", role: "Social Media", initial: "MA", color: "bg-purple-500" },
      { id: "4", name: "EW Emily Williams", role: "UX Researcher", initial: "EW", color: "bg-orange-500" },
      { id: "5", name: "SP Sophia Patel", role: "Head of Operations", initial: "SP", color: "bg-red-500" },
    ],
  };

  return (
    <div className="min-h-screen w-full p-4 bg-background">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Button 
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1 hover:text-gray-700 transition-colors p-0 h-auto text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Client Management
          </Button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 font-medium">{clientDetailData.name}</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                {clientDetailData.name}
                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 text-sm font-medium">
                  {clientDetailData.status}
                </Badge>
              </h1>
              <p className="text-gray-600 text-lg">
                {clientDetailData.services} - Client since {clientDetailData.clientSince}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2">
              <Download className="w-4 h-4" />
              Export Excel
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button size="sm" className="flex items-center gap-2 px-4 py-2 bg-[#508CD3] hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="main-info" 
            className={cn(
              "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
              "text-gray-600 font-medium",
            )}
          >
            Main Information
          </TabsTrigger>
          <TabsTrigger 
            value="campaign-tasks"
            className={cn(
              "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
              "text-gray-600 font-medium",
            )}
          >
            Campaign & Tasks
          </TabsTrigger>
          <TabsTrigger 
            value="historical-performance"
            className={cn(
              "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
              "text-gray-600 font-medium",
            )}
          >
            Historical Performance
          </TabsTrigger>
          <TabsTrigger 
            value="integrations"
            className={cn(
              "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
              "text-gray-600 font-medium",
            )}
          >
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main-info" className="space-y-6">
          {/* First Row - Smaller Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Agreement Period Card */}
            <Card className="border border-gray-200 shadow-sm p-4 pb-2 m-0  h-64">
              <CardHeader className="p-0 mb-1">
                <CardTitle className="text-lg font-semibold text-gray-900">
                   Agreement Period
                </CardTitle>
              </CardHeader>

              {/* Remove default padding */}
              <CardContent className="p-0 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-md">From</span>
                  <span className="text-gray-600 text-md ml-auto pl-4">To</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">
                    {clientDetailData.agreementPeriod.start}
                  </span>
                  <span className="font-medium text-gray-900">
                    {clientDetailData.agreementPeriod.end}
                  </span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-md">Contract Status:</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200 px-2 py-1 text-xs">
                    {clientDetailData.contractStatus}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-md">Renewal Due:</span>
                  <span className="font-medium text-orange-600">
                    {clientDetailData.renewalDue}
                  </span>
                </div>

                <Separator className="my-2" />

                {/* removed mt-3 */}
                <div className="flex items-center w-full justify-between space-x-2">
                  <span className="text-gray-600 text-md font-medium">Assigned To:</span>
                  <div className="flex -space-x-2">
                    {client.assignedTo.map((person, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white shadow-sm",
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
            <Card className="border border-gray-200 shadow-sm p-4 h-64">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Business Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {clientDetailData.businessOverview.description}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Founded:</span>
                    <span className="font-medium text-gray-900">{clientDetailData.businessOverview.founded}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Employees:</span>
                    <span className="font-medium text-gray-900">{clientDetailData.businessOverview.employees}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Headquarters:</span>
                    <span className="font-medium text-gray-900">{clientDetailData.businessOverview.headquarters}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media & Contact Card */}
            <Card className="border border-gray-200 shadow-sm p-4 h-64">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Social Media & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">in</span>
                  </div>
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">X</span>
                  </div>
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-bold text-sm">IG</span>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">f</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{clientDetailData.contactInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{clientDetailData.contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{clientDetailData.contactInfo.website}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Row - Larger Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Market Information Card */}
            <Card className="border border-gray-200 shadow-sm p-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Market Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Map placeholder</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Primary Region:</span>
                    <span className="font-medium text-gray-900">{clientDetailData.marketInfo.primaryRegion}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Secondary Regions:</span>
                    <span className="font-medium text-gray-900">{clientDetailData.marketInfo.secondaryRegions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Target Markets:</span>
                    <span className="font-medium text-gray-900">{clientDetailData.marketInfo.targetMarkets}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vision & Mission Card */}
            <Card className="border border-gray-200 shadow-sm p-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Vision & Mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Vision</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {clientDetailData.vision}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Mission</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {clientDetailData.mission}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Team Card */}
            <Card className="border border-gray-200 shadow-sm p-4   ">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Assigned Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {clientDetailData.assignedTeam.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shadow-sm",
                      member.color,
                    )}>
                      {member.initial}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaign-tasks" className="space-y-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Campaign & Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Campaign and tasks information will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historical-performance" className="space-y-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Historical Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Historical performance data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Integration settings and connections will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetailProfile;
