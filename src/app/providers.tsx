"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import UserProvider from "../context/user.provider";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'



export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}
const queryClient = new QueryClient();
const localStoragePersistor = createSyncStoragePersister({
  storage: window.localStorage,
})

persistQueryClient({
  queryClient,
  persister: localStoragePersistor,
});
export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <UserProvider>
     
        <QueryClientProvider client={queryClient}>
          <NextUIProvider navigate={router.push}>
            <Toaster position="top-center" richColors />
            <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
          </NextUIProvider>
        </QueryClientProvider>
      
    </UserProvider>
  );
}
