"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState, useEffect } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { decodedTokenType, useUser } from "@/providers/AuthProvider";
import { HouseIcon, SearchIcon, SquarePlus, User } from "lucide-react";

type PostType = {
  userId: string;
  images: string[];
  caption: string;
};

const Page = () => {
  const { push } = useRouter();
  const { token, user } = useUser();
  const [postData, setPostData] = useState<PostType[]>([]);

  const getPosts = async () => {
    const response = await fetch("http://localhost:4000/post/all-post", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setPostData(data);
  };

  useEffect(() => {
    if (token) {
      getPosts();
    }
  }, [token]);

  return (
    <div>
      {" "}
      <div className="fixed bg-white w-full flex justify-center border-b-1 pb-3">
        {user?.userName}
      </div>
      <div className="pt-10">
        <Button onClick={() => push("/edit")}>edit</Button>
        <div className="fixed  bottom-0  flex justify-around w-full bg-white pt-2 pb-2 border-t-1">
          <HouseIcon onClick={() => push("/")} />
          <SearchIcon onClick={() => push("/search")} />
          <SquarePlus onClick={() => push("/ai-generate")} />
          <User onClick={() => push("/profile")} />
        </div>
      </div>
    </div>
  );
};

export default Page;
