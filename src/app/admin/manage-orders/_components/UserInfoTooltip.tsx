import { InfoIcon } from "@/src/components/icons";
import { TUser } from "@/src/types";
import { Image } from "@heroui/image";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";

export default function UserInfoTooltip({ user }: { user: TUser }) {
  return (
    <div className="flex items-center gap-3 ">
      <div className="flex flex-col items-center justify-center gap-1">
      <Avatar
        showFallback
        className="w-20 h-20 text-large"
        radius="md"
        src={user?.faculty?.image}
      />
      <Button size="sm" color="primary" variant="flat" radius="full" className="shadow">More Info</Button>
      </div>
      <div>
        <div className="flex items-center gap-1">
          <span>Name:</span>
          <p className="text-sm font-bold">{user?.faculty?.name}</p>
        </div>

        <div className="flex items-center gap-1">
          <span>User ID:</span>
          <p className="text-sm font-bold">{user?.userId}</p>
        </div>
        <div className="flex items-center gap-1">
          <span>Room No:</span>
          <p className="text-sm font-bold">{user?.faculty?.roomNo}</p>
        </div>
        <div className="flex items-center gap-1">
          <span>Email:</span>
          <p className="text-sm font-bold">{user?.email}</p>
        </div>
        <div className="flex items-center gap-1">
          <span>Designation:</span>
          <p className="text-sm font-bold">{user?.faculty?.designation}</p>
        </div>
      </div>
    </div>
  );
}
