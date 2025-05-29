import React from "react";
import MenuItems from "./_components/MenuItems";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className=" flex md:flex-row flex-col ">
      <div className="w-full md:w-[300px]  py-5 px-3 ">
        <MenuItems />
      </div>
      <div className="w-full md:w-[980px]  py-8 md:p-8">
        {children}
      </div>
    </main>
  );
}
