"use client"
import { Input, InputProps } from "@nextui-org/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SearchIcon } from "../icons";

export default function SearchInput({
  
  inputProps = {
    classNames: {
      base: "max-w-full  h-[38px] ",
      mainWrapper: "h-full ",
      input: "text-small",
      inputWrapper:
        "h-full font-normal text-default-500 bg-white rounded-full",
    },
  },
}: {

  inputProps?: InputProps;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 1000); // 1000ms delay (adjustable)

    // Cleanup function to clear the timeout if the user is still typing
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Handle the debounced search operation here
  useEffect(() => {
    if (debouncedTerm) {
      handleSearch(debouncedTerm);
    }
  }, [debouncedTerm]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!e.target.value) {
      router.push(pathname);
    }
  };
  const handleSearch = (searchTerm: string) => {
    // Update the search query in the URL
  const newParams = new URLSearchParams(searchParams.toString());
  newParams.set("search", searchTerm);  // Update the search term
  
  // Navigate to the updated URL with the new query parameters
  router.push(`${pathname}?${newParams.toString()}`);
  };
  return (
    <Input
      {...inputProps}
      defaultValue={search}
      onChange={handleInputChange}
      placeholder="Type to search..."
      size="sm"
      endContent={<SearchIcon size={18} />}
      type="search"
    />
  );
}
