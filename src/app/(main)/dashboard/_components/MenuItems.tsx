"use client"
import {
  InventoryIcon,
  PasswordIcon,
  PersonIcon,
} from "@/src/components/icons";
import { Link } from "@heroui/link";
import { Listbox, ListboxItem } from "@heroui/listbox";

export default function MenuItems() {


  return (

    <div className="w-full  border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
      <Listbox aria-label="Listbox menu with descriptions" variant="flat">
        <ListboxItem
          key="new"
          startContent={<PersonIcon />}
        >
          My Info
        </ListboxItem>
        <ListboxItem
          key="copy"
          href="/dashboard/my-orders"
          as={Link}
          startContent={<InventoryIcon />}
        >
          My Orders
        </ListboxItem>
        <ListboxItem
          key="edit"
          showDivider
          startContent={<PasswordIcon />}
        >
          Change Password
        </ListboxItem>
      </Listbox>
    </div>
  );
}
