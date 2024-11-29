"use client";
import React, {  useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { Controller, useFormContext } from "react-hook-form";
// import JoditEditor from "jodit-react"

/* Using dynamic import of Jodit component as it can't render in server side*/
 const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });


type TProps = {
  name: string;
  placeholder?:string
};
export default function JUTextEditor({ name,placeholder }: TProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const editor = useRef(null);

  /* The most important point*/
  // const config = useMemo(
  //   () => ({
  //     height: 400, 
  //     toolbar: true, 
  //     readonly: false,
  //    autofocus: true,
  //     uploader: {
  //       insertImageAsBase64URI: true,
  //       imagesExtensions: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
  //     },
  //     toolbarButtons: [
  //       'bold', 'italic', 'underline', 'strikethrough', '|',
  //       'ul', 'ol', 'outdent', 'indent', '|',
  //       'link', 'image', 'video', '|',
  //       'undo', 'redo', '|',
  //       'brush', 'align', 'font', 'fontsize', '|',
  //       'code', 'table', 'fullsize', 'preview'
  //     ],
  //     placeholder: placeholder || 'Start typings...'
  //   }),
  //   [placeholder]
  // );
  const config = {
    toolbarSticky: false,
    buttons: [
      "bold",
      "italic",
      "underline",
      "|",
      "ul", // Unordered List
      "ol", // Ordered List
      "|",
      "link",
      "image",
      "eraser",
      "undo",
      "redo",
    ],
    placeholder: "Start typing here...",
  };
  return (
    <>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <JoditEditor
          ref={editor}
          value={field.value || ""} // Use field.value as the editor's value
          config={config}
          onChange={field.onChange}
          className="w-full h-[70%]  bg-white"
        />
      )}
    />
    {errors[name] && <p className="text-red-500">{errors[name]?.message as string}</p>}
    </>
  );
}
