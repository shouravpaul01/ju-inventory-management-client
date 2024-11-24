"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentuser, getResetDetails } from "../services/Auth";
import { TCurrentUser } from "../types";


export type TUserProviderValues = {
  user: TCurrentUser | null;
  resetPasswordDetails:any;
  setUser: (user: TCurrentUser | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};
const UserContext = createContext<TUserProviderValues | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TCurrentUser | null>(null);
  const [resetPasswordDetails, setResetPasswordDetails] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUser = async () => {
    const currentUser = await getCurrentuser();
    const resetPasswordTokenResult = await getResetDetails();
    setUser(currentUser as TCurrentUser);
    setResetPasswordDetails(resetPasswordTokenResult as any)
    setIsLoading(false);
  };
  useEffect(() => {
    handleUser();
  }, [isLoading]);
  const values = {
    user,
    resetPasswordDetails,
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
