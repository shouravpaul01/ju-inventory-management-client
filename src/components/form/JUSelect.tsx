import { TSelectOption } from "@/src/types";
import { Select, SelectItem, SelectProps } from "@nextui-org/select";
import { ChangeEvent } from "react";

import { useFormContext } from "react-hook-form";

interface IProps {
  name: string;
  selectProps?: SelectProps | {};
  options: TSelectOption[];
  onChange?:(value: string) => void;
}
export default function JUSelect({ name, selectProps, options,onChange }: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const handleChange = (selectedValue: any) => {
     
    onChange?.(selectedValue.target?.value);  
  };
  return (
    <Select variant="bordered" {...register(name)} {...selectProps} isInvalid={!!errors[name]}
    errorMessage={errors[name]?.message as string} onChange={handleChange}>
      {options?.map((option) => (
        <SelectItem key={option.value}>{option.label}</SelectItem>
      ))}
    </Select>
  );
}
