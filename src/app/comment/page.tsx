"use client";

import { Header } from "@/icons/header";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Heart,
  HouseIcon,
  SearchIcon,
  SquarePlus,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  const { user, token } = useUser();
  const [comment, setCommentData] = useState();
  const { push } = useRouter();

  const myId = user?._id;

  useEffect(() => {
    if (!user) push("/login");
  }, [user]);

  const postComment = async () => {
    const response = await fetch("http://localhost:4000/post/all-post", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setCommentData(data);
    } else {
      toast.error("failure");
    }
  };

  return (
    <div>
      <div>
        <div className="fixed  bottom-0  flex justify-around w-full bg-white pt-2 pb-2">
          <HouseIcon onClick={() => push("/")} />
          <SearchIcon onClick={() => push("/search")} />
          <SquarePlus onClick={() => push("/ai-generate")} />
          <UserCircle onClick={() => push("/profile")} />
        </div>
      </div>
    </div>
  );
}
