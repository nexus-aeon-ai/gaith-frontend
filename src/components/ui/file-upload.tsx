"use client";

import Image from "next/image";
import { AlertCircleIcon, FileIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFilesChange?: (files: (File | string)[]) => void;
  formFieldName?: string;
  label?: string;
  description?: string;
  accept?: string;
  maxSize?: number;
  className?: string;
  url?: string;
}

function isImageFile(file: File | undefined): boolean {
  if (!file) return false;
  if (file instanceof File) {
    return file.type.startsWith("image/");
  }
  return false;
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

function getFileNameFromUrl(url: string): string {
  try {
    return decodeURIComponent(url.split("/").pop() || url);
  } catch {
    return url;
  }
}

export const FileUpload = ({
  onFilesChange,
  formFieldName,
  label = "Upload File",
  url,
  description = "Drop your file here or click to browse",
  accept = "*",
  maxSize = 100 * 1024 * 1024, // 100MB default
  className,
}: FileUploadProps) => {
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept,
    maxSize,
    onFilesChange: (fileWithPreviews) => {
      // Extract just the File objects for form integration
      const fileObjects = fileWithPreviews.map((f) => f.file as File);
      onFilesChange?.(fileObjects);
    },
  });

  // Support for string URL as file (edit mode)
  const fileOrUrl = url || (files[0]?.file as File | string | undefined);
  const previewUrl = files[0]?.preview || null;
  const isFile = fileOrUrl instanceof File;
  const isUrl = typeof fileOrUrl === "string";
  let fileName: string | null = null;
  if (isFile) fileName = fileOrUrl.name;
  else if (isUrl) fileName = getFileNameFromUrl(fileOrUrl);
  const isImage = isFile ? isImageFile(fileOrUrl) : false;

  let filePreviewContent = null;
  if (isFile) {
    if (isImage && previewUrl) {
      filePreviewContent = (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <Image
            src={previewUrl}
            alt={fileName || `Uploaded ${label}`}
            className="mx-auto max-h-full rounded-xl object-contain"
            fill
          />
          <div className="absolute right-4 top-4 z-50">
            <button
              type="button"
              className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring focus-visible:ring-ring/50"
              onClick={() => removeFile(files[0]?.id)}
              aria-label={`Remove ${label}`}
            >
              <XIcon
                className="size-4"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      );
    } else {
      // Non-image file preview
      filePreviewContent = (
        <div className="flex w-full flex-row items-center justify-between gap-4 p-2">
          <div className="flex items-center gap-3">
            <FileIcon className="size-7 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="max-w-[180px] truncate text-sm font-medium">{fileName}</span>
              <span className="text-xs text-muted-foreground">{formatBytes(fileOrUrl.size)}</span>
            </div>
          </div>
          <button
            type="button"
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring focus-visible:ring-ring/50"
            onClick={() => removeFile(files[0]?.id)}
            aria-label={`Remove ${label}`}
          >
            <XIcon
              className="size-4"
              aria-hidden="true"
            />
          </button>
        </div>
      );
    }
  } else if (isUrl && fileName) {
    // URL file preview (edit mode)
    filePreviewContent = (
      <div className="flex w-full flex-row items-center justify-between gap-4 p-2">
        <div className="flex items-center gap-3">
          <FileIcon className="size-7 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="max-w-[180px] truncate text-sm font-medium">{fileName}</span>
          </div>
        </div>
        <button
          type="button"
          className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring focus-visible:ring-ring/50"
          onClick={() => removeFile(files[0]?.id)}
          aria-label={`Remove ${label}`}
        >
          <XIcon
            className="size-4"
            aria-hidden="true"
          />
        </button>
      </div>
    );
  } else {
    filePreviewContent = (
      <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
        <div
          className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
          aria-hidden="true"
        >
          <ImageIcon className="size-4 opacity-60" />
        </div>
        <p className="mb-1.5 text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={openFileDialog}
        >
          <UploadIcon
            className="-ms-1 size-4 opacity-60"
            aria-hidden="true"
          />
          Select file
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      <div className="relative">
        {/* Drop area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className={`relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50 ${isImage ? "min-h-52" : "min-h-24"}`}
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label={`Upload ${label}`}
            name={formFieldName}
          />
          {filePreviewContent}
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-xs text-destructive"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
};
