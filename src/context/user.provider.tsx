"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentuser } from "../services/Auth";
import { TCurrentUser } from "../types";


export type TUserProviderValues = {
  user: TCurrentUser | null;
  
  setUser: (user: TCurrentUser | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};
const UserContext = createContext<TUserProviderValues | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TCurrentUser | null>(null);
 
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUser = async () => {
    const currentUser = await getCurrentuser();
  
    setUser(currentUser as TCurrentUser);

    setIsLoading(false);
  };
  useEffect(() => {
    handleUser();
  }, [isLoading]);
  const values = {
    user,
    
    setUser,
    isLoading,
    setIsLoading,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
export const useUser = () => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error("UseUser must be used within a UserProvider");
  }
  return context;
};
export default UserProvider;
