"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";

interface UploadAreaProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export default function UploadArea({ value, onChange }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | null) {
    if (!file) return;
    onChange(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">
        Upload Document
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="group cursor-pointer rounded-3xl border-2 border-dashed border-violet-500/30 bg-white/5 p-10 transition-all duration-300 hover:border-violet-500 hover:bg-white/10"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />

        {!value ? (
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 rounded-2xl bg-violet-500/10 p-4 text-violet-300 transition group-hover:scale-110">
              <UploadCloud size={34} />
            </div>

            <h3 className="text-xl font-semibold text-white">
              Drag & drop your file
            </h3>

            <p className="mt-2 text-gray-400">or click to browse</p>

            <p className="mt-5 text-sm text-gray-500">
              Supports PDF, DOCX and TXT
            </p>
          </div>
        ) : (
          <div className="flex w-full min-w-0 items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[#12091f] p-5">
            <div className="flex min-w-0 flex-1 items-center gap-4 overflow-hidden">
              <div className="shrink-0 rounded-xl bg-violet-500/10 p-3">
                <FileText className="text-violet-300" />
              </div>

              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">
                  {value.name}
                </p>

                <p className="text-sm text-gray-400">
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="shrink-0 rounded-xl p-2 transition hover:bg-white/10"
            >
              <X className="text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
