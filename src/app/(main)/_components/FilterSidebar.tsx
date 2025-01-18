"use client";

import { getCategoriesWithSubCategories } from "@/src/hooks/Category";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectItem } from "@nextui-org/select";
import { returnableOptions } from "@/src/constents";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States for filters
  const [selectedReturnableOption, setSelectedReturnableOption] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);

  // Fetch categories with subcategories
  const { data: categories } = getCategoriesWithSubCategories();

  // Initialize state from query parameters
  useEffect(() => {
    const queryCategories = searchParams.get("categories");
    const querySubCategories = searchParams.get("subCategories");
    const queryReturnable = searchParams.get("returnableOption");

    if (queryCategories) setSelectedCategories(queryCategories.split(","));
    if (querySubCategories) setSelectedSubCategories(querySubCategories.split(","));
    if (queryReturnable) setSelectedReturnableOption(queryReturnable);
  }, [searchParams]);

  // Update the query string
  const updateQuery = (
    returnableOption: string,
    categories: string[],
    subCategories: string[],
    
  ) => {
    const params = new URLSearchParams();

    if (categories.length > 0) params.set("categories", categories.join(","));
    if (subCategories.length > 0) params.set("subCategories", subCategories.join(","));
    if (returnableOption.length > 0) params.set("returnableOption", returnableOption);

    router.push(`?${params.toString()}`);
  };

  // Handlers for filter changes
  const handleReturnableOptionChange = (value: string) => {
    
    setSelectedReturnableOption(value);
    updateQuery(value,selectedCategories, selectedSubCategories);
  };

  const handleCategoryChange = (value: string[]) => {
    
    setSelectedCategories(value);
    updateQuery(selectedReturnableOption, value,selectedSubCategories );
  };

  const handleSubCategoryChange = (value: string[]) => {
    setSelectedSubCategories(value);
    updateQuery(selectedReturnableOption,selectedCategories, value, );
  };

  return (
    <div className="space-y-3">
      <p className="font-bold text-lg bg-violet-200 px-2 py-[10px] rounded-md">Filter By</p>
      <div>
        <Select
          className="max-w-xs"
          aria-label="Select an Option"
          placeholder="Select an Option"
          selectedKeys={[selectedReturnableOption]}
          variant="bordered"
          onChange={(e) => handleReturnableOptionChange(e.target.value)}
        >
          {returnableOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div>
        <CheckboxGroup
          color="primary"
          label="Select Categories"
          value={selectedCategories}
          onValueChange={handleCategoryChange}
        >
          {categories?.map((category, index) => (
            <div className="w-full" key={index}>
              <Checkbox value={category._id}>{category.name}</Checkbox>
              {selectedCategories?.includes(category._id) && (
                <CheckboxGroup
                  color="primary"
                  classNames={{ base: "px-3 py-2" }}
                  value={selectedSubCategories}
                  onValueChange={handleSubCategoryChange}
                >
                  {category?.subCategories?.map((subCategory, idx) => (
                    <Checkbox value={subCategory._id} key={idx}>
                      {subCategory.name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              )}
            </div>
          ))}
        </CheckboxGroup>
      </div>
    </div>
  );
}
