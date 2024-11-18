"use client";

import { CategoryIcon, GroupUserIcon, HomeIcon, ReturnedIcon } from "@/src/components/icons";
import { Tab, Tabs } from "@nextui-org/tabs";

export default function MenuTabs() {
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
      className=""
    >
      <Tab
        key="dashboard"
        title={
          <div className="flex items-center space-x-2">
            <HomeIcon />
            <span>Dashboard</span>
          </div>
        }
      />

      <Tab
        key="music"
        title={
          <div className="flex items-center space-x-2">
            <GroupUserIcon />
            <span>Users</span>
          </div>
        }
      />

      <Tab
        key="videos"
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
