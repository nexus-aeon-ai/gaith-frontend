"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
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
import {
  Area,
  Country,
  LeadSource,
  ProductService,
  Region,
  TeamRole,
  UtilsRole,
  getLeadsLookup,
  getUtilsRoles,
} from "@/lib/api/leads";
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
  leadSource: "",
  assignedTo: "",
  visionStatement: "",
  missionStatement: "",
  linkedinUrl: "",
  facebookUrl: "",
  youtubeUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  websiteUrl: "",
  additionalNotes: "",
  productServiceIds: [],
  teamRoleIds: [],
};

const LeadForm = ({ initialData, onSubmit }: LeadFormProps) => {
  const { theme } = useTheme();

  const form = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: initialData || defaultFormData,
    mode: "onChange",
  });

  const { data: countries = [], isLoading: loadingCountries } = useQuery<Country[]>({
    queryKey: ["leads", "countries"],
    queryFn: () => getLeadsLookup<Country>("countries"),
  });
  const countryId = form.watch("country");
  const { data: regions = [], isLoading: loadingRegions } = useQuery<Region[]>({
    queryKey: ["leads", "regions", countryId],
    queryFn: () => getLeadsLookup<Region>("regions"),
    enabled: !!countryId,
  });
  const regionId = form.watch("region");
  const { data: areas = [], isLoading: loadingAreas } = useQuery<Area[]>({
    queryKey: ["leads", "areas", regionId],
    queryFn: () => getLeadsLookup<Area>("areas"),
    enabled: !!regionId,
  });
  const { data: productServices = [], isLoading: loadingProductServices } = useQuery<
    ProductService[]
  >({
    queryKey: ["leads", "product-services"],
    queryFn: () => getLeadsLookup<ProductService>("product-services"),
  });
  const { data: leadSources = [], isLoading: loadingLeadSources } = useQuery<LeadSource[]>({
    queryKey: ["leads", "lead-sources"],
    queryFn: () => getLeadsLookup<LeadSource>("lead-sources"),
  });
  const { data: teamRoles = [], isLoading: loadingTeamRoles } = useQuery<TeamRole[]>({
    queryKey: ["leads", "team-roles"],
    queryFn: () => getLeadsLookup<TeamRole>("team-roles"),
  });
  const { data: assignedRoles = [], isLoading: loadingAssignedRoles } = useQuery<UtilsRole[]>({
    queryKey: ["utils", "roles"],
    queryFn: getUtilsRoles,
  });

  const selectedProductServiceIds = (form.watch("productServiceIds") || []) as string[];
  const selectedTeamRoleIds = (form.watch("teamRoleIds") || []) as string[];

  const filteredRegions = regions.filter(r => r.countryId === countryId);
  const filteredAreas = areas.filter(a => a.regionId === regionId);

  if(loadingProductServices || loadingCountries || loadingRegions || loadingAreas || loadingLeadSources || loadingTeamRoles || loadingAssignedRoles) {
    return <div>Loading form data...</div>;
  }

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
                {/* Country, Region, Area selects (with filtering) */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={val => {
                            field.onChange(val);
                            form.setValue("region", "");
                            form.setValue("area", "");
                          }}
                          disabled={loadingCountries}
                        >
                          <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                            <SelectValue
                              placeholder={loadingCountries ? "Loading..." : "Select Country"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map(c => (
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
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={val => {
                            field.onChange(val);
                            form.setValue("area", "");
                          }}
                          disabled={loadingRegions || !countryId}
                        >
                          <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                            <SelectValue
                              placeholder={
                                loadingRegions
                                  ? "Loading..."
                                  : !countryId
                                  ? "Select Country first"
                                  : "Select Region"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredRegions.map(r => (
                              <SelectItem key={r.id} value={r.id}>
                                {r.name}
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
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loadingAreas || !regionId}
                        >
                          <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                            <SelectValue
                              placeholder={
                                loadingAreas
                                  ? "Loading..."
                                  : !regionId
                                  ? "Select Region first"
                                  : "Select Area"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredAreas.map(a => (
                              <SelectItem key={a.id} value={a.id}>
                                {a.name}
                              </SelectItem>
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

        {/* Product Services Multiselect */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Product Services</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <FormField
              control={form.control}
              name="productServiceIds"
              render={() => (
                <FormItem>
                  <div className="flex flex-wrap gap-4">
                    {productServices.map(ps => (
                      <label key={ps.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          disabled={loadingProductServices}
                          checked={selectedProductServiceIds.includes(ps.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              form.setValue("productServiceIds", [
                                ...selectedProductServiceIds,
                                ps.id,
                              ]);
                            } else {
                              form.setValue(
                                "productServiceIds",
                                selectedProductServiceIds.filter((id: string) => id !== ps.id),
                              );
                            }
                          }}
                        />
                        <span>{ps.name}</span>
                      </label>
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Lead Source Select */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Lead Source</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <FormField
              control={form.control}
              name="leadSource"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loadingLeadSources}
                    >
                      <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                        <SelectValue
                          placeholder={loadingLeadSources ? "Loading..." : "Select Lead Source"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {leadSources.map(source => (
                          <SelectItem key={source.id} value={source.id}>
                            {source.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Assigned To role select using /utils/roles */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Assigned To (Role)</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loadingAssignedRoles}
                  >
                    <SelectTrigger className="dark:bg-[#0F1B29] bg-[#F3F5F7] rounded-[12px] py-6">
                      <SelectValue
                        placeholder={loadingAssignedRoles ? "Loading..." : "Select Role"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {assignedRoles.map(role => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Additional Team Members field, now with teamRoles as source */}
        <Card className="pt-3 rounded-[16px] shadow-none">
          <CardHeader className="px-3">
            <CardTitle className="text-lg font-medium">Additional Team Members</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <FormField
              control={form.control}
              name="teamRoleIds"
              render={() => (
                <FormItem>
                  <div className="flex flex-wrap gap-4">
                    {teamRoles.map(role => (
                      <label key={role.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          disabled={loadingTeamRoles}
                          checked={selectedTeamRoleIds.includes(role.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              form.setValue("teamRoleIds", [...selectedTeamRoleIds, role.id]);
                            } else {
                              form.setValue(
                                "teamRoleIds",
                                selectedTeamRoleIds.filter((id: string) => id !== role.id),
                              );
                            }
                          }}
                        />
                        <span>{role.name}</span>
                      </label>
                    ))}
                  </div>
                </FormItem>
              )}
            />
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
