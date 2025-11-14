"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import PDFIcon from "@/components/ui/icons/options/pdf-icon";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "../../lib/utils";
import { Separator } from "../ui/separator";

export default function GeneratedAssetsSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("general");
  const defaultTab = "Pricing & Scope";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] bg-card font-inter w-auto sm:min-w-[640px] overflow-y-auto rounded-l-[16px] overflow-x-hidden">
        <SheetHeader className="flex border-b flex-row items-center justify-between space-y-0 pb-4">
          <SheetTitle className="text-lg font-medium">Generated Marketing Assets</SheetTitle>
        </SheetHeader>
        <div className="w-full px-2">
          <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList
              aria-label="Settings sections"
              className={cn(
                "w-full gap-0 h-auto",
                "rounded-t-xl rounded-b-none border bg-card ",
                "p-0 overflow-hidden mt-3",
              )}
            >
              {["Pricing & Scope", "Social Calendar", "Design & Strategy"].map(value => {
                return (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className={cn(
                      "group relative flex-1 py-4",
                      "data-[state=active]:bg-secondary data-[state=active]:text-foreground",
                      "data-[state=active]:shadow-sm",
                      "data-[state=active]:border data-[state=active]:border-border",
                      "after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:rounded-full after:bg-transparent",
                      "data-[state=active]:after:bg-[#3072C0]",
                      "rounded-none px-3",
                      "text-sm text-muted-foreground",
                      "hover:text-foreground hover:bg-secondary/80 transition-all duration-200",
                    )}
                  >
                    <span className="text-pretty">{value}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent className="m-2 mx-0 space-y-2" value="Pricing & Scope">
              <div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg p-2 px-3 bg-[#F3F5F7] dark:bg-[#0F1B29]">
                <h3 className="pb-2">Service Package Pricing</h3>
                <Separator />
                <div className="flex flex-col pt-2">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-muted-foreground">Digital Marketing Package</p>
                    <p>$15,000/month</p>
                  </div>
                  <Separator />
                </div>
                <div className="flex flex-col pt-2">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-muted-foreground">Social Media Management</p>
                    <p>$15,000/month</p>
                  </div>
                  <Separator />
                </div>
                <div className="flex flex-col pt-2">
                  <div className="flex items-center justify-between pb-1">
                    <p className="text-muted-foreground">Social Media Management</p>
                    <p>$15,000/month</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg p-2 px-3 bg-[#F3F5F7] dark:bg-[#0F1B29]">
                <h3 className="pb-2">Scope of Work</h3>
                <Separator />
                <h3 className="py-2">Comprehensive digital marketing services including:</h3>

                <ul className="list-disc pl-6 text-muted-foreground pb-1">
                  <li>Strategy development and implementation</li>
                  <li>Content creation and curation</li>
                  <li>Social media management across platforms</li>
                  <li>Monthly performance reporting</li>
                  <li>SEO optimization</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent className="m-2 mx-0 rounded-none space-y-2" value="Social Calendar">
              <div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg p-2 px-3 bg-[#F3F5F7] dark:bg-[#0F1B29]">
                <h3 className="pb-2">Service Package Pricing</h3>
                <Separator />
                <div className="flex flex-col pt-2">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-muted-foreground">Digital Marketing Package</p>
                    <p>$15,000/month</p>
                  </div>
                  <Separator />
                </div>
                <div className="flex flex-col pt-2">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-muted-foreground">Social Media Management</p>
                    <p>$15,000/month</p>
                  </div>
                  <Separator />
                </div>
                <div className="flex flex-col pt-2">
                  <div className="flex items-center justify-between pb-1">
                    <p className="text-muted-foreground">Social Media Management</p>
                    <p>$15,000/month</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg p-2 px-3 bg-[#F3F5F7] dark:bg-[#0F1B29]">
                <h3 className="pb-2">Scope of Work</h3>
                <Separator />
                <h3 className="py-2">Comprehensive digital marketing services including:</h3>
                <ul className="list-disc pl-6 text-muted-foreground pb-1">
                  <li>Strategy development and implementation</li>
                  <li>Content creation and curation</li>
                  <li>Social media management across platforms</li>
                  <li>Monthly performance reporting</li>
                  <li>SEO optimization</li>
                </ul>
              </div>
              <div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg p-2 px-3 bg-[#F3F5F7] dark:bg-[#0F1B29]">
                <h3 className="pb-2">Content Calendar - July 2025</h3>
                <Separator />
                <ol className="relative border-s m-3 border-dashed border-gray-200 dark:border-gray-700">
                  <li className="mb-5 ms-6">
                    <span className="absolute flex items-center mt-3 justify-center w-6 h-6 bg-blue-100 rounded-full -start-3  dark:bg-blue-900">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.43359 14.6673C3.16026 14.6673 2.93359 14.4407 2.93359 14.1673V1.83398C2.93359 1.56065 3.16026 1.33398 3.43359 1.33398C3.70693 1.33398 3.93359 1.56065 3.93359 1.83398V14.1673C3.93359 14.4407 3.70693 14.6673 3.43359 14.6673Z"
                          fill="#3072C0"
                        />
                        <path
                          opacity="0.4"
                          d="M12.013 8.21958L11.1997 7.40625C11.0064 7.23958 10.893 6.99292 10.8864 6.71958C10.873 6.41958 10.993 6.11958 11.213 5.89958L12.013 5.09958C12.7064 4.40625 12.9664 3.73958 12.7464 3.21292C12.533 2.69292 11.873 2.40625 10.8997 2.40625H3.43302C3.29302 2.41292 3.17969 2.52625 3.17969 2.66625V10.6662C3.17969 10.8062 3.29302 10.9196 3.43302 10.9196H10.8997C11.8597 10.9196 12.5064 10.6262 12.7264 10.0996C12.9464 9.56625 12.693 8.90625 12.013 8.21958Z"
                          fill="#3072C0"
                        />
                      </svg>
                    </span>
                    <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 dark:text-white">
                      Product Feature Highlight - (Week 1-Mon, Jul 1-2)
                    </h3>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Showcase new enterprise solution features
                    </p>
                  </li>
                  <li className="mb-5 ms-6">
                    <span className="absolute flex items-center mt-3 justify-center w-6 h-6 bg-blue-100 rounded-full -start-3  dark:bg-blue-900">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.6666 15.1673H3.33325C1.95325 15.1673 0.833252 14.0473 0.833252 12.6673V1.33398C0.833252 1.06065 1.05992 0.833984 1.33325 0.833984C1.60659 0.833984 1.83325 1.06065 1.83325 1.33398V12.6673C1.83325 13.494 2.50659 14.1673 3.33325 14.1673H14.6666C14.9399 14.1673 15.1666 14.394 15.1666 14.6673C15.1666 14.9407 14.9399 15.1673 14.6666 15.1673Z"
                          fill="#3072C0"
                        />
                        <path
                          opacity="0.4"
                          d="M3.33338 11.8326C3.22004 11.8326 3.10004 11.7926 3.00671 11.7126C2.80004 11.5326 2.77338 11.2192 2.95338 11.0059L6.01338 7.43256C6.34671 7.04589 6.82671 6.81257 7.33338 6.79257C7.84004 6.77923 8.34004 6.96589 8.70004 7.32589L9.33338 7.95923C9.50004 8.1259 9.71338 8.20589 9.95338 8.20589C10.1867 8.19923 10.4 8.09256 10.5534 7.91256L13.6134 4.33924C13.7934 4.13257 14.1067 4.10589 14.32 4.28589C14.5267 4.46589 14.5534 4.77922 14.3734 4.99256L11.3134 8.5659C10.98 8.95257 10.5 9.18589 9.99338 9.20589C9.48004 9.21923 8.98671 9.03257 8.62671 8.67257L8.00004 8.03923C7.83338 7.87256 7.61338 7.7859 7.38004 7.79257C7.14671 7.79923 6.93338 7.9059 6.78004 8.0859L3.72004 11.6592C3.61338 11.7726 3.47338 11.8326 3.33338 11.8326Z"
                          fill="#3072C0"
                        />
                      </svg>
                    </span>
                    <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
                      Industry Insights - (Week 1-Mon, Jul 1-2)
                    </h3>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Share latest technology trends report
                    </p>
                  </li>
                  <li className="mb-5 ms-6">
                    <span className="absolute flex items-center mt-3 justify-center w-6 h-6 bg-blue-100 rounded-full -start-3  dark:bg-blue-900">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.26 3.47398L11.2 5.35398C11.3266 5.61398 11.6666 5.86065 11.9533 5.91398L13.6533 6.19399C14.74 6.37399 14.9933 7.16065 14.2133 7.94732L12.8866 9.27398C12.6666 9.49399 12.54 9.92732 12.6133 10.2407L12.9933 11.8807C13.2933 13.174 12.6 13.6807 11.46 13.0007L9.86663 12.054C9.57996 11.8807 9.09997 11.8807 8.8133 12.054L7.21996 13.0007C6.07996 13.674 5.38663 13.174 5.68663 11.8807L6.06664 10.2407C6.13997 9.93399 6.0133 9.50065 5.7933 9.27398L4.46664 7.94732C3.68664 7.16732 3.93997 6.38065 5.02664 6.19399L6.72663 5.91398C7.0133 5.86732 7.3533 5.61398 7.47997 5.35398L8.41997 3.47398C8.91997 2.45398 9.74664 2.45398 10.26 3.47398Z"
                          fill="#3072C0"
                        />
                        <path
                          opacity="0.4"
                          d="M5.33325 3.83398H1.33325C1.05992 3.83398 0.833252 3.60732 0.833252 3.33398C0.833252 3.06065 1.05992 2.83398 1.33325 2.83398H5.33325C5.60659 2.83398 5.83325 3.06065 5.83325 3.33398C5.83325 3.60732 5.60659 3.83398 5.33325 3.83398Z"
                          fill="#3072C0"
                        />
                        <path
                          opacity="0.4"
                          d="M3.33325 13.166H1.33325C1.05992 13.166 0.833252 12.9393 0.833252 12.666C0.833252 12.3927 1.05992 12.166 1.33325 12.166H3.33325C3.60659 12.166 3.83325 12.3927 3.83325 12.666C3.83325 12.9393 3.60659 13.166 3.33325 13.166Z"
                          fill="#3072C0"
                        />
                        <path
                          opacity="0.4"
                          d="M1.99992 8.5H1.33325C1.05992 8.5 0.833252 8.27333 0.833252 8C0.833252 7.72667 1.05992 7.5 1.33325 7.5H1.99992C2.27325 7.5 2.49992 7.72667 2.49992 8C2.49992 8.27333 2.27325 8.5 1.99992 8.5Z"
                          fill="#3072C0"
                        />
                      </svg>
                    </span>
                    <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
                      Client Success Story - (Week 1-Mon, Jul 1-2)
                    </h3>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Expansion of successful campaigns and new audience targeting
                    </p>
                  </li>
                  <li className="mb-5 ms-6">
                    <span className="absolute flex items-center mt-3 justify-center w-6 h-6 bg-blue-100 rounded-full -start-3  dark:bg-blue-900">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.4"
                          d="M8.00016 14.6673C11.6821 14.6673 14.6668 11.6825 14.6668 8.00065C14.6668 4.31875 11.6821 1.33398 8.00016 1.33398C4.31826 1.33398 1.3335 4.31875 1.3335 8.00065C1.3335 11.6825 4.31826 14.6673 8.00016 14.6673Z"
                          fill="#3072C0"
                        />
                        <path
                          d="M10.4731 10.6192C10.3864 10.6192 10.2998 10.5992 10.2198 10.5459L8.1531 9.31253C7.63977 9.00586 7.25977 8.33253 7.25977 7.73919V5.00586C7.25977 4.73253 7.48643 4.50586 7.75977 4.50586C8.0331 4.50586 8.25977 4.73253 8.25977 5.00586V7.73919C8.25977 7.97919 8.45977 8.33253 8.66643 8.45253L10.7331 9.68586C10.9731 9.82586 11.0464 10.1325 10.9064 10.3725C10.8064 10.5325 10.6398 10.6192 10.4731 10.6192Z"
                          fill="#3072C0"
                        />
                      </svg>
                    </span>
                    <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
                      Tech Tips Tuesday - (Week 1-Mon, Jul 1-2)
                    </h3>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Expansion of successful campaigns and new audience targeting
                    </p>
                  </li>
                </ol>
              </div>
            </TabsContent>
            <TabsContent className="m-2 mx-0 rounded-none space-y-2" value="Design & Strategy">
              <div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg p-2 px-3 bg-[#F3F5F7] dark:bg-[#0F1B29]">
                <h3 className="pb-2">Service Package Pricing</h3>
                <Separator />
                <div className="flex flex-col pt-2">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-muted-foreground">Digital Marketing Package</p>
                    <p>$15,000/month</p>
                  </div>
                  <Separator />
                </div>
                <div className="flex flex-col pt-2">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-muted-foreground">Social Media Management</p>
                    <p>$15,000/month</p>
                  </div>
                  <Separator />
                </div>
                <div className="flex flex-col pt-2">
                  <div className="flex items-center justify-between pb-1">
                    <p className="text-muted-foreground">Social Media Management</p>
                    <p>$15,000/month</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg p-2 px-3 bg-[#F3F5F7] dark:bg-[#0F1B29]">
                <h3 className="pb-2">Scope of Work</h3>
                <Separator />
                <h3 className="py-2">Comprehensive digital marketing services including:</h3>
                <ul className="list-disc pl-6 text-muted-foreground pb-1">
                  <li>Strategy development and implementation</li>
                  <li>Content creation and curation</li>
                  <li>Social media management across platforms</li>
                  <li>Monthly performance reporting</li>
                  <li>SEO optimization</li>
                </ul>
              </div>
              <div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg p-2 px-3 bg-[#F3F5F7] dark:bg-[#0F1B29]">
                <h3 className="pb-2">Content Calendar - July 2025</h3>
                <Separator />
                <ol className="relative border-s m-3 border-dashed border-gray-200 dark:border-gray-700">
                  <li className="mb-5 ms-6">
                    <span className="absolute flex items-center mt-3 justify-center w-6 h-6 bg-blue-100 rounded-full -start-3  dark:bg-blue-900">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.43359 14.6673C3.16026 14.6673 2.93359 14.4407 2.93359 14.1673V1.83398C2.93359 1.56065 3.16026 1.33398 3.43359 1.33398C3.70693 1.33398 3.93359 1.56065 3.93359 1.83398V14.1673C3.93359 14.4407 3.70693 14.6673 3.43359 14.6673Z"
                          fill="#3072C0"
                        />
                        <path
                          opacity="0.4"
                          d="M12.013 8.21958L11.1997 7.40625C11.0064 7.23958 10.893 6.99292 10.8864 6.71958C10.873 6.41958 10.993 6.11958 11.213 5.89958L12.013 5.09958C12.7064 4.40625 12.9664 3.73958 12.7464 3.21292C12.533 2.69292 11.873 2.40625 10.8997 2.40625H3.43302C3.29302 2.41292 3.17969 2.52625 3.17969 2.66625V10.6662C3.17969 10.8062 3.29302 10.9196 3.43302 10.9196H10.8997C11.8597 10.9196 12.5064 10.6262 12.7264 10.0996C12.9464 9.56625 12.693 8.90625 12.013 8.21958Z"
                          fill="#3072C0"
                        />
                      </svg>
                    </span>
                    <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 dark:text-white">
                      Product Feature Highlight - (Week 1-Mon, Jul 1-2)
                    </h3>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Showcase new enterprise solution features
                    </p>
                  </li>
                  <li className="mb-5 ms-6">
                    <span className="absolute flex items-center mt-3 justify-center w-6 h-6 bg-blue-100 rounded-full -start-3  dark:bg-blue-900">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.6666 15.1673H3.33325C1.95325 15.1673 0.833252 14.0473 0.833252 12.6673V1.33398C0.833252 1.06065 1.05992 0.833984 1.33325 0.833984C1.60659 0.833984 1.83325 1.06065 1.83325 1.33398V12.6673C1.83325 13.494 2.50659 14.1673 3.33325 14.1673H14.6666C14.9399 14.1673 15.1666 14.394 15.1666 14.6673C15.1666 14.9407 14.9399 15.1673 14.6666 15.1673Z"
                          fill="#3072C0"
                        />
                        <path
                          opacity="0.4"
                          d="M3.33338 11.8326C3.22004 11.8326 3.10004 11.7926 3.00671 11.7126C2.80004 11.5326 2.77338 11.2192 2.95338 11.0059L6.01338 7.43256C6.34671 7.04589 6.82671 6.81257 7.33338 6.79257C7.84004 6.77923 8.34004 6.96589 8.70004 7.32589L9.33338 7.95923C9.50004 8.1259 9.71338 8.20589 9.95338 8.20589C10.1867 8.19923 10.4 8.09256 10.5534 7.91256L13.6134 4.33924C13.7934 4.13257 14.1067 4.10589 14.32 4.28589C14.5267 4.46589 14.5534 4.77922 14.3734 4.99256L11.3134 8.5659C10.98 8.95257 10.5 9.18589 9.99338 9.20589C9.48004 9.21923 8.98671 9.03257 8.62671 8.67257L8.00004 8.03923C7.83338 7.87256 7.61338 7.7859 7.38004 7.79257C7.14671 7.79923 6.93338 7.9059 6.78004 8.0859L3.72004 11.6592C3.61338 11.7726 3.47338 11.8326 3.33338 11.8326Z"
                          fill="#3072C0"
                        />
                      </svg>
                    </span>
                    <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
                      Industry Insights - (Week 1-Mon, Jul 1-2)
                    </h3>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Share latest technology trends report
                    </p>
                  </li>
                  <li className="mb-5 ms-6">
                    <span className="absolute flex items-center mt-3 justify-center w-6 h-6 bg-blue-100 rounded-full -start-3  dark:bg-blue-900">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.26 3.47398L11.2 5.35398C11.3266 5.61398 11.6666 5.86065 11.9533 5.91398L13.6533 6.19399C14.74 6.37399 14.9933 7.16065 14.2133 7.94732L12.8866 9.27398C12.6666 9.49399 12.54 9.92732 12.6133 10.2407L12.9933 11.8807C13.2933 13.174 12.6 13.6807 11.46 13.0007L9.86663 12.054C9.57996 11.8807 9.09997 11.8807 8.8133 12.054L7.21996 13.0007C6.07996 13.674 5.38663 13.174 5.68663 11.8807L6.06664 10.2407C6.13997 9.93399 6.0133 9.50065 5.7933 9.27398L4.46664 7.94732C3.68664 7.16732 3.93997 6.38065 5.02664 6.19399L6.72663 5.91398C7.0133 5.86732 7.3533 5.61398 7.47997 5.35398L8.41997 3.47398C8.91997 2.45398 9.74664 2.45398 10.26 3.47398Z"
                          fill="#3072C0"
                        />
                        <path
                          opacity="0.4"
                          d="M5.33325 3.83398H1.33325C1.05992 3.83398 0.833252 3.60732 0.833252 3.33398C0.833252 3.06065 1.05992 2.83398 1.33325 2.83398H5.33325C5.60659 2.83398 5.83325 3.06065 5.83325 3.33398C5.83325 3.60732 5.60659 3.83398 5.33325 3.83398Z"
                          fill="#3072C0"
                        />
                        <path
                          opacity="0.4"
                          d="M3.33325 13.166H1.33325C1.05992 13.166 0.833252 12.9393 0.833252 12.666C0.833252 12.3927 1.05992 12.166 1.33325 12.166H3.33325C3.60659 12.166 3.83325 12.3927 3.83325 12.666C3.83325 12.9393 3.60659 13.166 3.33325 13.166Z"
                          fill="#3072C0"
                        />
                        <path
                          opacity="0.4"
                          d="M1.99992 8.5H1.33325C1.05992 8.5 0.833252 8.27333 0.833252 8C0.833252 7.72667 1.05992 7.5 1.33325 7.5H1.99992C2.27325 7.5 2.49992 7.72667 2.49992 8C2.49992 8.27333 2.27325 8.5 1.99992 8.5Z"
                          fill="#3072C0"
                        />
                      </svg>
                    </span>
                    <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
                      Client Success Story - (Week 1-Mon, Jul 1-2)
                    </h3>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Expansion of successful campaigns and new audience targeting
                    </p>
                  </li>
                  <li className="mb-5 ms-6">
                    <span className="absolute flex items-center mt-3 justify-center w-6 h-6 bg-blue-100 rounded-full -start-3  dark:bg-blue-900">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.4"
                          d="M8.00016 14.6673C11.6821 14.6673 14.6668 11.6825 14.6668 8.00065C14.6668 4.31875 11.6821 1.33398 8.00016 1.33398C4.31826 1.33398 1.3335 4.31875 1.3335 8.00065C1.3335 11.6825 4.31826 14.6673 8.00016 14.6673Z"
                          fill="#3072C0"
                        />
                        <path
                          d="M10.4731 10.6192C10.3864 10.6192 10.2998 10.5992 10.2198 10.5459L8.1531 9.31253C7.63977 9.00586 7.25977 8.33253 7.25977 7.73919V5.00586C7.25977 4.73253 7.48643 4.50586 7.75977 4.50586C8.0331 4.50586 8.25977 4.73253 8.25977 5.00586V7.73919C8.25977 7.97919 8.45977 8.33253 8.66643 8.45253L10.7331 9.68586C10.9731 9.82586 11.0464 10.1325 10.9064 10.3725C10.8064 10.5325 10.6398 10.6192 10.4731 10.6192Z"
                          fill="#3072C0"
                        />
                      </svg>
                    </span>
                    <h3 className="mb-1 text-md font-semibold text-gray-900 dark:text-white">
                      Tech Tips Tuesday - (Week 1-Mon, Jul 1-2)
                    </h3>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Expansion of successful campaigns and new audience targeting
                    </p>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg p-2 px-3 bg-[#F3F5F7] dark:bg-[#0F1B29]">
                <h3 className="pb-2">Visual Design Guidelines</h3>
                <Separator />
                <div className="flex md:flex-row flex-col items-start justify-between ">
                  <div className="flex flex-col items-start">
                    <p className="mt-2 text-muted-foreground font-semibold">Primary Colors</p>
                    <div className="flex gap-2 mt-1">
                      <div className="rounded-full h-8 w-8 bg-[#EE4F8D]" />
                      <div className="rounded-full h-8 w-8 bg-[#F7C649]" />
                      <div className="rounded-full h-8 w-8 bg-[#3072C0]" />
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="mt-2 text-muted-foreground text-sm font-semibold">Typography</p>
                    <p className="mt-2 font-normal">Inter - Headlines</p>
                    <p className=" text-muted-foreground font-normal text-sm">Body text & UI elements</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter className="p-0 sticky bottom-0 bg-card">
          <div className="self-end flex gap-3 p-4 border-t w-full">
            <div className="flex w-full gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="p-6 px-8 hover:bg-gray-200 dark:hover:bg-gray-800 text-[16px] font-[400] border-[#3072C0] text-[#3072C0] hover:text-[#3072C0] rounded-[16px] bg-transparent"
              >
                <PDFIcon fill="#3072C0" />
                Export PDF
              </Button>
              <Button
                // type="submit"
                // form="aidata-form"
                variant={"outline"}
                className="p-6 px-8 text-white text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Done
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
