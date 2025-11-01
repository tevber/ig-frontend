"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const { push } = useRouter();

  return (
    <div className="flex justify-center align-middle flex-col gap-3">
      <div className="text-4xl flex justify-center">Post</div>
      <div className="flex justify-center align-middle flex-col gap-3 pl-20">
        <Button onClick={() => push("/ai-generate")} className="w-50">
          ai-generate
        </Button>
        <Button onClick={() => push("/gallery")} className="w-50">
          gallery
        </Button>
      </div>
    </div>
  );
};

export default Page;
