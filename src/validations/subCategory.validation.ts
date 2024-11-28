import { z } from "zod";

export const subCategoryValidation=z.object({
    name:z.string().nonempty("Name is required."),
    category:z.string().nonempty("Category is required.")
})