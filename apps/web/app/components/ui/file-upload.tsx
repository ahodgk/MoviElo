"use client";

import { CloudIcon, CloudUploadIcon, X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface FileUploadProps {
  value?: File;
  onChange: (file: File | undefined) => void;
  className?: string;
  accept?: string;
  disabled?: boolean;
  maxSizeMB?: number;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

export function FileUpload({
  value,
  onChange,
  className,
  accept = "image/*,video/*",
  disabled = false,
  maxSizeMB = 50,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (file.size > maxSizeBytes) {
      alert(`File size exceeds maximum allowed (${maxSizeMB}MB)`);
      return;
    }

    onChange(file);
  };

  const handleClick = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors",
        !disabled && "cursor-pointer hover:border-muted-foreground/50",
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        className="hidden"
        disabled={disabled}
      />

      {value ? (
        <div className="flex w-full items-center gap-2">
          {value.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(value)}
              alt="Uploaded file"
              className="h-16 w-16 rounded object-cover"
            />
          ) : value.type.startsWith("video/") ? (
            <video
              src={URL.createObjectURL(value)}
              className="h-16 w-16 rounded object-cover"
              controls={false}
            >
              <track kind="captions" />
            </video>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded bg-muted">
              <CloudUploadIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">{value.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(value.size)}
            </p>
          </div>
          {!disabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          )}
        </div>
      ) : (
        <>
          <CloudUploadIcon className="h-10 w-10 text-muted-foreground/60" />
          <div className="mt-2 text-center">
            <p className="text-sm font-medium">
              <span className="text-primary">Click to upload</span> or drag and
              drop
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {accept === "image/*,video/*"
                ? "Images and videos"
                : accept === "image/*"
                  ? "Images"
                  : accept === "video/*"
                    ? "Videos"
                    : accept}{" "}
              (max {maxSizeMB}MB)
            </p>
          </div>
        </>
      )}
    </div>
  );
}
