"use client"
import { XmarkIcon } from '@/src/components/icons';
import { limitOptions, orderEventOptions } from '@/src/constents';
import { Button } from '@nextui-org/button';
import { DateRangePicker } from '@nextui-org/date-picker';
import { Select, SelectItem } from '@nextui-org/select';
import { Tooltip } from '@nextui-org/tooltip';
import React, { useState } from 'react'

export default function ManageOrdersPage() {
    const [dateRange, setDateRange] = useState<any>();
      const [approvalStatus, setApprovalStatus] = useState("");
      const [page, setPage] = useState<number>(1);
      const [limit, setLimit] = useState(5);
      const handleFilterClear = () => {
        setPage(1);
        setLimit(5);
        setApprovalStatus("");
        setDateRange(null);
      };
  return (
    <div>
      <div className="flex border-b pb-2">
        <p className="text-lg font-bold flex-1">
           Manage Accessories
        </p>
        
      </div>
      <div className="flex flex-col md:flex-row  items-center justify-end gap-2 my-4">
                  
                
                    <DateRangePicker
                      className="max-w-[250px] "
                      label="Filter By Date"
                      variant="bordered"
                      showMonthAndYearPickers
                      pageBehavior="single"
                      value={dateRange!}
                      onChange={(date: any) => setDateRange(date)}
                    />
                    <Select
                      className="max-w-[150px]"
                      label="Filter By Event"
                      placeholder="Select Option"
                      variant="bordered"
                      selectedKeys={[approvalStatus]}
                      onChange={(option: any) =>
                        setApprovalStatus(option.target.value)
                      }
                    >
                      {orderEventOptions.map((option) => (
                        <SelectItem key={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      className="max-w-20"
                      label="Limit"
                      placeholder="Select Limit"
                      variant="bordered"
                      selectedKeys={[limit]}
                      onChange={(option: any) => setLimit(option.target.value)}
                    >
                      {limitOptions.map((option) => (
                        <SelectItem key={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                    {(!!dateRange || !!approvalStatus) && (
                      <Tooltip
                        content="Clear Filter"
                        showArrow={true}
                        color="foreground"
                      >
                        <Button
                          className="size-6"
                          radius="full"
                          isIconOnly
                          onPress={() => handleFilterClear()}
                        >
                          <XmarkIcon />
                        </Button>
                      </Tooltip>
                    )}
                  
                </div>
    </div>
  )
}
