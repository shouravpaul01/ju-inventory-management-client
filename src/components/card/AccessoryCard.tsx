import { TAccessory, TAccessoryCartItem } from "@/src/types";
import { Image } from "@heroui/image";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import NextImage from "next/image";

import React from "react";
import { ImageIcon, InfoIcon, LocalMallIcon } from "../icons";
import { blankImage } from "@/src/constents";
import { Divider } from "@nextui-org/divider";
import { Chip } from "@nextui-org/chip";
import { Badge } from "@nextui-org/badge";
import { useCart } from "@/src/hooks/cart";


interface Iprops {
  accessory: TAccessory;
}
export default function AccessoryCard({ accessory }: Iprops) {
  const { addToCart } = useCart();
  const handleAddToCart = (accessory: TAccessoryCartItem) => {
    addToCart(accessory);
  };
  return (
    <Badge
      color="success"
      size="lg"
      content={accessory?.quantityDetails?.currentQuantity || 0}
      classNames={{ badge: "top-1" }}
    >
      <Card shadow="sm">
        <CardBody className="overflow-hidden p-0">
          <Image
            as={NextImage}
            alt={accessory.name || "Accessory Image"}
            className="w-full object-cover"
            fallbackSrc={<ImageIcon />}
            src={accessory.image || blankImage}
            width={300}
            height={200}
            isZoomed
          />
          <div className="relative z-20">
            <Divider />
            <Chip
              color="warning"
              size="sm"
              classNames={{ content: "text-center w-28" }}
              className=" absolute -top-[11px] left-[20%]"
            >
              {accessory?.isItReturnable ? "Returnable" : "Non-returnable"}
            </Chip>
          </div>
          <p className="font-medium line-clamp-2 text-gray-800 pt-4 px-3 ">
            {accessory.name}
          </p>
        </CardBody>
        <CardFooter className="text-sm flex justify-between gap-3">
          <Button
            size="sm"
            className="w-full font-semibold hover:text-white bg-primary bg-opacity-25 hover:bg-primary hover:fill-white hover:shadow"
            startContent={<LocalMallIcon className="size-[22px]" />}
            onPress={() =>
              handleAddToCart({
                _id: accessory?._id!,
                name: accessory?.name,
                image:accessory?.image,
                isItReturnable:accessory?.isItReturnable,
                expectedQuantity:1,
                currentQuantity:
                  accessory?.quantityDetails.currentQuantity,
              })
            }
          >
            Add
          </Button>
          <Button
            isIconOnly
            size="sm"
            className="font-semibold  bg-primary bg-opacity-25 hover:bg-primary hover:fill-white hover:shadow"
            radius="full"
          >
            <InfoIcon className="hover:fill-white" />
          </Button>
        </CardFooter>
      </Card>
    </Badge>
  );
}
