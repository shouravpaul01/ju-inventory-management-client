import { z } from "zod";

export const accessoryValidation=z.object({
    category:z.string().nonempty("Category is required."),
    subCategory:z.string().nonempty("Sub Category is required."),
    isItReturnable:z.string().nonempty("Returnable is required."),
    name:z.string().nonempty("Name is required."),
    codeTitle:z.string().nonempty("Code title is required."),
    quantity:z.number({required_error:"Quantity is required.",invalid_type_error:"Quantity is required."}),
    description:z.string().optional()
})