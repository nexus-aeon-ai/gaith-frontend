import { useTheme } from "next-themes";
import React from "react";

import EyeIcon from "@/components/ui/icons/eye";
import FileIcon from "@/components/ui/icons/file";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { CheckboxSquare } from "../../ui/checkbox-square";
import { Separator } from "../../ui/separator";

interface AssetCardProps {
  title: string;
  description: string;
  footerText: string;
  setShowMediaBuyingSheet: (show: boolean) => void;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const AssetCard = ({ 
  title, 
  description, 
  footerText, 
  setShowMediaBuyingSheet,
  checked = false,
  onCheckedChange
}: AssetCardProps) => {
  const { theme } = useTheme();

  return (
    <Card className="p-[12px] font-inter">
      <CardHeader className="p-0 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CheckboxSquare 
              checked={checked}
              onCheckedChange={onCheckedChange}
            />
            <CardTitle className="text-sm font-bold">{title}</CardTitle>
          </div>
          <EyeIcon
            onClick={() => setShowMediaBuyingSheet(true)}
            className="cursor-pointer"
            fill={theme === "dark" ? "#CCCFDB" : "#303444"}
          />
        </div>
      </CardHeader>
      <Separator />

      <CardDescription className="py-2">{description}</CardDescription>
      <Separator />

      <CardFooter className="p-0 pt-2 gap-1 text-xs">
        <FileIcon color={theme === "dark" ? "#CCCFDB" : "#303444"} />
        {footerText}
      </CardFooter>
    </Card>
  );
};

export default AssetCard;
