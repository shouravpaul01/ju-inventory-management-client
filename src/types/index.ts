import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
export type TSelectOption = {
  value: string;
  label: string;
};
export type TErrorMessage = {
  path: string;
  message: string;
};
export type TQuery = {
  name: string;
  value: any;
};
export type TUser = {
  _id: string;
  userId: string;
  faculty: TFaculty;
  email: string;
  password: string;
  needChangePassword?: boolean;
  role: "Admin" | "Faculty";
  userAccess: string[];
  isApproved: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
};
export type TPublication = {
  title: string;
  journal: string;
  year: number;
  authors: string[];
  doi?: string;
};

export type TFaculty = {
  _id: string;
  userId: string;
  name: string;
  image?: string;
  designation: string;
  department: string;
  roomNo: number;
  email: string;
  phone?: string;
  researchInterests?: string[];
  coursesTaught?: string[];
  publications?: TPublication[];
};
export type TRole = {
  Admin: string;
  Faulty: string;
};
export type TCurrentUser = {
  _id: string;
  name: string;
  profileImage: string | null;
  userId: string;
  email: string;
  role: string;
  userAccess: string[];
};
export type TResetDetails = {
  email: string;
  otp?: number;
  iat: number;
  exp: number;
};
export type TCategory = {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  isApproved: boolean;
};
export type TSubCategory = {
  _id: string;
  name: string;
  category: TCategory;
  description?: string;
  isActive: boolean;
  isApproved: boolean;
};
export type TAccessory = {
  _id: string;
  name: string;
  category: TCategory;
  subCategory: TSubCategory;
  image?: string;
  quantityDetails: {
    totalQuantity: number;
    currentQuantity: number;
    distributedQuantity?: number;
    orderQuantity?: number;
  };
  codeDetails: {
    codeTitle: string;
    totalCodes: string[];
    currentCodes: string[];
    distributedCodes?: string[];
    orderCodes?: string[];
  };

  description?: string;
  isItReturnable?: boolean;
  status?: "Available" | "Out of Stock";
  isActive: boolean;
  approvalDetails: {
    isApproved: boolean;
    approvedBy: string;
    approvedDate: string;
  };
  isDeleted: boolean;
};
export type TStock={
  _id:string,
  accessory:TAccessory,
  quantity:number,
  accessoryCodes:string[],
  approvalDetails:{
      isApproved:boolean,
      approvedBy:TUser,
      approvedDate:string
  },
  description:string,
  createdAt:Date,
  updatedAt:Date
}