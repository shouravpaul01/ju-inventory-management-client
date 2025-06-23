import Image from "next/image";
import { ReactNode } from "react";

export default function JUPrint({children}: {children?: ReactNode}) {
  return (
    <div className="p-24">
      <div className="border-b border-gray-300 pb-3">
        <div className="flex items-end  gap-3  ">
          <Image
            src={"/ju-logo.png"}
            alt="JU Logo"
            width={60}
            height={60}
         
          />
          <div className="pb-1">
            <h1 className="text-[22px] font-bold text-primary">Jahangirnagar University</h1>
            <h2 className="text-md font-semibold ">
              Computer Science and Engineering
            </h2>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {children}
      </div>
    </div>
  );
}
