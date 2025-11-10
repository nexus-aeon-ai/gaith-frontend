"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "lucide-react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Gallery from "@/components/ui/icons/options/gallery";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createLeadSchema, type CreateLeadFormData } from "@/lib/validations/lead";

import Fb from "../ui/icons/socials/fb";
import Linkedin from "../ui/icons/socials/linkedin";
import Twitterx from "../ui/icons/socials/twitterx";
import Website from "../ui/icons/socials/website";
import Youtube from "../ui/icons/socials/youtube";

interface LeadFormProps {
  initialData?: CreateLeadFormData;
  onSubmit: (data: CreateLeadFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const defaultFormData: CreateLeadFormData = {
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
};

const additionalTeamMembersOptions = [
  { id: "creative-director", label: "Creative Director", value: "creative-director" },
  { id: "social-media-manager", label: "Social Media Manager", value: "social-media-manager" },
  { id: "ux-researcher", label: "UX Researcher", value: "ux-researcher" },
  { id: "web-developer", label: "Web Developer", value: "web-developer" },
  { id: "content-writer", label: "Content Writer", value: "content-writer" },
  { id: "graphic-designer", label: "Graphic Designer", value: "graphic-designer" },
  { id: "seo-specialist", label: "SEO Specialist", value: "seo-specialist" },
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

const LeadForm = ({ initialData, onSubmit }: LeadFormProps) => {
  const { theme } = useTheme();

  const form = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: initialData || defaultFormData,
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form
        id="lead-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mx-auto space-y-4"
      >
        {/* Basic Information */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Client Name"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Client Nationality"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email Address"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+97655555"
                        className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Country"
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Region"
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="City, Country"
                          className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="fullAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Street Address, City, State, Zip Code"
                        className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                <FormField
                  control={form.control}
                  name="visionStatement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vision Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Street Address, City, State, Zip Code"
                          className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="missionStatement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mission Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Street Address, City, State, Zip Code"
                          className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="companyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#CCCFDB] text-[#303444]">
                      Upload Company Logo (Max size 5 Mb)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="file"
                          id="fileUpload"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file); // push file into RHF
                            }
                          }}
                        />
                        <div className="dark:bg-[#0F1B29] py-4 bg-[#F3F5F7] rounded-[12px] text-center hover:border-muted-foreground/50 transition-colors">
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
                            {field.value && (
                              <p className="text-sm text-green-600 font-medium">
                                Selected: {(field.value as File).name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Accounts */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Social Media Accounts</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                  {/* LinkedIn */}
                  <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                            <div className="bg-[#3072C014] rounded-full h-8 w-8 flex items-center justify-center p-1">
                              {/* LinkedIn SVG */}
                              <Linkedin />
                            </div>
                            <Input
                              placeholder="https://linkedin.com/company/..."
                              {...field}
                              className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Facebook */}
                  <FormField
                    control={form.control}
                    name="facebookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook URL</FormLabel>
                        <FormControl>
                          <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                            <div className="bg-[#3072C014] h-8 w-8 flex items-center justify-center rounded-full p-1">
                              {/* Facebook SVG */}
                              <Fb />
                            </div>
                            <Input
                              placeholder="https://facebook.com/company/..."
                              {...field}
                              className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* YouTube */}
                  <FormField
                    control={form.control}
                    name="youtubeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube URL</FormLabel>
                        <FormControl>
                          <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                            <div className="bg-[#FF000014] rounded-full h-8 w-8 flex items-center justify-center p-1">
                              {/* YouTube SVG */}
                              <Youtube />
                            </div>
                            <Input
                              placeholder="https://youtube.com/channel/..."
                              {...field}
                              className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  {/* Twitter/X */}
                  <FormField
                    control={form.control}
                    name="twitterUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter/X URL</FormLabel>
                        <FormControl>
                          <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                            <div className="bg-[#07091314] rounded-full h-8 w-8 flex items-center justify-center p-1">
                              {/* Twitter SVG */}
                              <Twitterx />
                            </div>
                            <Input
                              placeholder="https://twitter.com/company"
                              {...field}
                              className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Instagram */}
                  <FormField
                    control={form.control}
                    name="instagramUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram URL</FormLabel>
                        <FormControl>
                          <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                            <div className="bg-[#3072C014] h-8 w-8 flex items-center justify-center rounded-full p-1">
                              {/* Reuse Facebook SVG for demo */}
                              <Fb />
                            </div>
                            <Input
                              placeholder="https://instagram.com/company"
                              {...field}
                              className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Website */}
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                            <div className="h-8 w-8 flex items-center justify-center">
                              {/* Website SVG */}
                              <Website />
                            </div>
                            <Input
                              placeholder="https://company.com"
                              required={false}
                              {...field}
                              className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Add Another Platform button */}
              <div className="flex items-center gap-2 hover:bg-[#c2d6ee] transition-all cursor-pointer w-fit py-4 px-6 bg-[#3072C014] border border-[#3072C0] rounded-[16px]">
                <CirclePlus color="#3072C0" size={20} />
                <span className="text-[#3072C0] text-[16px] font-medium">Add Another Platform</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Assignment */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Team Assignment</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lead Source */}
                <FormField
                  control={form.control}
                  name="leadSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Source</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                            <SelectValue placeholder="Select Lead Source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {leadSourceOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Assigned To */}
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                            <SelectValue placeholder="Select Assigned To" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {additionalTeamMembersOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Upload Logo */}
              <FormField
                control={form.control}
                name="companyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#CCCFDB] text-[#303444]">
                      Upload Company Logo (Max size 5 Mb)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="file"
                          id="fileUpload"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={e => field.onChange(e.target.files?.[0])}
                        />
                        <div className="dark:bg-[#0F1B29] py-4 bg-[#F3F5F7] rounded-[12px] text-center hover:border-muted-foreground/50 transition-colors">
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
                            {field.value && (
                              <p className="text-sm text-green-600 font-medium">
                                Selected: {field.value?.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Team Members */}
              <FormField
                control={form.control}
                name="additionalTeamMembers"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Additional Team Members</FormLabel>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="space-y-3">
                        {additionalTeamMembersOptions.slice(0, 4).map(option => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name={`additionalTeamMembers.${option.id}`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-2">
                                <FormControl>
                                  <CheckboxSquare
                                    id={option.id}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel htmlFor={option.id} className="text-sm">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <div className="space-y-3">
                        {additionalTeamMembersOptions.slice(4, 7).map(option => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name={`additionalTeamMembers.${option.id}`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-2">
                                <FormControl>
                                  <CheckboxSquare
                                    id={option.id}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel htmlFor={option.id} className="text-sm">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">
              Additional Notes (For Internal Use By The Marketing Team)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="additionalNotes">Add Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        id="additionalNotes"
                        placeholder="Add Notes"
                        rows={4}
                        className="resize-none dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default LeadForm;
