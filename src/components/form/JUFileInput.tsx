"use client";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type TProps = {
  name: string;
  labelName?:string;
  className?: string;
  multiple?: boolean;
  onPreview?: (previews: string[]) => void; // Callback to send previews to parent
};

export default function JUFileInput({ name,labelName, className, multiple = false, onPreview }: TProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles;
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));

    setFiles(newFiles);
    setPreviewUrls(multiple ? [...previewUrls, ...newPreviews] : newPreviews);

    setValue(name, multiple ? newFiles : selectedFiles[0]);
    onPreview?.(multiple ? [...previewUrls, ...newPreviews] : newPreviews); // Send previews to parent
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={multiple ? [] : null}
      render={({ field }) => (
        <div className="space-y-1">
          {labelName && <label >{labelName}</label>}
          <label htmlFor="file-input">
            <div
              className={`w-full h-14 flex items-center border-2 rounded-xl hover:border-gray-400 ${className}`}
            >
              <span className="h-full flex items-center px-3 font-semibold bg-slate-500 text-white rounded-s-xl cursor-pointer">
                {multiple ? "Choose Files" : "Choose File"}
              </span>
              <input
                type="file"
                id="file-input"
                className="hidden"
                multiple={multiple}
                onChange={handleFileChange}
              />
              <span className="px-3 text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                {files.length > 0
                  ? `${files.length} file(s) selected`
                  : "No file chosen"}
              </span>
            </div>
          </label>
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
