"use client";
import { ReactNode } from "react";
import { FormProvider, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";


interface IFormConfig {
  defaultValues?: Record<string, any>;
  resolver?: any;
  reset?: boolean;
}
interface IProps extends IFormConfig {
  children: ReactNode;
  methods: UseFormReturn;
  onSubmit: SubmitHandler<any>;

}
export default function JUForm({
  children,
  methods,
  onSubmit,
  
}: IProps) {
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
