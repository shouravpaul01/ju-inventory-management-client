"use client";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type TProps = {
    name: string;
    className?:string
  };
export default function JUFileInput({name,className}:TProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [fileName, setFileName] = useState<string>("");

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field }) => (
        <div>
          <label htmlFor="file-input">
            <div className={`w-full h-14 flex items-center border-2 rounded-xl hover:border-gray-400 ${className}`}>
              <span className="h-full flex items-center px-3 font-semibold bg-slate-500 text-white rounded-s-xl cursor-pointer">
                Choose File
              </span>
              <input
                type="file"
                id="file-input"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setFileName(file?.name || ""); // Update the local state
                  field.onChange(file); // Update React Hook Form's state
                }}
              />
              <span className="px-3 text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                {fileName || "No file chosen"}
              </span>
            </div>
          </label>
          {errors.file && (
            <p className="mt-1 text-sm text-red-600">
              {errors.file.message as string}
            </p>
          )}
        </div>
      )}
    />
  );
}
