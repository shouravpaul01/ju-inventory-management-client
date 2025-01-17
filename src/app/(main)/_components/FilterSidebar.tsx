"use client"

import { getAllCategories } from "@/src/hooks/Category";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox"
import { useState } from "react";

export default function FilterSidebar() {
    const [selected, setSelected] = useState(["buenos-aires", "sydney"]);
//    const {data} =getAllCategories({})
  return (
    <div>
      <div className="">
      <CheckboxGroup
        color="primary"
        label="Select cities"
        value={selected}
        onValueChange={setSelected}
      >
        <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
        <Checkbox value="sydney">Sydney</Checkbox>
        <Checkbox value="san-francisco">San Francisco</Checkbox>
      </CheckboxGroup>
     
    </div>
    </div>
  )
}
