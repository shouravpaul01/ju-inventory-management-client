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
export type TUser = {
  _id:string;
  userId: string;
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
  user?:TUser;
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