import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
export type TSelectOption={
  value:string,label:string
}
export type TErrorMessage={
  path:string ,
  message:string
}
export type TQuery={
  name:string ,
  value:any
}
export type TUser = {
  _id:string;
  userId: string;
  faculty:TFaculty;
  email:string;
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
  _id:string;
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
export type TRole={
  Admin:string,
  Faulty:string
}
export type TCurrentUser={
  _id: string; 
  name: string; 
  profileImage: string | null; 
  userId: string; 
  email: string; 
  role: string; 
  userAccess: string[];
}
export type TResetDetails = {
  email: string;
  otp?:number;
  iat: number,
  exp: number,
};