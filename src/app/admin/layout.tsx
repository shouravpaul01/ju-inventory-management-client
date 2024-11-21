import { Navbar } from "@/src/components/navbar";
import { ReactNode } from "react";
import MenuTabs from "./_components/MenuTabs";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto max-w-7xl px-6 relative flex flex-col h-screen">
      <Navbar />
      <main className=" flex">
        <div className="hidden md:block w-[300px] h-screen fixed bg-violet-50 py-5 px-3 rounded-md">
          <MenuTabs />
        </div>
        <div className="md:ms-[300px] w-full md:w-[980px]  py-8 md:p-8">{children}</div>
      </main>
    </div>
  );
}
