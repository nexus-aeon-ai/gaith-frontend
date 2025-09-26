"use client";

import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import Gallery from "@/components/ui/icons/options/gallery";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createLeadSchema, type CreateLeadFormData } from "@/lib/validations/lead";

const EditLeadPage = () => {
  const [formData, setFormData] = useState<CreateLeadFormData>({
    fullName: "",
    nationality: "",
    email: "",
    phoneNumber: "",
    country: "",
    region: "",
    area: "",
    fullAddress: "",
    leadSource: "website",
    assignedTo: "creative-director",
    visionStatement: "",
    missionStatement: "",
    linkedinUrl: "",
    facebookUrl: "",
    youtubeUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    websiteUrl: "",
    additionalNotes: "",
    productsServices: {
      software: false,
      hardware: false,
      consulting: false,
      webDesign: false,
      mobileApp: false,
      cloudServices: false,
    },
    additionalTeamMembers: {
      software: false,
      hardware: false,
      consulting: false,
      webDesign: false,
      mobileApp: false,
      cloudServices: false,
      marketing: false,
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { theme } = useTheme();

  // Helper function to get error message for a field
  const getFieldError = (field: string) => {
    return validationErrors[field] || "";
  };

  // Helper function to check if field has error
  const hasFieldError = (field: string) => {
    return !!validationErrors[field];
  };

  const productsServicesOptions = [
    { id: "software", label: "Software Development", value: "software" },
    { id: "hardware", label: "Hardware Solutions", value: "hardware" },
    { id: "consulting", label: "IT Consulting", value: "consulting" },
    { id: "webDesign", label: "Web Design", value: "webDesign" },
    { id: "mobileApp", label: "Mobile App Development", value: "mobileApp" },
    { id: "cloudServices", label: "Cloud Services", value: "cloudServices" },
  ];

  const leadSourceOptions = [
    { value: "website", label: "Website" },
    { value: "social-media", label: "Social Media" },
    { value: "referral", label: "Referral" },
    { value: "campaign", label: "Campaign" },
    { value: "cold-call", label: "Cold Call" },
    { value: "email", label: "Email Marketing" },
    { value: "trade-show", label: "Trade Show" },
    { value: "other", label: "Other" },
  ];

  const additionalTeamMembersOptions = [
    { id: "creative-director", label: "Creative Director", value: "creative-director" },
    { id: "social-media-manager", label: "Social Media Manager", value: "social-media-manager" },
    { id: "ux-researcher", label: "UX Researcher", value: "ux-researcher" },
    { id: "web-developer", label: "Web Developer", value: "web-developer" },
    { id: "content-writer", label: "Content Writer", value: "content-writer" },
    { id: "graphic-designer", label: "Graphic Designer", value: "graphic-designer" },
    { id: "seo-specialist", label: "SEO Specialist", value: "seo-specialist" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleProductsServicesChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      productsServices: {
        ...prev.productsServices,
        [field]: checked,
      },
    }));
  };

  const handleAdditionalTeamMembersChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      additionalTeamMembers: {
        ...prev.additionalTeamMembers,
        [field]: checked,
      },
    }));
  };

  const handleCancel = () => {
    // Reset form or navigate away
    setFormData({
      fullName: "",
      nationality: "",
      email: "",
      phoneNumber: "",
      country: "",
      region: "",
      area: "",
      fullAddress: "",
      leadSource: "website",
      assignedTo: "creative-director",
      visionStatement: "",
      missionStatement: "",
      linkedinUrl: "",
      facebookUrl: "",
      youtubeUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      websiteUrl: "",
      additionalNotes: "",
      productsServices: {
        software: false,
        hardware: false,
        consulting: false,
        webDesign: false,
        mobileApp: false,
        cloudServices: false,
      },
      additionalTeamMembers: {
        software: false,
        hardware: false,
        consulting: false,
        webDesign: false,
        mobileApp: false,
        cloudServices: false,
        marketing: false,
      },
    });
    setValidationErrors({});
    setSelectedFile(null);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Validate form data
      const result = createLeadSchema.safeParse(formData);

      if (!result.success) {
        // Extract validation errors
        const errors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          const field = issue.path.join(".");
          errors[field] = issue.message;
        });
        setValidationErrors(errors);
        return;
      }

      // If validation passes, proceed with form submission
      // TODO: Log valid form data for debugging
      // console.log("Valid form data:", result.data);

      // TODO: Implement actual form submission logic here
      // await submitLeadForm(result.data);

      // Show success message or redirect
      alert("Lead created successfully!");
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred while creating the lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/leads">Leads</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Lead</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Edit Lead</h1>
          <p className="text-muted-foreground">
            Create a comprehensive client profile with all necessary information.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="p-6 px-8 hover:bg-[#EA3B1F] text-[16px] font-[400] border-[#EA3B1F] text-[#ea3b1f] rounded-[16px] bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant={"outline"}
            disabled={isSubmitting}
            className="p-6 px-8 text-[16px] hover:bg-[#3072C0] font-[400] rounded-[16px] border-[#3072C0] text-[#3072C0] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Basic Information */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Client Name"
                  value={formData.fullName}
                  onChange={e => handleInputChange("fullName", e.target.value)}
                  className={`dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] ${
                    hasFieldError("fullName") ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {hasFieldError("fullName") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("fullName")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  placeholder="Client Name"
                  value={formData.nationality}
                  onChange={e => handleInputChange("nationality", e.target.value)}
                  className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={e => handleInputChange("email", e.target.value)}
                  className={`dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] ${
                    hasFieldError("email") ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {hasFieldError("email") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("email")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+97655555"
                  value={formData.phoneNumber}
                  onChange={e => handleInputChange("phoneNumber", e.target.value)}
                  className={`dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px] ${
                    hasFieldError("phoneNumber") ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {hasFieldError("phoneNumber") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("phoneNumber")}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Address Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="City, Country"
                    value={formData.country}
                    onChange={e => handleInputChange("country", e.target.value)}
                    className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    placeholder="City, Country"
                    value={formData.region}
                    onChange={e => handleInputChange("region", e.target.value)}
                    className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    placeholder="City, Country"
                    value={formData.area}
                    onChange={e => handleInputChange("area", e.target.value)}
                    className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullAddress">Full Address</Label>
                <Textarea
                  id="fullAddress"
                  placeholder="Complete business address including street, city, state, postal code, and country"
                  value={formData.fullAddress}
                  onChange={e => handleInputChange("fullAddress", e.target.value)}
                  rows={4}
                  className="resize-none dark:bg-[#0F1B29]  bg-[#F3F5F7] rounded-[12px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Profile */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Company Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="visionStatement">Vision Statement</Label>
                  <Textarea
                    id="visionStatement"
                    placeholder="Enter company vision statement"
                    value={formData.visionStatement}
                    onChange={e => handleInputChange("visionStatement", e.target.value)}
                    rows={4}
                    className="resize-none dark:bg-[#0F1B29]  bg-[#F3F5F7] rounded-[12px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="missionStatement">Mission Statement</Label>
                  <Textarea
                    id="missionStatement"
                    placeholder="Enter company mission statement"
                    value={formData.missionStatement}
                    onChange={e => handleInputChange("missionStatement", e.target.value)}
                    rows={4}
                    className="resize-none dark:bg-[#0F1B29]  bg-[#F3F5F7] rounded-[12px]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullAddress" className="dark:text-[#CCCFDB] text-[#303444]">
                  Upload Company Logo (Max size 5 Mb)
                </Label>
                <div className="relative">
                  <input
                    type="file"
                    id="fileUpload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <div className="dark:bg-[#0F1B29] py-4 bg-[#F3F5F7] rounded-[12px]  text-center hover:border-muted-foreground/50 transition-colors">
                    <div className="flex flex-col items-center space-y-2">
                      <Gallery
                        className="h-8 w-8 text-muted-foreground"
                        color={theme === "dark" ? "#CCCFDB" : "#303444"}
                      />
                      <div className="space-y-0">
                        <p className="text-lg font-[400] dark:text-[#CCCFDB] text-[#303444]">
                          Upload company Logo
                        </p>
                        <p className="text-muted-foreground">or drag and drop here</p>
                      </div>
                      {selectedFile && (
                        <p className="text-sm text-green-600 font-medium">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Products & Services</Label>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="space-y-3">
                      {productsServicesOptions.slice(0, 3).map(option => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <CheckboxSquare
                            id={option.id}
                            checked={
                              formData.productsServices[
                                option.id as keyof typeof formData.productsServices
                              ]
                            }
                            onCheckedChange={checked =>
                              handleProductsServicesChange(option.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={option.id} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {productsServicesOptions.slice(3, 6).map(option => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <CheckboxSquare
                            id={option.id}
                            checked={
                              formData.productsServices[
                                option.id as keyof typeof formData.productsServices
                              ]
                            }
                            onCheckedChange={checked =>
                              handleProductsServicesChange(option.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={option.id} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Accounts */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Social Media Accounts</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1st column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">Linkedin URL</Label>
                    <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2  shadow-sm bg-[#F3F5F7] rounded-[12px]">
                      <div className="bg-[#3072C014] rounded-full h-8 w-8 flex items-center justify-center p-1">
                        <svg
                          width="14"
                          height="13"
                          viewBox="0 0 14 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.31991 1.83333C3.31102 2.10889 3.23102 2.35778 3.07991 2.58C2.9288 2.80222 2.7288 2.96444 2.47991 3.06667C2.23102 3.16889 1.97325 3.19333 1.70658 3.14C1.43991 3.08667 1.21102 2.96222 1.01991 2.76667C0.828803 2.57111 0.711025 2.34 0.666581 2.07333C0.622136 1.80667 0.653247 1.54889 0.759914 1.3C0.866581 1.05111 1.03547 0.853333 1.26658 0.706666C1.49769 0.559999 1.75102 0.491111 2.02658 0.5C2.38214 0.508888 2.68658 0.642221 2.93991 0.9C3.19325 1.15778 3.31991 1.46889 3.31991 1.83333ZM3.35991 4.15333H0.693247V12.5H3.35991V4.15333ZM7.57325 4.15333H4.91991V12.5H7.54658V8.12667C7.54658 7.65556 7.65325 7.25556 7.86658 6.92667C8.07102 6.62444 8.33325 6.41556 8.65325 6.3C8.97325 6.18444 9.29325 6.17556 9.61325 6.27333C9.93325 6.37111 10.191 6.56667 10.3866 6.86C10.6088 7.19778 10.7199 7.62 10.7199 8.12667V12.5H13.3599V7.22C13.3599 6.43778 13.191 5.77556 12.8532 5.23333C12.5599 4.76222 12.151 4.40667 11.6266 4.16667C11.1466 3.96222 10.6266 3.87333 10.0666 3.9C9.52436 3.92667 9.02214 4.06222 8.55991 4.30667C8.09769 4.55111 7.75991 4.87333 7.54658 5.27333L7.57325 4.15333Z"
                            fill="#3072C0"
                          />
                        </svg>
                      </div>
                      <Input
                        id="linkedinUrl"
                        placeholder="https://linkedin.com/company/..."
                        value={formData.linkedinUrl}
                        onChange={e => handleInputChange("linkedinUrl", e.target.value)}
                        className="border-none shadow-none rounded-[12px] focus:outline-none  pl-0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebookUrl">Facebook URL</Label>
                    <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2  shadow-sm bg-[#F3F5F7] rounded-[12px]">
                      <div className="bg-[#3072C014] h-8 w-8 flex items-center justify-center rounded-full p-1">
                        <svg
                          width="8"
                          height="15"
                          viewBox="0 0 8 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.1735 8.49935H6.84017L7.50684 5.83268H5.1735V4.49935C5.1735 4.19713 5.18684 3.97935 5.2135 3.84601C5.26684 3.63268 5.38239 3.46824 5.56017 3.35268C5.7735 3.22824 6.08906 3.16602 6.50684 3.16602H7.50684V0.926015C7.35572 0.908237 7.11573 0.89046 6.78684 0.872682C6.37795 0.846015 5.98239 0.832682 5.60017 0.832682C4.98684 0.832682 4.44684 0.954905 3.98017 1.19935C3.5135 1.44379 3.15572 1.79268 2.90684 2.24602C2.64017 2.7349 2.50684 3.30824 2.50684 3.96602V5.83268H0.506836V8.49935H2.50684V14.166H5.1735V8.49935Z"
                            fill="#3072C0"
                          />
                        </svg>
                      </div>
                      <Input
                        id="facebookUrl"
                        placeholder="https://facebook.com/company/..."
                        value={formData.facebookUrl}
                        onChange={e => handleInputChange("facebookUrl", e.target.value)}
                        className="border-none shadow-none rounded-[12px] focus:outline-none  pl-0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtubeUrl">YouTube URL</Label>
                    <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2  shadow-sm bg-[#F3F5F7] rounded-[12px]">
                      <div className="bg-[#FF000014] rounded-full h-8 w-8 flex items-center justify-center p-1">
                        <svg
                          width="14"
                          height="11"
                          viewBox="0 0 14 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.4342 2.26696C13.2795 1.68878 12.8251 1.2344 12.2469 1.07963C11.2 0.798828 7.00008 0.798828 7.00008 0.798828C7.00008 0.798828 2.80022 0.798828 1.75329 1.07963C1.1751 1.2344 0.720732 1.68878 0.565959 2.26696C0.285156 3.31389 0.285156 5.49951 0.285156 5.49951C0.285156 5.49951 0.285156 7.68514 0.565959 8.73208C0.720732 9.31026 1.1751 9.76463 1.75329 9.91938C2.80022 10.2002 7.00008 10.2002 7.00008 10.2002C7.00008 10.2002 11.2 10.2002 12.2469 9.91938C12.8251 9.76463 13.2795 9.31026 13.4342 8.73208C13.7151 7.68514 13.7151 5.49951 13.7151 5.49951C13.7151 5.49951 13.7139 3.31389 13.4342 2.26696Z"
                            fill="#FF0000"
                          />
                          <path
                            d="M5.65576 7.51485L9.1448 5.5006L5.65576 3.48633V7.51485Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <Input
                        id="youtubeUrl"
                        placeholder="https://youtube.com/channel/..."
                        value={formData.youtubeUrl}
                        onChange={e => handleInputChange("youtubeUrl", e.target.value)}
                        className="border-none shadow-none rounded-[12px] focus:outline-none  pl-0"
                      />
                    </div>
                  </div>
                </div>
                {/* 2nd column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitterUrl">Twitter/X URL</Label>
                    <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2  shadow-sm bg-[#F3F5F7] rounded-[12px]">
                      <div className="bg-[#07091314] rounded-full h-8 w-8 flex items-center justify-center p-1">
                        <svg
                          width="14"
                          height="13"
                          viewBox="0 0 14 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.98667 8.27333L9.17334 12.5H13.84L8.60001 5.51333L12.96 0.5H11.1867L7.77334 4.42L4.84001 0.5H0.17334L5.17334 7.18L0.546673 12.5H2.30667L5.98667 8.27333ZM9.84001 11.1667L2.84001 1.83333H4.17334L11.1733 11.1667H9.84001Z"
                            fill={theme === "dark" ? "#F6FBFE" : "#070913"}
                          />
                        </svg>
                      </div>
                      <Input
                        id="twitterUrl"
                        placeholder="https://twitter.com/company"
                        value={formData.twitterUrl}
                        onChange={e => handleInputChange("twitterUrl", e.target.value)}
                        className="border-none shadow-none rounded-[12px] focus:outline-none  pl-0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebookUrl">Facebook URL</Label>
                    <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2  shadow-sm bg-[#F3F5F7] rounded-[12px]">
                      <div className="bg-[#3072C014] h-8 w-8 flex items-center justify-center rounded-full p-1">
                        <svg
                          width="8"
                          height="15"
                          viewBox="0 0 8 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.1735 8.49935H6.84017L7.50684 5.83268H5.1735V4.49935C5.1735 4.19713 5.18684 3.97935 5.2135 3.84601C5.26684 3.63268 5.38239 3.46824 5.56017 3.35268C5.7735 3.22824 6.08906 3.16602 6.50684 3.16602H7.50684V0.926015C7.35572 0.908237 7.11573 0.89046 6.78684 0.872682C6.37795 0.846015 5.98239 0.832682 5.60017 0.832682C4.98684 0.832682 4.44684 0.954905 3.98017 1.19935C3.5135 1.44379 3.15572 1.79268 2.90684 2.24602C2.64017 2.7349 2.50684 3.30824 2.50684 3.96602V5.83268H0.506836V8.49935H2.50684V14.166H5.1735V8.49935Z"
                            fill="#3072C0"
                          />
                        </svg>
                      </div>
                      <Input
                        id="instagramUrl"
                        placeholder="https://instagram.com/company"
                        value={formData.instagramUrl}
                        onChange={e => handleInputChange("instagramUrl", e.target.value)}
                        className="border-none shadow-none rounded-[12px] focus:outline-none  pl-0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Website URL</Label>
                    <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2  shadow-sm bg-[#F3F5F7] rounded-[12px]">
                      <div className=" h-8 w-8 flex items-center justify-center ">
                        <svg
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            opacity="0.4"
                            d="M7.65006 21.4098C7.62006 21.4098 7.58006 21.4298 7.55006 21.4298C5.61006 20.4698 4.03006 18.8798 3.06006 16.9398C3.06006 16.9098 3.08006 16.8698 3.08006 16.8398C4.30006 17.1998 5.56006 17.4698 6.81006 17.6798C7.03006 18.9398 7.29006 20.1898 7.65006 21.4098Z"
                            fill={theme === "dark" ? "#CCCFDB" : "#303444"}
                          />
                          <path
                            opacity="0.4"
                            d="M20.94 16.9498C19.95 18.9398 18.3 20.5498 16.29 21.5198C16.67 20.2498 16.99 18.9698 17.2 17.6798C18.46 17.4698 19.7 17.1998 20.92 16.8398C20.91 16.8798 20.94 16.9198 20.94 16.9498Z"
                            fill={theme === "dark" ? "#CCCFDB" : "#303444"}
                          />
                          <path
                            opacity="0.4"
                            d="M21.02 8.21047C19.76 7.83047 18.49 7.52047 17.2 7.30047C16.99 6.01047 16.68 4.73047 16.29 3.48047C18.36 4.47047 20.03 6.14047 21.02 8.21047Z"
                            fill={theme === "dark" ? "#CCCFDB" : "#303444"}
                          />
                          <path
                            opacity="0.4"
                            d="M7.64998 3.59055C7.28998 4.81055 7.02998 6.05055 6.81998 7.31055C5.52998 7.51055 4.24998 7.83055 2.97998 8.21055C3.94998 6.20055 5.55998 4.55055 7.54998 3.56055C7.57998 3.56055 7.61998 3.59055 7.64998 3.59055Z"
                            fill={theme === "dark" ? "#CCCFDB" : "#303444"}
                          />
                          <path
                            d="M15.4898 7.09C13.1698 6.83 10.8298 6.83 8.50977 7.09C8.75977 5.72 9.07977 4.35 9.52977 3.03C9.54977 2.95 9.53977 2.89 9.54977 2.81C10.3398 2.62 11.1498 2.5 11.9998 2.5C12.8398 2.5 13.6598 2.62 14.4398 2.81C14.4498 2.89 14.4498 2.95 14.4698 3.03C14.9198 4.36 15.2398 5.72 15.4898 7.09Z"
                            fill={theme === "dark" ? "#CCCFDB" : "#303444"}
                          />
                          <path
                            d="M6.59 15.9898C5.21 15.7398 3.85 15.4198 2.53 14.9698C2.45 14.9498 2.39 14.9598 2.31 14.9498C2.12 14.1598 2 13.3498 2 12.4998C2 11.6598 2.12 10.8398 2.31 10.0598C2.39 10.0498 2.45 10.0498 2.53 10.0298C3.86 9.58977 5.21 9.25977 6.59 9.00977C6.34 11.3298 6.34 13.6698 6.59 15.9898Z"
                            fill={theme === "dark" ? "#CCCFDB" : "#303444"}
                          />
                          <path
                            d="M22.0002 12.4998C22.0002 13.3498 21.8802 14.1598 21.6902 14.9498C21.6102 14.9598 21.5502 14.9498 21.4702 14.9698C20.1402 15.4098 18.7802 15.7398 17.4102 15.9898C17.6702 13.6698 17.6702 11.3298 17.4102 9.00977C18.7802 9.25977 20.1502 9.57977 21.4702 10.0298C21.5502 10.0498 21.6102 10.0598 21.6902 10.0598C21.8802 10.8498 22.0002 11.6598 22.0002 12.4998Z"
                            fill={theme === "dark" ? "#CCCFDB" : "#303444"}
                          />
                          <path
                            d="M15.4898 17.9102C15.2398 19.2902 14.9198 20.6502 14.4698 21.9702C14.4498 22.0502 14.4498 22.1102 14.4398 22.1902C13.6598 22.3802 12.8398 22.5002 11.9998 22.5002C11.1498 22.5002 10.3398 22.3802 9.54977 22.1902C9.53977 22.1102 9.54977 22.0502 9.52977 21.9702C9.08977 20.6402 8.75977 19.2902 8.50977 17.9102C9.66977 18.0402 10.8298 18.1302 11.9998 18.1302C13.1698 18.1302 14.3398 18.0402 15.4898 17.9102Z"
                            fill={theme === "dark" ? "#CCCFDB" : "#303444"}
                          />
                          <path
                            d="M15.7633 16.2633C13.2622 16.5789 10.7378 16.5789 8.23667 16.2633C7.92111 13.7622 7.92111 11.2378 8.23667 8.73667C10.7378 8.42111 13.2622 8.42111 15.7633 8.73667C16.0789 11.2378 16.0789 13.7622 15.7633 16.2633Z"
                            fill={theme === "dark" ? "#CCCFDB" : "#303444"}
                          />
                        </svg>
                      </div>
                      <Input
                        id="websiteUrl"
                        placeholder="https://company.com"
                        value={formData.websiteUrl}
                        onChange={e => handleInputChange("websiteUrl", e.target.value)}
                        className="border-none shadow-none rounded-[12px] focus:outline-none  pl-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 hover:bg-[#c2d6ee] transition-all cursor-pointer w-fit py-4 px-6 bg-[#3072C014] border border-[#3072C0] rounded-[16px]">
                <CirclePlus color="#3072C0" size={20} />
                <span className="text-[#3072C0] text-[16px] font-medium">Add Another Platform</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Assignment */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Team Assignment</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="leadSource">Lead Source</Label>
                  <Select
                    value={formData.leadSource}
                    onValueChange={value => handleInputChange("leadSource", value)}
                  >
                    <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                      <SelectValue placeholder="Select Lead Source" />
                    </SelectTrigger>
                    <SelectContent>
                      {leadSourceOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Assigned To</Label>
                  <Select
                    value={formData.assignedTo}
                    onValueChange={value => handleInputChange("assignedTo", value)}
                  >
                    <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                      <SelectValue placeholder="Select Assigned To" />
                    </SelectTrigger>

                    <SelectContent>
                      {additionalTeamMembersOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullAddress" className="dark:text-[#CCCFDB] text-[#303444]">
                  Upload Company Logo (Max size 5 Mb)
                </Label>
                <div className="relative">
                  <input
                    type="file"
                    id="fileUpload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <div className="dark:bg-[#0F1B29] py-4 bg-[#F3F5F7] rounded-[12px]  text-center hover:border-muted-foreground/50 transition-colors">
                    <div className="flex flex-col items-center space-y-2">
                      <Gallery
                        className="h-8 w-8 text-muted-foreground"
                        color={theme === "dark" ? "#CCCFDB" : "#303444"}
                      />
                      <div className="space-y-0">
                        <p className="text-lg font-[400] dark:text-[#CCCFDB] text-[#303444]">
                          Upload company Logo
                        </p>
                        <p className="text-muted-foreground">or drag and drop here</p>
                      </div>
                      {selectedFile && (
                        <p className="text-sm text-green-600 font-medium">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Additional Team Members</Label>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="space-y-3">
                      {additionalTeamMembersOptions.slice(0, 4).map(option => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <CheckboxSquare
                            id={option.id}
                            checked={
                              formData.additionalTeamMembers[
                                option.id as keyof typeof formData.additionalTeamMembers
                              ]
                            }
                            onCheckedChange={checked =>
                              handleAdditionalTeamMembersChange(option.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={option.id} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {additionalTeamMembersOptions.slice(4, 7).map(option => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <CheckboxSquare
                            id={option.id}
                            checked={
                              formData.additionalTeamMembers[
                                option.id as keyof typeof formData.additionalTeamMembers
                              ]
                            }
                            onCheckedChange={checked =>
                              handleAdditionalTeamMembersChange(option.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={option.id} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">
              Additional Notes (For Internal Use By The Marketing Team)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Add Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Add Notes"
                  value={formData.additionalNotes}
                  onChange={e => handleInputChange("additionalNotes", e.target.value)}
                  rows={4}
                  className="resize-none dark:bg-[#0F1B29]  bg-[#F3F5F7] rounded-[12px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditLeadPage;
