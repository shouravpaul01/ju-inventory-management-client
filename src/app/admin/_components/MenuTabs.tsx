"use client";

import { CategoryIcon, GroupUserIcon, HomeIcon, ReturnedIcon } from "@/src/components/icons";
import { Tab, Tabs } from "@nextui-org/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MenuTabs() {
  const pathname = usePathname();
  return (
    <Tabs
      aria-label="Options"
      variant="light"
      color="primary"
      isVertical={true}
      classNames={{
        wrapper: "flex-col ",
        base: " flex-col",
        tab: "justify-normal ",
      }}
     selectedKey={pathname}
    >
      <Tab
        key="/admin/dashboard"
        href="/admin/dashboard"
        as={Link}
        title={
          <div className="flex items-center space-x-2">
            <HomeIcon />
            <span>Dashboard</span>
          </div>
        }
      />

      <Tab
        key="/admin/manage-users"
        href="/admin/manage-users"
        as={Link}
        title={
          <div className="flex items-center space-x-2">
            <GroupUserIcon />
            <span>Manage Users</span>
          </div>
        }
      />

      <Tab
       key="/admin/manage-categories"
        href="/admin/manage-categories"
        title={
          <div className="flex items-center space-x-2">
            <CategoryIcon />
            <span>Manage Category</span>
          </div>
        }
      />
      <Tab
        key="Manage Sub-Category"
        title={
          <div className="flex items-center space-x-2">
            <CategoryIcon />
            <span>Manage Sub-Category</span>
          </div>
        }
      />
      <Tab
        key="Manage Accessories"
        title={
          <div className="flex items-center space-x-2">
            <CategoryIcon />
            <span>Manage Accessories</span>
          </div>
        }
      />
      <Tab
        key="Manage Distributed Accessories"
        title={
          <div className="flex items-center space-x-2">
            <CategoryIcon />
            <span>Manage Distributed Accessories</span>
          </div>
        }
      />
      <Tab
        key="Orders"
        title={
          <div className="flex items-center space-x-2">
            <CategoryIcon />
            <span>Orders</span>
          </div>
        }
      />
      <Tab
        key="Returned Accessories"
        title={
          <div className="flex items-center space-x-2">
            <ReturnedIcon />
            <span>Returned Accessories</span>
          </div>
        }
      />
    </Tabs>
  );
}
