import React from "react";

import { Button } from "@/components/ui/button";
import ExcelIcon from "@/components/ui/icons/options/excel-icon";
import PdfIcon from "@/components/ui/icons/options/pdf-icon";
import { cn } from "@/lib/utils";

const ExportButton = ({ fileType }: { fileType: string }) => {
  const FileType = () => {
    switch (fileType) {
      case "pdf":
        return "PDF";
      case "excel":
        return "Excel";
      case "pdf":
        return "PDF";
      default:
        return "application/octet-stream";
    }
  };

  const FileIcon = () => {
    switch (fileType) {
      case "pdf":
        return <PdfIcon color="#E02F2F" />;
      case "excel":
        return <ExcelIcon color="#217346" />;
      default:
        return <ExcelIcon color="#217346" />;
    }
  };

  return (
    <Button
      variant="outline"
      className={cn(
        "flex items-center gap-1 sm:gap-2",
        "bg-card border-border text-xs h-12",
        "hover:bg-card hover:border-blue-500",
      )}
    >
      <FileIcon />
      <span className="hidden sm:inline dark:text-white text-gray-900">Export {FileType()}</span>
      <span className="sm:hidden dark:text-white text-gray-900">{FileType()}</span>
    </Button>
  );
};

export default ExportButton;
