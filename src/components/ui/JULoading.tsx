import { Spinner } from "@heroui/spinner";
import Image from "next/image";

export default function JULoading({ className="h-screen" }: { className?: string }) {
  return (
    <div className={`${className} flex justify-center items-center`}>
      <div className="relative">
        <Spinner classNames={{ wrapper: "w-28 h-28" }} />
        <Image
          src="/ju-logo.png"
          alt="logo"
          width={70}
          height={70}
          className="absolute top-4 left-[22px]"
        />
      </div>
    </div>
  );
}
