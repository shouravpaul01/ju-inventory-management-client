"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";

import { Link } from "@nextui-org/link";

import NextLink from "next/link";

import { siteConfig } from "@/src/config/site";

import { LocalMallIcon, LogoutIcon } from "@/src/components/icons";
import Image from "next/image";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Avatar } from "@nextui-org/avatar";
import { Badge } from "@nextui-org/badge";
import SearchInput from "./ui/SearchInput";
import { useUser } from "../context/user.provider";
import { logoutUser } from "../services/Auth";

export const Navbar = () => {
  const { user, setIsLoading } = useUser();
  return (
    <NextUINavbar
      position="sticky"
      classNames={{
        base: `  !backdrop-blur-none !backdrop-saturate-100 !bg-transparent data-[menu-open=true]:!backdrop-blur-none pt-12  `,
        wrapper: `max-w-7xl  h-12 bg-violet-700 rounded-md shadow-small px-0 md:px-6   z-10`,

        item: [
          "flex",
          "relative",
          "h-full",
          "!items-center",
          "text-white",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-white",
        ],
        menuItem: "text-white",
        menu: "text-white",
      }}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <NavbarMenuToggle />
        </NavbarContent>
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1 " href="/">
            <div className="flex items-center   pb-12 ">
              <div className="relative z-10">
                <div className="bg-white size-16 md:size-[85px] border border-dotted border-violet-700  rounded-full"></div>

                <div className="absolute top-2 md:top-[10px] left-2 md:left-3">
                  <div className="relative size-12 md:size-16">
                    <Image src="/ju-logo.png" fill alt="ju-logo" priority />
                  </div>
                </div>
              </div>
              <div className="flex -ms-9">
                <div className="parallelogram-clip-path w-[200px] md:w-[300px]  ps-[44px] py-1 font-bold align-middle">
                  <p className="text-md md:text-lg  text-violet-800">
                    Jahangirnagar University
                  </p>
                  <p className="text-slate-500">Inventory Management</p>
                </div>
              </div>
            </div>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex " justify="center">
        <div className="w-80 ">
          <SearchInput />
        </div>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full "
        justify="end"
      >
        <NavbarItem>
          <Link className="text-white" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" className="text-white" aria-current="page">
            My Orders
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Badge
            content="99+"
            shape="circle"
            color="warning"
            showOutline={false}
          >
            <Button
              radius="full"
              isIconOnly
              aria-label="more than 99 notifications"
              variant="light"
            >
              <LocalMallIcon className="fill-white" />
            </Button>
          </Badge>
        </NavbarItem>

        <Dropdown placement="bottom-end" showArrow>
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              size="sm"
              className="transition-transform"
              src={user?.profileImage!}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              href="/login"
              as={Link}
              key="logout"
              color="danger"
              startContent={<LogoutIcon />}
              onPress={async () => {
                await logoutUser(), setIsLoading(true);
              }}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
