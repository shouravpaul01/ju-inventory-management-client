"use client";

import dynamic from "next/dynamic";
import { Controller, useFormContext } from "react-hook-form";
// import ReactQuill from "react-quill";
// import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type TProps = {
  name: string;
  label: string;
  placeholder?: string;
  className?:string
};
export default function JUTextEditor({ name, label, placeholder,className }: TProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["code-block"],
      ["clean"],
    ],
  };

  const formats = [
    "font",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",

    "script",

    "indent",
    "direction",
    "link",
    "image",
    "align",
    "color",
    "background",
    "code-block",
  ];
  return (
    <div>
      <h3 className="mb-[2px]">{label}</h3>
      {/* Controller for Quill */}
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <ReactQuill
            value={field.value}
            onChange={field.onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder || "Start typing..."}
            className={className}
          />
        )}
      />
      {errors[name] && (
        <p className="text-red-500">{errors[name]?.message as string}</p>
      )}
    </div>
  );
}
