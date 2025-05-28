"use client";
import AccessoryCard from "@/src/components/card/AccessoryCard";
import { getAllAccessories } from "@/src/hooks/Accessory";
import { TQuery } from "@/src/types";
import { Pagination } from "@heroui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function HomePage() {
  const router=useRouter()
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const searchTerm = searchParams.get("search") || "";
  const categories = searchParams.get("categories");
  const subCategories = searchParams.get("subCategories");
  const isItReturnable = searchParams.get("isItReturnable");
  const [currentPage, setCurrentPage] =useState(Number(page));
  const queryParams = useMemo(() => {
    const params: TQuery[] = [{ name: "page", value: page },{ name: "isActive", value: true }];

    if (searchTerm) {
      params.push({ name: "search", value: searchTerm });
    }

    if (categories) {
      params.push({ name: "categories", value: categories });
    }

    if (subCategories) {
      params.push({ name: "subCategories", value: subCategories });
    }

    if (isItReturnable) {
      params.push({ name: "isItReturnable", value: isItReturnable });
    }

    return params;
  }, [page, searchTerm, categories, subCategories, isItReturnable]);

  const { data: accessories } = getAllAccessories({ query: queryParams });
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setCurrentPage(newPage);
    router.push(`?${params.toString()}`);
    
  };
  if (!accessories?.data?.length) {
    return <p className="text-center text-gray-500">No accessories found.</p>;
  }
  console.log(currentPage, "data");
  return (
    <div>
      <div className="grid gird-col-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {accessories?.data?.map((accessory, index) => (
          <AccessoryCard accessory={accessory} key={index} />
        ))}
      </div>
      <Pagination
      showShadow 
      showControls 
        color="primary"
        className="py-6"
        page={currentPage}
        total={accessories?.totalPages!}
        onChange={handlePageChange}
      />
    </div>
  );
}
