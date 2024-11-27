"use client";
import { ReactNode, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { TErrorMessage } from "@/src/types";

interface IFormConfig {
  defaultValues?: Record<string, any>;
  resolver?: any;
  reset?: boolean;
}
interface IProps extends IFormConfig {
  children: ReactNode;
  onSubmit: SubmitHandler<any>;
  validation?: ZodType<any, any>;
  errors?: TErrorMessage[];
}
export default function JUForm({
  children,
  onSubmit,
  defaultValues,
  validation,
  reset,
  errors,
}: IProps) {
  const formConfig: IFormConfig = {};

  if (defaultValues) {
    formConfig["defaultValues"] = defaultValues;
  }
  if (validation) {
    formConfig["resolver"] = zodResolver(validation);
  }
  const methods = useForm(formConfig);
  //Handle server side vailidation errors
  useEffect(() => {
    if (Array.isArray(errors) && errors?.length! > 0) {
    
      errors?.forEach((err: TErrorMessage) => {
        methods.setError(err.path, { type: "server", message: err.message });
      });
    }
    if (reset) {
     
      methods.reset();
    }
  }, [errors, reset]);
  useEffect(() => {
    methods.reset();
  }, []);
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
