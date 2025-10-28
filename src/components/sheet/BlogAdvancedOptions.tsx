"use client";

import { useTheme } from "next-themes";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox-square";
import RightArrowIcon from "@/components/ui/icons/options/right-arrow";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

export default function BlogAdvancedOptions({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { theme } = useTheme();

  const [seoKeywords, setSeoKeywords] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const [writingStyles, setWritingStyles] = useState<Record<string, boolean>>({
    storytelling: false,
    howToGuide: false,
    dataDriven: false,
    opinionEditorial: false,
  });

  const [contentPreferences, setContentPreferences] = useState<Record<string, boolean>>({
    includeStatistics: false,
    addExamples: false,
    includeQuotes: false,
    addFaqs: false,
    includeResources: false,
    addConclusion: false,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedCta, setSelectedCta] = useState("subscribe");
  const [customCta, setCustomCta] = useState("");

  const audienceOptions = ["Beginners", "Professionals", "Entrepreneurs"];
  const writingStyleOptions = [
    { id: "storytelling", label: "Storytelling" },
    { id: "howToGuide", label: "How-To Guide" },
    { id: "dataDriven", label: "Data-Driven" },
    { id: "opinionEditorial", label: "Opinion/Editorial" },
  ];
  const contentPreferenceOptions = [
    { id: "includeStatistics", label: "Include Statistics" },
    { id: "addExamples", label: "Add Examples" },
    { id: "includeQuotes", label: "Include Quotes" },
    { id: "addFaqs", label: "Add FAQs" },
    { id: "includeResources", label: "Include Resources" },
    { id: "addConclusion", label: "Add Conclusion" },
  ];

  const templateOptions = [
    { id: "listicle", label: "Listicle", description: "Numbered or bulleted list format" },
    {
      id: "stepByStep",
      label: "Step-by-step Guide",
      description: "Process-oriented with clear steps",
    },
    { id: "comparison", label: "Comparison", description: "Compare multiple options or solutions" },
    {
      id: "problemSolution",
      label: "Problem-Solution",
      description: "Identify problem and provide solutions",
    },
  ];

  const ctaOptions = [
    { value: "subscribe", label: "Subscribe to Newsletter" },
    { value: "contact", label: "Contact Us" },
    { value: "download", label: "Download Resource" },
    { value: "custom", label: "Custom CTA" },
  ];

  const toggleWritingStyle = (id: string) => {
    setWritingStyles(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleContentPreference = (id: string) => {
    setContentPreferences(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleTemplate = (templateId: string) => {
    setSelectedTemplate(prev => (prev === templateId ? "" : templateId));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="dark:bg-[#212945] bg-card w-[400px] sm:w-[540px] overflow-y-auto rounded-l-[16px] overflow-x-hidden">
        <SheetHeader className="flex border-b flex-row items-center justify-between space-y-0 pb-4">
          <SheetTitle className="text-lg font-medium">Advanced Content Options</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 p-3">
          {/* SEO Keywords Section */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              SEO Keywords <span className="text-destructive">*</span>
            </p>
            <Textarea
              placeholder="Enter your prompt for custom generation.."
              value={seoKeywords}
              onChange={e => setSeoKeywords(e.target.value)}
              className="min-h-24 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Help optimize your content for search engines.
            </p>
          </div>

          {/* Target Audience Section */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Target Audience</p>
            <Input
              placeholder="e.g., Small business owners, aged 25-45"
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {audienceOptions.map(audience => (
                <Badge variant={"secondary"} className="p-1 px-2" key={audience}>
                  {audience}
                </Badge>
              ))}
            </div>
          </div>

          {/* Writing Style Variations Section */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Writing Style Variations</p>
            <div className="grid grid-cols-2 gap-3">
              {writingStyleOptions.map(style => (
                <div
                  key={style.id}
                  className="flex items-center border p-2 rounded-[12px] space-x-2"
                >
                  <CheckboxSquare
                    id={style.id}
                    checked={writingStyles[style.id]}
                    onCheckedChange={() => toggleWritingStyle(style.id)}
                  />
                  <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    {style.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Outline Preferences Section */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Content Outline Preferences</p>
            <div className="grid grid-cols-2 gap-3">
              {contentPreferenceOptions.map(pref => (
                <div
                  key={pref.id}
                  className="flex items-center border p-2 rounded-[12px] space-x-2"
                >
                  <CheckboxSquare
                    id={pref.id}
                    checked={contentPreferences[pref.id]}
                    onCheckedChange={() => toggleContentPreference(pref.id)}
                  />
                  <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    {pref.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Content Structure Template</p>
            <div className="space-y-2">
              {templateOptions.map(template => (
                <div
                  key={template.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleTemplate(template.id)}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleTemplate(template.id);
                    }
                  }}
                  className={`p-3 rounded-lg border-2 transition-colors flex items-start gap-3 cursor-pointer ${
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/5"
                      : "border-muted bg-muted/30 hover:border-muted-foreground/50"
                  }`}
                >
                  <CheckboxSquare
                    checked={selectedTemplate === template.id}
                    onCheckedChange={() => toggleTemplate(template.id)}
                  />

                  <div>
                    <div className="font-medium text-sm">{template.label}</div>
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Call-To-Action Options</p>
            <Select value={selectedCta} onValueChange={setSelectedCta}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ctaOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Or enter custom CTA text"
              value={customCta}
              onChange={e => setCustomCta(e.target.value)}
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-4 border-t">
          <Button variant="ghost" className="flex-1  py-6">
            Clear Filters
          </Button>
          <Button className="flex items-center flex-1 py-6 bg-[#3072C0] text-white rounded-[16px] text-[16px] font-medium">
            <p>Apply Filter</p>
            <RightArrowIcon color={theme === "dark" ? "#F6FBFE" : "#303444"} />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
