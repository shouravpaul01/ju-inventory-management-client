"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import UserProvider from "../context/user.provider";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'



export interface ProvidersProps {
  children: React.ReactNode;
 
}
const queryClient = new QueryClient();
const localStoragePersistor = createSyncStoragePersister({
  storage: window.localStorage,
})

persistQueryClient({
  queryClient,
  persister: localStoragePersistor,
});
export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <UserProvider>
     
        <QueryClientProvider client={queryClient}>
          <HeroUIProvider navigate={router.push}>
            <Toaster position="top-center" richColors />
            {children}
          </HeroUIProvider>
        </QueryClientProvider>
      
    </UserProvider>
  );
}
