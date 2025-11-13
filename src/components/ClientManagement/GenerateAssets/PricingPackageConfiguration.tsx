import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const packageFeatures = [
  "Digital Marketing Strategy",
  "Social Media Management",
  "SEO Optimization",
  "Content Creation",
  "Email Marketing",
];

const PricingPackageConfiguration = () => {
  const [activeTab, setActiveTab] = React.useState("Tiered Pricing");
  return (
    <Card className="pt-3 rounded-[16px] shadow-none">
      <CardHeader className="flex flex-row items-center justify-between px-3">
        <CardTitle className="text-[14px] font-bold">Package Configuration</CardTitle>
        <div className="flex items-center gap-1">
          <Label htmlFor="enable-package" className="text-muted-foreground">
            Enable Packages
          </Label>
          <Switch
            className={`
                    data-[state=checked]:bg-blue-600
                    data-[state=unchecked]:bg-gray-300
                    dark:data-[state=unchecked]:bg-gray-700
                    dark:data-[state=checked]:bg-blue-500
                    transition-colors duration-200
                    `}
            id="enable-package"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <Separator />
        <Tabs defaultValue={"Tiered Pricing"} value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            aria-label="Settings sections"
            className={cn("w-full gap-3 h-auto", "bg-card ", "p-0 overflow-hidden mt-3")}
          >
            {["Tiered Pricing", "Bundle Pricing", "Custom Pricing"].map(value => {
              return (
                <TabsTrigger
                  key={value}
                  value={value}
                  className={cn(
                    "group relative flex-1 py-4 border",
                    "data-[state=active]:bg-[#3072C0] data-[state=active]:text-white",
                    "data-[state=active]:shadow-sm",
                    "data-[state=active]:border data-[state=active]:border-border",
                    "rounded-[12px] px-3",
                    "text-sm",
                    "hover:text-foreground hover:bg-secondary/80 transition-all duration-200",
                  )}
                >
                  <span>{value}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent className="m-2 mx-0 space-y-2" value="Tiered Pricing">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
              <Card className="rounded-[12px] shadow-none">
                <CardHeader className="flex justify-between items-center flex-row pt-2 px-2">
                  <CardTitle className="text-sm">Basic Package</CardTitle>
                  <CheckboxSquare />
                </CardHeader>
                <CardContent className="p-2">
                  <p className="rounded-[12px] p-3 border w-full bg-[#F3F5F7] dark:bg-[#0F1B29]">
                    Starter
                  </p>
                  <div>
                    {packageFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mt-2">
                        <CheckboxSquare className="data-[state=checked]:bg-[#3072C0]/40 data-[state=checked]:border-none" />
                        <span className="text-[14px] text-[#303444] dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-2" />
                  <div className="flex items-center justify-between p-2 py-1 mt-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">
                          Package Price
                        </h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 pr-1 py-1 rounded-[12px] w-[100px]">
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                          fill="#687192"
                        />
                      </svg>

                      <Input
                        placeholder="0"
                        defaultValue="1250"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 py-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">VAT</h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[100px]">
                      <Input
                        placeholder="0"
                        defaultValue="5%"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-[12px] shadow-none">
                <CardHeader className="flex justify-between items-center flex-row pt-2 px-2">
                  <CardTitle className="text-sm">Standard Package</CardTitle>
                  <CheckboxSquare />
                </CardHeader>
                <CardContent className="p-2">
                  <p className="rounded-[12px] p-3 border w-full bg-[#F3F5F7] dark:bg-[#0F1B29]">
                    Professional
                  </p>
                  <div>
                    {packageFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mt-2">
                        <CheckboxSquare className="data-[state=checked]:bg-[#3072C0]/40 data-[state=checked]:border-none" />
                        <span className="text-[14px] text-[#303444] dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-2" />
                  <div className="flex items-center justify-between p-2 py-1 mt-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">
                          Package Price
                        </h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 pr-1 py-1 rounded-[12px] w-[100px]">
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                          fill="#687192"
                        />
                      </svg>

                      <Input
                        placeholder="0"
                        defaultValue="1250"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 py-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">VAT</h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[100px]">
                      <Input
                        placeholder="0"
                        defaultValue="5%"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-[12px] shadow-none">
                <CardHeader className="flex justify-between items-center flex-row pt-2 px-2">
                  <CardTitle className="text-sm">Premium Package</CardTitle>
                  <CheckboxSquare />
                </CardHeader>
                <CardContent className="p-2">
                  <p className="rounded-[12px] p-3 border w-full bg-[#F3F5F7] dark:bg-[#0F1B29]">
                    Enterprise
                  </p>
                  <div>
                    {packageFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mt-2">
                        <CheckboxSquare className="data-[state=checked]:bg-[#3072C0]/40 data-[state=checked]:border-none" />
                        <span className="text-[14px] text-[#303444] dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-2" />
                  <div className="flex items-center justify-between p-2 py-1 mt-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">
                          Package Price
                        </h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 pr-1 py-1 rounded-[12px] w-[100px]">
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                          fill="#687192"
                        />
                      </svg>

                      <Input
                        placeholder="0"
                        defaultValue="1250"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 py-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">VAT</h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[100px]">
                      <Input
                        placeholder="0"
                        defaultValue="5%"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent className="m-2 mx-0 space-y-2" value="Bundle Pricing">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
              <Card className="rounded-[12px] shadow-none">
                <CardHeader className="flex justify-between items-center flex-row pt-2 px-2">
                  <CardTitle className="text-sm">Basic Package</CardTitle>
                  <CheckboxSquare />
                </CardHeader>
                <CardContent className="p-2">
                  <p className="rounded-[12px] p-3 border w-full bg-[#F3F5F7] dark:bg-[#0F1B29]">
                    Starter
                  </p>
                  <div>
                    {packageFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mt-2">
                        <CheckboxSquare className="data-[state=checked]:bg-[#3072C0]/40 data-[state=checked]:border-none" />
                        <span className="text-[14px] text-[#303444] dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-2" />
                  <div className="flex items-center justify-between p-2 py-1 mt-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">
                          Package Price
                        </h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 pr-1 py-1 rounded-[12px] w-[100px]">
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                          fill="#687192"
                        />
                      </svg>

                      <Input
                        placeholder="0"
                        defaultValue="1250"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 py-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">VAT</h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[100px]">
                      <Input
                        placeholder="0"
                        defaultValue="5%"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-[12px] shadow-none">
                <CardHeader className="flex justify-between items-center flex-row pt-2 px-2">
                  <CardTitle className="text-sm">Standard Package</CardTitle>
                  <CheckboxSquare />
                </CardHeader>
                <CardContent className="p-2">
                  <p className="rounded-[12px] p-3 border w-full bg-[#F3F5F7] dark:bg-[#0F1B29]">
                    Professional
                  </p>
                  <div>
                    {packageFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mt-2">
                        <CheckboxSquare className="data-[state=checked]:bg-[#3072C0]/40 data-[state=checked]:border-none" />
                        <span className="text-[14px] text-[#303444] dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-2" />
                  <div className="flex items-center justify-between p-2 py-1 mt-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">
                          Package Price
                        </h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 pr-1 py-1 rounded-[12px] w-[100px]">
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                          fill="#687192"
                        />
                      </svg>

                      <Input
                        placeholder="0"
                        defaultValue="1250"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 py-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">VAT</h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[100px]">
                      <Input
                        placeholder="0"
                        defaultValue="5%"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-[12px] shadow-none">
                <CardHeader className="flex justify-between items-center flex-row pt-2 px-2">
                  <CardTitle className="text-sm">Premium Package</CardTitle>
                  <CheckboxSquare />
                </CardHeader>
                <CardContent className="p-2">
                  <p className="rounded-[12px] p-3 border w-full bg-[#F3F5F7] dark:bg-[#0F1B29]">
                    Enterprise
                  </p>
                  <div>
                    {packageFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mt-2">
                        <CheckboxSquare className="data-[state=checked]:bg-[#3072C0]/40 data-[state=checked]:border-none" />
                        <span className="text-[14px] text-[#303444] dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-2" />
                  <div className="flex items-center justify-between p-2 py-1 mt-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">
                          Package Price
                        </h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 pr-1 py-1 rounded-[12px] w-[100px]">
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                          fill="#687192"
                        />
                      </svg>

                      <Input
                        placeholder="0"
                        defaultValue="1250"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 py-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">VAT</h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[100px]">
                      <Input
                        placeholder="0"
                        defaultValue="5%"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent className="m-2 mx-0 space-y-2" value="Custom Pricing">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
              <Card className="rounded-[12px] shadow-none">
                <CardHeader className="flex justify-between items-center flex-row pt-2 px-2">
                  <CardTitle className="text-sm">Basic Package</CardTitle>
                  <CheckboxSquare />
                </CardHeader>
                <CardContent className="p-2">
                  <p className="rounded-[12px] p-3 border w-full bg-[#F3F5F7] dark:bg-[#0F1B29]">
                    Starter
                  </p>
                  <div>
                    {packageFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mt-2">
                        <CheckboxSquare className="data-[state=checked]:bg-[#3072C0]/40 data-[state=checked]:border-none" />
                        <span className="text-[14px] text-[#303444] dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-2" />
                  <div className="flex items-center justify-between p-2 py-1 mt-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">
                          Package Price
                        </h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 pr-1 py-1 rounded-[12px] w-[100px]">
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                          fill="#687192"
                        />
                      </svg>

                      <Input
                        placeholder="0"
                        defaultValue="1250"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 py-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">VAT</h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[100px]">
                      <Input
                        placeholder="0"
                        defaultValue="5%"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-[12px] shadow-none">
                <CardHeader className="flex justify-between items-center flex-row pt-2 px-2">
                  <CardTitle className="text-sm">Standard Package</CardTitle>
                  <CheckboxSquare />
                </CardHeader>
                <CardContent className="p-2">
                  <p className="rounded-[12px] p-3 border w-full bg-[#F3F5F7] dark:bg-[#0F1B29]">
                    Professional
                  </p>
                  <div>
                    {packageFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mt-2">
                        <CheckboxSquare className="data-[state=checked]:bg-[#3072C0]/40 data-[state=checked]:border-none" />
                        <span className="text-[14px] text-[#303444] dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-2" />
                  <div className="flex items-center justify-between p-2 py-1 mt-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">
                          Package Price
                        </h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 pr-1 py-1 rounded-[12px] w-[100px]">
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                          fill="#687192"
                        />
                      </svg>

                      <Input
                        placeholder="0"
                        defaultValue="1250"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 py-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">VAT</h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[100px]">
                      <Input
                        placeholder="0"
                        defaultValue="5%"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-[12px] shadow-none">
                <CardHeader className="flex justify-between items-center flex-row pt-2 px-2">
                  <CardTitle className="text-sm">Premium Package</CardTitle>
                  <CheckboxSquare />
                </CardHeader>
                <CardContent className="p-2">
                  <p className="rounded-[12px] p-3 border w-full bg-[#F3F5F7] dark:bg-[#0F1B29]">
                    Enterprise
                  </p>
                  <div>
                    {packageFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mt-2">
                        <CheckboxSquare className="data-[state=checked]:bg-[#3072C0]/40 data-[state=checked]:border-none" />
                        <span className="text-[14px] text-[#303444] dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-2" />
                  <div className="flex items-center justify-between p-2 py-1 mt-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">
                          Package Price
                        </h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 pr-1 py-1 rounded-[12px] w-[100px]">
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.44575 0.159049C1.66562 0.447137 1.85537 1.00831 1.92465 1.57849C1.94272 1.73753 1.95778 2.40074 1.95778 3.19298V4.5374L1.22888 4.52839C0.421676 4.51939 0.424688 4.51939 0.159634 4.30632C0.0903591 4.24931 0.0271077 4.20429 0.0180718 4.20429C0.00903591 4.20429 0 4.27632 0 4.36034C0.00301197 4.94252 0.210838 5.40466 0.584322 5.65974C0.807208 5.80979 1.02106 5.8548 1.52707 5.8548H1.95778V6.503V7.1482L1.259 7.1392C0.599382 7.13019 0.548179 7.12719 0.403604 7.06117C0.319269 7.02216 0.204814 6.94414 0.147587 6.88712C0.0933711 6.8301 0.0361437 6.78509 0.0210838 6.78509C-0.0271077 6.78509 0.0210838 7.35226 0.0843352 7.55632C0.192766 7.90443 0.45782 8.22253 0.746969 8.35457C0.87046 8.41159 0.951783 8.42059 1.42466 8.42959L1.96079 8.4416L1.94875 9.99007C1.93971 11.2805 1.92766 11.5806 1.88851 11.7666C1.78309 12.2318 1.63249 12.5949 1.43069 12.859L1.32226 13L4.11736 12.988C6.53297 12.979 6.96669 12.97 7.31909 12.925C8.67448 12.7539 9.69554 12.4058 10.5871 11.8146C11.0841 11.4875 11.6443 10.9294 11.9666 10.4462C12.325 9.90605 12.6171 9.24584 12.8009 8.56163L12.834 8.43259L13.6382 8.4416C14.5388 8.4506 14.59 8.4626 14.84 8.68767C14.9062 8.74769 14.9725 8.79571 14.9846 8.79571C15.0267 8.79571 14.9755 8.21353 14.9153 8.02447C14.8038 7.67636 14.5599 7.38227 14.2526 7.23222C14.1231 7.1662 14.0629 7.1602 13.5689 7.1512L13.0268 7.1392V6.497V5.8518L13.7647 5.8608C14.5779 5.86981 14.5749 5.86981 14.84 6.08287C14.9093 6.13989 14.9725 6.1849 14.9815 6.1849C14.9906 6.1849 14.9996 6.11288 14.9996 6.02585C14.9966 5.44067 14.7858 4.97853 14.4093 4.72945C14.1653 4.5674 13.9846 4.5344 13.3551 4.5344H12.8099L12.7888 4.43536C12.7437 4.20729 12.5418 3.65212 12.3792 3.31302C11.5961 1.67451 10.1684 0.627192 8.13533 0.201061C7.29801 0.0240068 7.30403 0.0240068 4.19266 0.0120029L1.32226 0L1.44575 0.159049ZM7.07813 0.735226C8.11124 0.936288 8.71966 1.22738 9.30699 1.80355C9.65638 2.14266 9.85216 2.41274 10.069 2.84187C10.2768 3.256 10.4877 3.9102 10.5841 4.43536L10.6021 4.5344H7.25885H3.91556V2.5958V0.657202L5.37035 0.672207C6.55706 0.68421 6.86729 0.693213 7.07813 0.735226ZM10.7347 5.90282C10.7588 5.96283 10.7588 6.98915 10.7347 7.07618L10.7166 7.1452H7.31608H3.91556V6.5V5.8548H7.31608C10.3883 5.8548 10.7166 5.8608 10.7347 5.90282ZM10.5871 8.50162C10.4305 9.21584 10.322 9.56394 10.1172 9.99307C9.52385 11.2415 8.5028 11.9767 7.01789 12.2318C6.53899 12.3128 6.06912 12.3368 4.99385 12.3368H3.91556V10.3862V8.4356H7.25885H10.6021L10.5871 8.50162Z"
                          fill="#687192"
                        />
                      </svg>

                      <Input
                        placeholder="0"
                        defaultValue="1250"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 py-1">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-normal text-muted-foreground text-[14px]">VAT</h3>
                      </div>
                    </div>
                    <div className="dark:bg-[#0F1B29] bg-[#F3F5F7] flex items-center gap-0 p-4 py-1 rounded-[12px] w-[100px]">
                      <Input
                        placeholder="0"
                        defaultValue="5%"
                        className="text-center ring-0 focus:outline-0 border-none shadow-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PricingPackageConfiguration;
