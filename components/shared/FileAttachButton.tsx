"use client";

import { useRef, type ChangeEvent } from "react";
import { Paperclip, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { toast } from "react-hot-toast";

export interface AttachedFile {
  name: string;
  mimeType: string;
  base64: string;
  dataUrl: string;
  size: number;
}

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

interface FileAttachButtonProps {
  onFile: (file: AttachedFile) => void;
  disabled?: boolean;
  className?: string;
}

export function FileAttachButton({ onFile, disabled, className }: FileAttachButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Supported: images, PDFs, plain text.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("File too large. Maximum 10 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onFile({
        name: file.name,
        mimeType: file.type,
        base64: dataUrl.split(",")[1],
        dataUrl,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        title="Attach file (image, PDF, text)"
        className={cn(
          "flex items-center justify-center rounded-xl transition-colors text-slate-400 hover:text-emerald-600",
          className
        )}
      >
        <Paperclip size={15} />
      </button>
    </>
  );
}

interface FilePreviewProps {
  file: AttachedFile;
  onRemove: () => void;
  className?: string;
}

export function FilePreview({ file, onRemove, className }: FilePreviewProps) {
  const isImage = file.mimeType.startsWith("image/");
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800",
        className
      )}
    >
      {isImage ? (
        <img
          src={file.dataUrl}
          alt={file.name}
          className="h-8 w-8 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700">
          <FileText className="h-4 w-4 text-slate-500" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
          {file.name}
        </p>
        <p className="text-[10px] text-slate-400">
          {(file.size / 1024).toFixed(0)} KB
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-red-100 hover:text-red-500 dark:bg-slate-700"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
