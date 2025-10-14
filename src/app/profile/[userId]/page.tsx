"use client";
import { useUser } from "@/providers/AuthProvider";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { PostType } from "@/app/page";
import { User } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Heart,
  HouseIcon,
  SearchIcon,
  SquarePlus,
  UserCircle,
} from "lucide-react";

const Page = () => {
  const [postData, setPostData] = useState<PostType[]>([]);
  const params = useParams();
  const { user, token } = useUser();
  const { push } = useRouter();

  const myId = user?._id;
  const followUser = async (followedUserId: string) => {
    const response = await fetch(
      `http://localhost:4000/toggle-follow/${followedUserId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      toast.success("success");
    } else {
      toast.error("failure2");
    }
  };

  const getUser = async () => {
    const response = await fetch(
      `http://localhost:4000/post/user-post/${params.userId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setPostData(data);
    } else {
      toast.error("failure");
    }
  };
  return (
    <div>
      <div className="border-b-1">
        <img src={user?.profilePic} />
        <div>{user?.userName}</div>
        <div>{user?.bio}</div>
        <div>{params.userId}</div>
        <div>
          {user?.followers.includes(myId!) ? (
            <Button onClick={() => followUser(user?._id)}>unfollow</Button>
          ) : (
            <Button onClick={() => followUser(user?._id!)}>follow</Button>
          )}
        </div>
      </div>
      <div className="flex justify-around border-b-1">
        <div className="flex flex-col">
          <div>{user?.followers.length}</div>
          <div>followers</div>
        </div>
        <div className="flex flex-col">
          <div>{user?.following.length}</div>
          <div>following</div>
        </div>
      </div>
      {postData.map((post, index) => {
        return (
          <div key={index}>
            {" "}
            <img src={post.images}></img>
          </div>
        );
      })}
      <div className="fixed  bottom-0  flex justify-around w-full bg-white pt-2 pb-2">
        <HouseIcon onClick={() => push("/")} />
        <SearchIcon onClick={() => push("/search")} />
        <SquarePlus onClick={() => push("/ai-generate")} />
        <UserCircle onClick={() => push("/profile")} />
      </div>
    </div>
  );
};

export default Page;
