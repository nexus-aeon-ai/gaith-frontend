"use client";

import { Button } from "@/components/ui/button";
import PDFIcon from "@/components/ui/icons/options/pdf-icon";
import Fb from "@/components/ui/icons/social/fb";
import Insta from "@/components/ui/icons/social/instagram";
import Linkedin from "@/components/ui/icons/social/linkedin";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { Separator } from "../ui/separator";

// interface FilterState {
// }

const metrics = [
  {
    title: "Click-Through Rate (CTR)",
    target: "2.5%",
    expected: "1.8-3.2%",
  },
  {
    title: "Conversion Rate",
    target: "2.5%",
    expected: "1.8-3.2%",
  },
  {
    title: "Cost Per Click (CPC)",
    target: "$2.50",
    expected: "$2.00-3.00",
  },
  {
    title: "Return On Ad Spend (ROAS)",
    target: "3.5x",
    expected: "3.0-4.0x",
  },
];

const budgetItems = [
  {
    icon: <Fb />,
    title: "Facebook",
    description: "Primary platform for brand awareness",
    amount: "$15,000/month",
  },
  {
    icon: <Insta />,
    title: "Instagram",
    description: "Primary platform for brand awareness",
    amount: "$15,000/month",
  },
  {
    icon: <Linkedin />,
    title: "Linkedin",
    description: "B2B lead generation",
    amount: "$15,000/month",
  },
];

export default function MediaBuyingPlanSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // const [filters, setFilters] = useState<FilterState>({
  //   dateFrom: "",
  //   dateTo: "",
  //   assignees: [],
  //   statuses: [],
  //   sources: [],
  //   clients: [],
  // });

  // const clearFilters = () => {
  //   setFilters({
  //     dateFrom: "",
  //     dateTo: "",
  //     assignees: [],
  //     statuses: [],
  //     sources: [],
  //     clients: [],
  //   });
  // };


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] font-inter bg-card w-auto sm:min-w-[640px] overflow-y-auto rounded-l-[16px] overflow-x-hidden">
        <SheetHeader className="flex border-b flex-row items-center justify-between space-y-0 pb-4">
          <SheetTitle className="text-lg font-medium">Media Buying Plan Preview</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 sm:p-4 sm:pt-0 p-2 ">
          {/* Budget Allocation Section */}
          <div className="space-y-3 rounded-lg bg-[#F3F5F7] dark:bg-[#0F1B29] border border-gray-200 dark:border-gray-600 p-3">
            <Label className="text-sm font-medium">Budget Allocation</Label>
            <Separator />
            <div className="flex flex-col gap-2">
              {budgetItems.map((item, idx) => (
                <div key={idx}>
                  <div className="flex flex-row items-center space-x-3 pb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-[#508CD3] dark:text-white">{item.icon}</div>
                      <div className="flex flex-col">
                        <p className="font-[500]">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[#303444] dark:text-white font-[500]">
                      {item.amount}
                    </div>
                  </div>
                  {idx < budgetItems.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </div>
          {/* targeting strategy Section */}
          <div className="space-y-3 rounded-lg bg-[#F3F5F7] dark:bg-[#0F1B29] border border-gray-200 dark:border-gray-600 p-3">
            <Label className="text-sm font-medium">Targeting Strategy</Label>
            <Separator />
            <div className="flex flex-col gap-2">
              <p>Demographics</p>
              <ul className="text-sm list-disc pl-6">
                <li>Age:25-54</li>
                <li>Location: United States, Europe</li>
                <li>Languages: English, Spanish</li>
                <li>Income Level: Middle To Upper</li>
              </ul>
              <Separator />
            </div>

            <div className="flex flex-col gap-2">
              <p>Interests & Behaviors</p>
              <ul className="text-sm list-disc pl-6">
                <li>Technology Early Adopters</li>
                <li>B2B Decision Makers</li>
                <li>Enterprise Software Users</li>
                <li>Digital Transformation</li>
              </ul>
              <Separator />
            </div>

            <div className="flex flex-col gap-2">
              <p>Custom Audiences</p>
              <ul className="text-sm list-disc pl-6">
                <li>Website Visitors (Last 180 days)</li>
                <li>Email List Subscribers</li>
                <li>Similar Audiences</li>
                <li>Engaged Social Media Users</li>
              </ul>

              <Separator />
            </div>
          </div>
          {/* Campaign Timeline Section */}
          <div className="space-y-3 rounded-lg bg-[#F3F5F7] dark:bg-[#0F1B29] border border-gray-200 dark:border-gray-600 p-3">
            <Label className="text-sm font-medium">Campaign Timeline</Label>
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
                  Phase 1: Launch (Months 1-2)
                </h3>
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Initial campaign setup, audience testing, and baseline establishment
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
                  Phase 2: Optimization (Months 3-4)
                </h3>
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Performance analysis, budget reallocation, and strategy refinement
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
                  Phase 3: Scale (Months 5-6)
                </h3>
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Expansion of successful campaigns and new audience targeting
                </p>
              </li>
            </ol>
          </div>

          {/* Campaign Timeline section 2 */}
          <div className="space-y-3 rounded-lg bg-[#F3F5F7] dark:bg-[#0F1B29] border border-gray-200 dark:border-gray-600 p-3">
            <Label className="text-sm font-medium">Campaign Timeline</Label>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {metrics.map(item => (
                <div key={item.title}>
                  <p className="text-sm font-medium  mb-1">{item.title}</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                    <div className="h-2 w-2/3 bg-[#508CD3] rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Target: {item.target}</span>
                    <span>Expected: {item.expected}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky w-full flex bottom-0 gap-3 p-4 border-t bg-card">
          <div className="flex w-full gap-3 justify-end">
            <Button
              variant="outline"
              onClick={()=>onOpenChange(false)}
              className="p-6 px-8 hover:bg-[#3072C0] text-[16px] font-[400] border-[#3072C0] text-[#3072C0] rounded-[16px] bg-transparent"
            >
              Close Preview
            </Button>
            <Button
              // type="submit"
              // form="aidata-form"
              variant={"outline"}
              className="p-6 px-8 text-white text-[16px] bg-[#3072C0] hover:bg-[#184a86] transition-all font-[400] rounded-[16px] border-[#3072C0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PDFIcon fill="white" />
              Export PDF
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
