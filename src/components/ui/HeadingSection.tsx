import { Button } from "@heroui/button";
import {  ArrowLeftIcon } from "../icons";
import Link from "next/link";



export default function HeadingSection({title,linkUrl}:{title:string,linkUrl?:string}) {
  return (
         <div className="flex border-b pb-2">
        {linkUrl && (
          <Button as={Link} href={linkUrl} isIconOnly radius="full" size="sm" color="primary" className="me-4">
            <ArrowLeftIcon className="fill-white"/>
          </Button>
        )}
        <p className="text-lg font-bold flex-1">
         { title}
        </p>
      </div>
  )
}
