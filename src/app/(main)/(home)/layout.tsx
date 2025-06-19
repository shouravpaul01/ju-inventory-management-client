

import { ReactNode } from "react";
import FilterSidebar from "../_components/FilterSidebar";





export default function MainLayout({ children  }: { children: ReactNode }) {

  

  return (
   
         
         <main className=" flex">
           <div className="hidden md:block w-[300px] h-screen fixed bg-violet-50 py-5 px-3 rounded-md">
             <FilterSidebar />
           </div>
           <div className="md:ms-[300px] w-full md:w-[980px]  py-8 md:p-8">{children}</div>
         </main>
     
  )
}
