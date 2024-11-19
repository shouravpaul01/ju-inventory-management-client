import { TSelectOption } from "@/src/types";
import { Select, SelectItem, SelectProps } from "@nextui-org/select";
import { useFormContext } from "react-hook-form";

interface IProps {
  name: string;
  selectProps?: SelectProps | {};
  options: TSelectOption[];
}
export default function JUSelect({ name, selectProps, options }: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <Select variant="bordered" {...register(name)} {...selectProps} isInvalid={!!errors[name]}
    errorMessage={errors[name]?.message as string}>
      {options?.map((option) => (
        <SelectItem key={option.value}>{option.label}</SelectItem>
      ))}
    </Select>
  );
}
