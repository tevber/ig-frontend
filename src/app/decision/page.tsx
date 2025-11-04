"use client";

import { Button } from "@/components/ui/button";
import { HouseIcon, Images, SearchIcon, SquarePlus, User } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { push } = useRouter();

  return (
    <div className="flex justify-center align-middle flex-col gap-3">
      <div className="text-4xl flex justify-center">Post</div>
      <div className="flex flex-center ml-30">
        <Images size={200} />
      </div>
      <div className="flex justify-center align-middle flex-col gap-3 pl-28">
        <Button
          onClick={() => push("/ai-generate")}
          className="w-50 flex justify-center"
        >
          ai-generate
        </Button>
        <Button onClick={() => push("/gallery")} className="w-50">
          gallery
        </Button>
      </div>
      <div className="fixed  bottom-0  flex justify-around w-full bg-white pt-2 pb-2 border-t-1">
        <HouseIcon onClick={() => push("/")} />
        <SearchIcon onClick={() => push("/search")} />
        <SquarePlus onClick={() => push("/decision")} />
        <User onClick={() => push("/profile")} />
      </div>
    </div>
  );
};

export default Page;
