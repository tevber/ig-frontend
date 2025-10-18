"use client";
import { useUser } from "@/providers/AuthProvider";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { PostType } from "@/app/page";
import { User } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Heart,
  HouseIcon,
  SearchIcon,
  SquarePlus,
  UserCircle,
} from "lucide-react";

const Page = () => {
  const [postData, setPostData] = useState<PostType[]>([]);
  const [userData, setUserData] = useState<User>();
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

  const getPosts = async () => {
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

  const getUser = async () => {
    const response = await fetch(
      `http://localhost:4000/profile/${params.userId}`,
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
      console.log(data);
      setUserData(data);
    } else {
      toast.error("failure");
    }
  };

  useEffect(() => {
    if (token) {
      getPosts();
      getUser();
    }
  }, [token]);
  return (
    <div>
      {" "}
      <div className="border-b-1">
        <img src={userData?.profilePic} />
        <div className="flex justify-center">{userData?.userName}</div>
        <div>{userData?.bio}</div>
        <div>
          {user?.followers.includes(myId!) ? (
            <Button onClick={() => followUser(userData!._id)}>unfollow</Button>
          ) : (
            <Button onClick={() => followUser(userData?._id!)}>follow</Button>
          )}
        </div>
      </div>
      <div className="flex justify-around border-b-1">
        <div className="flex flex-col">
          <div>{userData?.followers.length}</div>
          <div>followers</div>
        </div>
        <div className="flex flex-col">
          <div>{userData?.following.length}</div>
          <div>following</div>
        </div>
      </div>
      <div className="p-1 gap-1 flex flex-wrap">
        {postData.map((post, index) => {
          return (
            <div key={index}>
              {" "}
              <img src={post.images} className="w-33 h-45"></img>
            </div>
          );
        })}
      </div>
    </div>
  );

  <div className="fixed  bottom-0  flex justify-around w-full bg-white pt-2 pb-2">
    <HouseIcon onClick={() => push("/")} />
    <SearchIcon onClick={() => push("/search")} />
    <SquarePlus onClick={() => push("/ai-generate")} />
    <UserCircle onClick={() => push("/profile")} />
  </div>;
};

export default Page;
