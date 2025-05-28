import {
  InventoryIcon,
  PasswordIcon,
  PersonIcon,
} from "@/src/components/icons";
import { Listbox, ListboxItem } from "@heroui/listbox";

export default function MenuItems() {


  return (
    <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
      <Listbox aria-label="Listbox menu with descriptions" variant="flat">
        <ListboxItem
          key="new"
          startContent={<PersonIcon />}
        >
          My Info
        </ListboxItem>
        <ListboxItem
          key="copy"
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
