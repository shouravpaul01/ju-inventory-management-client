"use client"
import { ReactNode } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  ZodType } from "zod";

interface IFormConfig {
  defaultValues?: Record<string, any>;
  resolver?: any;
}
interface IProps extends IFormConfig {
  children: ReactNode;
  onSubmit: SubmitHandler<any>;
  validation?: ZodType<any, any>;
}
export default function JUForm({
  children,
  onSubmit,
  defaultValues,
  validation,
}: IProps) {
  const formConfig: IFormConfig = {};
  

  if (defaultValues) {
    formConfig["defaultValues"] = defaultValues;
  }
  if (validation) {
    formConfig["resolver"] = zodResolver(validation);
  }
  const methods = useForm(formConfig);
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
