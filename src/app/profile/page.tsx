"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/AuthProvider";
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
    const response = await fetch(
      `https://ig-backend-2u78.onrender.com/post/user-post/${user?._id}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
      <div className="border-b-1 flex p-5">
        <div className="fixed bg-white w-full flex justify-center border-b-1 pb-3">
          {user?.userName}
        </div>
      </div>
      <div className="pt-10">
        <div className="flex gap-5">
          <img
            src={user?.profilePic || undefined}
            className="w-20 h-20 rounded-full"
          />
          <Button onClick={() => push("/profile/edit")} className="mt-10">
            edit
          </Button>
        </div>
        <div>{user?.bio}</div>
        <div className="flex justify-around border-b-1">
          <div className="flex flex-col">
            <div>{postData.length}</div>
            <div>posts</div>
          </div>
          <div className="flex flex-col">
            <div>{user?.followers.length}</div>
            <div>followers</div>
          </div>
          <div className="flex flex-col">
            <div>{user?.following.length}</div>
            <div>following</div>
          </div>
        </div>
        {
          <div className="flex pl-1 gap-1">
            {" "}
            {postData.map((post, index) => {
              return (
                <div key={index}>
                  <div onClick={() => push("/posts")}>
                    {" "}
                    <img src={post.images[0]} className="w-33 h-45 "></img>
                  </div>
                </div>
              );
            })}
          </div>
        }
        <div className="fixed  bottom-0  flex justify-around w-full bg-white pt-2 pb-2 border-t-1">
          <HouseIcon onClick={() => push("/")} />
          <SearchIcon onClick={() => push("/search")} />
          <SquarePlus onClick={() => push("/decision")} />
          <User onClick={() => push("/profile")} />
        </div>
      </div>
    </div>
  );
};

export default Page;
