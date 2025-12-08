"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";





import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CalendarIcon from "@/components/ui/icons/options/calendar-icon";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  getClientBusinessMaturity,
  getClientIndustries,
  getClientLanguages,
  getClientMartketRegions,
  getClientServiceOffers,
  getClientTargetAudiences,
  getClientTeamRoles,
  type ResponseT,
} from "@/lib/api/client/client";
import { getDepartments, BackendDepartment } from "@/lib/api/departments";
import { getLeadsLookup, getCitiesByCountry, getAreasByCity, Country, City, Area } from "@/lib/api/leads";
import { getUsers, type IUser } from "@/lib/api/user";
import {
  companySizeOptions,
  createClientSchema,
  type CreateClientFormData,
} from "@/lib/validations/client";

import Facebook from "../ui/icons/socials/fb";
import Instagram from "../ui/icons/socials/instagram";
import Linkedin from "../ui/icons/socials/linkedin";
import Twitter from "../ui/icons/socials/twitterx";
import Website from "../ui/icons/socials/website";


interface ClientFormProps {
  initialData?: CreateClientFormData;
  onSubmit: (data: CreateClientFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  readOnly?: boolean;
  companySizes?: ResponseT[];
}

const defaultFormData: CreateClientFormData = {
  // Basic Information
  fullName: "",
  industry: "technology",
  businessOverview: "",
  email: "",
  companySize: "0-50",
  // Contact
  contactName: "",
  jobTitle: "",
  phoneNumber: "",
  location: "",
  fullAddress: "",
  linkedinProfile: "",
  department: "",

  // Agreement information
  accountManager: "",
  clientSince: new Date(),
  agreementStartDate: new Date(),
  agreementEndDate: new Date(),


  clientStatus: "active", // default from enum: active | inactive | Pending | Suspended
  monthlyBudget: "0",
  priorityLevel: "low", // default from enum: low | medium | high

  // Website
  websiteUrl: "",

  // Notes
  internalNotes: "",

  // New Fields
  primaryMarketRegionId: "",
  secondaryMarketIds: [],
  targetAudienceId: "",
  languagesSupported: [],
  serviceOfferingIds: [],
  assignedUserIds: [],
  teamRoleIds: [],
  visionStatement: "",
  missionStatement: "",
  businessMaturity: "",
};

const ClientForm = ({
  initialData,
  onSubmit,
  onCancel: _onCancel,
  isSubmitting: _isSubmitting,
  mode: _mode,
  readOnly,
  companySizes,
}: ClientFormProps) => {
  const { theme } = useTheme();
  const form = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: initialData || defaultFormData,
    mode: "onChange",
  });

  // Fetch users for account manager dropdown
  const { data: users = [], isLoading: loadingUsers } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getUsers();
      return response.data || [];
    },
  });

  const { data: departmentsResponse, isLoading: loadingDepartments } = useQuery<{ data: BackendDepartment[] | null }>({
    queryKey: ["utils", "departments"],
    queryFn: getDepartments,
  });
  const departments = departmentsResponse?.data || [];

  const { data: countries = [], isLoading: loadingCountries } = useQuery<Country[]>({
    queryKey: ["leads", "countries"],
    queryFn: () => getLeadsLookup<Country>("countries"),
  });
  const countryId = form.watch("country");

  const { data: cities = [], isLoading: loadingCities } = useQuery<City[]>({
    queryKey: ["leads", "cities", countryId],
    queryFn: () => getCitiesByCountry(countryId || ""),
    enabled: !!countryId,
  });
  const cityId = form.watch("city");

  const { data: areas = [], isLoading: loadingAreas } = useQuery<Area[]>({
    queryKey: ["leads", "areas", cityId],
    queryFn: () => getAreasByCity(cityId || ""),
    enabled: !!cityId,
  });

  const filteredCities = cities;
  const filteredAreas = areas;

  // Fetch Lookups
  const { data: industries = [] } = useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const res = await getClientIndustries();
      return res || [];
    },
  });

  const { data: marketRegions = [] } = useQuery({
    queryKey: ["marketRegions"],
    queryFn: async () => {
      const res = await getClientMartketRegions();
      return res || [];
    },
  });

  const { data: targetAudiences = [] } = useQuery({
    queryKey: ["targetAudiences"],
    queryFn: async () => {
      const res = await getClientTargetAudiences();
      return res || [];
    },
  });

  const { data: languages = [] } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const res = await getClientLanguages();
      return res || [];
    },
  });

  const { data: serviceOfferings = [] } = useQuery({
    queryKey: ["serviceOfferings"],
    queryFn: async () => {
      const res = await getClientServiceOffers();
      return res || [];
    },
  });

  const { data: teamRoles = [] } = useQuery({
    queryKey: ["teamRoles"],
    queryFn: async () => {
      const res = await getClientTeamRoles();
      return res || [];
    },
  });

  const { data: businessMaturityOptions = [] } = useQuery({
    queryKey: ["businessMaturity"],
    queryFn: async () => {
      const res = await getClientBusinessMaturity();
      return res || [];
    },
  });

  const handleStartDateClick = () => {
    const input = document.getElementById("date-start") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  const handleEndDateClick = () => {
    const input = document.getElementById("date-end") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  const handleClientSinceDate = () => {
    const input = document.getElementById("date-client-since") as HTMLInputElement & {
      showPicker?: () => void;
    };
    input?.showPicker?.();
  };

  const handleError = (error: any) => {
    console.error("Error submitting form:", error);
  };

  return (
    <Form {...form}>
      <form
        id="lead-form"
        onSubmit={form.handleSubmit(onSubmit, handleError)}
        className="w-full mx-auto space-y-4 font-inter"
      >
        <fieldset disabled={readOnly} className="contents">
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
                    <FormLabel>Client Name</FormLabel>
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
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry Sector</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                          <SelectValue placeholder="Select industry sector" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map(option => (
                            <SelectItem key={option.id} value={option.id || ""}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes && companySizes.length > 0 ? (
                            companySizes.map((option) => (
                              <SelectItem key={option.id || option.name} value={option.name || ""}>
                                {option.name}
                              </SelectItem>
                            ))
                          ) : (
                            companySizeOptions.map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessMaturity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Maturity</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                          <SelectValue placeholder="Select business maturity" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessMaturityOptions.map(option => (
                            <SelectItem key={option.id} value={option.id || ""}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primaryMarketRegionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Market Region</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                          <SelectValue placeholder="Select primary market region" />
                        </SelectTrigger>
                        <SelectContent>
                          {marketRegions.map(option => (
                            <SelectItem key={option.id} value={option.id || ""}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudienceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                        <SelectContent>
                          {targetAudiences.map(option => (
                            <SelectItem key={option.id} value={option.id || ""}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="languagesSupported"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Languages Supported</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.[0] || ""}
                        onValueChange={(val) => {
                           field.onChange([val]);
                        }}
                      >
                        <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                          <SelectValue placeholder="Select languages" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((option) => (
                            <SelectItem key={option.code} value={option.code || ""}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="businessOverview"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Business Overview</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief overview of the business..."
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

        {/* Social Media Accounts */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Social Media Accounts</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="linkedinProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                          <div className="bg-[#3072C014] rounded-full h-8 w-8 flex items-center justify-center p-1">
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
                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                          <div className="bg-[#3072C014] h-8 w-8 flex items-center justify-center rounded-full p-1">
                            <Facebook />
                          </div>
                          <Input
                            placeholder="https://facebook.com/company"
                            {...field}
                            value={field.value?.toString() ?? ""}
                            className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="twitterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter URL</FormLabel>
                      <FormControl>
                        <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                          <div className="bg-[#07091314] rounded-full h-8 w-8 flex items-center justify-center p-1">
                            <Twitter />
                          </div>
                          <Input
                            placeholder="https://twitter.com/company"
                            {...field}
                            value={field.value?.toString() ?? ""}
                            className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                          <div className="bg-[#3072C014] h-8 w-8 flex items-center justify-center rounded-full p-1">
                            <Instagram />
                          </div>
                          <Input
                            placeholder="https://instagram.com/company"
                            {...field}
                            value={field.value?.toString() ?? ""}
                            className="border-none shadow-none rounded-[12px] focus:outline-none pl-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <div className="flex pl-4 items-center gap-2 dark:bg-[#0F1B29] py-2 shadow-sm bg-[#F3F5F7] rounded-[12px]">
                          <div className="h-8 w-8 flex items-center justify-center">
                            <Website />
                          </div>
                          <Input
                            placeholder="https://company.com"
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
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("city", "");
                          }}
                          disabled={loadingCountries}
                        >
                          <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                            <SelectValue placeholder={loadingCountries ? "Loading..." : "Select Country"} />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("area", "");
                          }}
                          disabled={loadingCities || !countryId}
                        >
                          <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                            <SelectValue placeholder={loadingCities ? "Loading..." : !countryId ? "Select Country first" : "Select City"} />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredCities.length === 0 ? (
                              <SelectItem value="no city" disabled>No cities available</SelectItem>
                            ) : (
                              filteredCities.map((r) => (
                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
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
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loadingAreas || !cityId}
                        >
                          <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                            <SelectValue placeholder={loadingAreas ? "Loading..." : !cityId ? "Select City first" : "Select Area"} />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredAreas.map((a) => (
                              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
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
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Company Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="visionStatement"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Vision Statement</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Vision Statement"
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
                  <FormItem className="col-span-2">
                    <FormLabel>Mission Statement</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mission Statement"
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

        {/* Contact Information */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Primary Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Michael Ro"
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
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Michael Ro"
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


              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={loadingDepartments}
                      >
                        <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                          <SelectValue placeholder={loadingDepartments ? "Loading..." : "Select Department"} />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
            <CardTitle className="text-lg font-medium mb-3">Agreement Information</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="sm:col-span-3 grid sm:grid-cols-3 gap-3 grid-cols-1 font-medium text-md">
              <FormField
                control={form.control}
                name="agreementStartDate"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          id="date-start"
                          type="date"
                          value={value ? new Date(value).toISOString().split("T")[0] : ""}
                          onChange={e => {
                            const date = new Date(e.target.value);
                            onChange(date);
                          }}
                          className="
                    dark:bg-[#0F1B29] bg-[#F3F5F7] p-6
                      pr-10
                      [&::-webkit-calendar-picker-indicator]:opacity-0 
                      [&::-webkit-calendar-picker-indicator]:absolute 
                      [&::-webkit-calendar-picker-indicator]:w-full 
                      [&::-webkit-calendar-picker-indicator]:h-full
                    "
                        />

                        <button
                          type="button"
                          onClick={handleStartDateClick}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreementEndDate"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          id="date-end"
                          type="date"
                          value={value ? new Date(value).toISOString().split("T")[0] : ""}
                          onChange={e => {
                            const date = new Date(e.target.value);
                            onChange(date);
                          }}
                          min={
                            form.getValues().agreementStartDate
                              ? new Date(form.getValues().agreementStartDate)
                                .toISOString()
                                .split("T")[0]
                              : undefined
                          }
                          {...field}
                          className="
                    dark:bg-[#0F1B29] bg-[#F3F5F7] p-6
                      pr-10
                      [&::-webkit-calendar-picker-indicator]:opacity-0 
                      [&::-webkit-calendar-picker-indicator]:absolute 
                      [&::-webkit-calendar-picker-indicator]:w-full 
                      [&::-webkit-calendar-picker-indicator]:h-full
                    "
                        />

                        <button
                          type="button"
                          onClick={handleEndDateClick}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="pt-3 rounded-[16px] shadow-none ">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Account Management </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="accountManager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Manager</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || "none"}
                          onValueChange={(value) => {
                            field.onChange(value === "none" ? "" : value);
                          }}
                          disabled={loadingUsers}
                        >
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select account manager"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignedUserIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Users</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.[0] || ""}
                          onValueChange={(val) => {
                             // Simple single select for now as UI component for multi-select is complex
                             // Ideally this should be a MultiSelect component
                             field.onChange([val]);
                          }}
                        >
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select assigned users" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceOfferingIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Offerings</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.[0] || ""}
                           onValueChange={(val) => {
                             field.onChange([val]);
                          }}
                        >
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select service offerings" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceOfferings.map((option) => (
                              <SelectItem key={option.id} value={option.id || ""}>
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamRoleIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Roles</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.[0] || ""}
                           onValueChange={(val) => {
                             field.onChange([val]);
                          }}
                        >
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select team roles" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamRoles.map((option) => (
                              <SelectItem key={option.id} value={option.id || ""}>
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientSince"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Client Since *</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            id="date-client-since"
                            type="date"
                            value={value ? new Date(value).toISOString().split("T")[0] : ""}
                            onChange={e => {
                              const date = new Date(e.target.value);
                              onChange(date);
                            }}
                            {...field}
                            className="
                    dark:bg-[#0F1B29] bg-[#F3F5F7] p-6
                      pr-10
                      [&::-webkit-calendar-picker-indicator]:opacity-0 
                      [&::-webkit-calendar-picker-indicator]:absolute 
                      [&::-webkit-calendar-picker-indicator]:w-full 
                      [&::-webkit-calendar-picker-indicator]:h-full
                    "
                          />

                          <button
                            type="button"
                            onClick={handleClientSinceDate}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            <CalendarIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientStatus"
                  render={({ field }) => (
                    <FormItem className="space-y-3 col-span-2">
                      <FormLabel>Client Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex sm:flex-row flex-col sm:px-5 md:px-6 px-3 sm:gap-12 gap-2"
                        >
                          <FormItem className="flex items-start space-x-2 space-y-0">
                            <FormControl className="mt-1">
                              <RadioGroupItem
                                value="active"
                                className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                              />
                            </FormControl>
                            <div className="font-normal flex flex-col">
                              <p>Active</p>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-start space-x-2 space-y-0">
                            <FormControl className="mt-1">
                              <RadioGroupItem
                                value="inactive"
                                className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                              />
                            </FormControl>
                            <div className="font-normal flex flex-col">
                              <p>Inactive</p>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-start space-x-2 space-y-0">
                            <FormControl className="mt-1">
                              <RadioGroupItem
                                value="pending"
                                className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                              />
                            </FormControl>
                            <div className="font-normal flex flex-col">
                              <p>Pending</p>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-start space-x-2 space-y-0">
                            <FormControl className="mt-1">
                              <RadioGroupItem
                                value="suspended"
                                className="text-[#3072C0] data-[state=checked]:border-[#3072C0]"
                              />
                            </FormControl>
                            <div className="font-normal flex flex-col">
                              <p>Suspended</p>
                            </div>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Budget</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="15000"
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
                  name="priorityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority Level</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="dark:bg-[#0F1B29] py-6 bg-[#F3F5F7] rounded-[12px]">
                            <SelectValue placeholder="Select campaign type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="medium">Medium Priority</SelectItem>
                            <SelectItem value="low">Low Priority</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="internalNotes"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Internal Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Key client with strong ROI performance. Prefers monthly reporting and quarterly strategy reviews. Very responsive to email communications."
                          className="dark:bg-[#0F1B29] py-6 pt-2 bg-[#F3F5F7] rounded-[12px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        </fieldset>
      </form>
    </Form>
  );
};

export default ClientForm;
