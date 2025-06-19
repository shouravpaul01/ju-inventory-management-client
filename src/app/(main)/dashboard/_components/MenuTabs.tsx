"use client"
import {
  HomeIcon,
  InventoryIcon,
  PasswordIcon,
  PersonIcon,
} from "@/src/components/icons";
import { Link } from "@heroui/link";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Tab, Tabs } from "@heroui/tabs";
import { usePathname } from "next/navigation";

export default function MenuItems() {

const pathname = usePathname();
  return (

     <Tabs
      aria-label="Options"
      variant="light"
      color="primary"
      isVertical={true}
      classNames={{
       
        base: " flex-col",
        tab: "justify-normal ",
      }}
      selectedKey={pathname}
    >
      <Tab
        key="/dashboard"
        href="/dashboard"
        as={Link}
        title={
          <div className="flex items-center space-x-2">
            <HomeIcon />
            <span>Dashboard</span>
          </div>
        }
      />

     <Tab
        key="/dashboard/my-orders"
        href="/dashboard/my-orders"
        as={Link}
        title={
          <div className="flex items-center space-x-2">
            < InventoryIcon/>
            <span>My Orders</span>
          </div>
        }
      />
      <Tab
        
        as={Link}
        title={
          <div className="flex items-center space-x-2">
            < PasswordIcon/>
            <span>Change Password</span>
          </div>
        }
      />
    </Tabs>
  );
}
