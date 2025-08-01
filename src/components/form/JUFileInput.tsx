"use client";
import { Button } from "@heroui/button";
import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { XmarkIcon } from "../icons";

type TProps = {
  name: string;
  labelName?: string;
  className?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  onPreview?: (previews: string[]) => void;
};

export default function JUFileInput({
  name,
  labelName,
  className,
  multiple = false,
  accept,
  maxSize,
  onPreview,
}: TProps) {
  const {
    control,
    setValue,
    setError,
    formState: { errors },
  } = useFormContext();

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    if (maxSize) {
      const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        setError(name, { message: `Some files exceed the maximum size of ${maxSize} bytes` });
        return;
      }
    }

    const newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles;
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));

    setFiles(newFiles);
    const updatedPreviews = multiple ? [...previewUrls, ...newPreviews] : newPreviews;
    setPreviewUrls(updatedPreviews);

    setValue(name, multiple ? newFiles : selectedFiles[0] || null, { shouldValidate: true });
    onPreview?.(updatedPreviews);
  };

  const clearFiles = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviewUrls([]);
    setValue(name, multiple ? [] : null, { shouldValidate: true });
    onPreview?.([]);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={multiple ? [] : null}
      render={({ field }) => (
        <div className="space-y-1">
          {labelName && (
            <label htmlFor={`file-input-${name}`} className="block text-sm font-medium text-gray-700">
              {labelName}
            </label>
          )}
          <div className="flex items-center gap-2">
            <label htmlFor={`file-input-${name}`} className="flex-1">
              <div className={`w-full h-14 flex items-center border-2 rounded-xl hover:border-gray-400 ${className}`}>
                <span className="h-full flex items-center px-3 font-semibold bg-slate-500 text-white rounded-s-xl cursor-pointer">
                  {multiple ? "Choose Files" : "Choose File"}
                </span>
                <input
                  type="file"
                  id={`file-input-${name}`}
                  className="hidden"
                  multiple={multiple}
                  accept={accept}
                  onChange={handleFileChange}
                />
                <span className="px-3 text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                  {files.length > 0
                    ? `${files.length} file(s) selected`
                    : "No file chosen"}
                </span>
                
              </div>
            </label>
            {files.length > 0 && (
                  <Button
                    isIconOnly
                    onPress={clearFiles}
                    color="default"
                    size="sm"
                    radius="full"
                    className="z-20 me-2"
                  >
                    <XmarkIcon />
                  </Button>
                )}
          </div>
          {errors[name] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[name]?.message as string}
            </p>
          )}
        </div>
      )}
    />
  );
}