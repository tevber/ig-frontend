"use client";
import { useUser } from "@/providers/AuthProvider";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { PostType } from "@/app/page";
import { User } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HouseIcon, SearchIcon, SquarePlus, UserCircle } from "lucide-react";

const Page = () => {
  const [postData, setPostData] = useState<PostType[]>([]);
  const [userData, setUserData] = useState<User>();
  const params = useParams();
  const { user, token } = useUser();
  const { push } = useRouter();

  const myId = user?._id;
  const followUser = async (followedUserId: string) => {
    const response = await fetch(
      `https://ig-backend-2u78.onrender.com/toggle-follow/${followedUserId}`,
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
      `https://ig-backend-2u78.onrender.com/post/user-post/${params.userId}`,
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
      `https://ig-backend-2u78.onrender.com/profile/${params.userId}`,
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

  console.log(userData?.bio);

  if (userData?._id === user?._id) {
    push("/profile");
  }
  return (
    <div>
      {" "}
      {
        <div className="border-b-1 flex p-5 ">
          <img
            src={userData?.profilePic || undefined}
            className="rounded-full w-20 h-20"
          />
          <div className="flex justify-center flex-col">
            {userData?.userName}
          </div>
          <div className="p-3">{userData?.bio}</div>
          <div>
            {userData?.followers.includes(myId!) ? (
              <Button onClick={() => followUser(userData!._id)}>
                unfollow
              </Button>
            ) : (
              <Button onClick={() => followUser(userData!._id)}>follow</Button>
            )}
          </div>
        </div>
      }
      <div className="flex justify-around border-b-1">
        <div className="flex flex-col">
          <div>{postData.length}</div>
          <div>posts</div>
        </div>
        <div className="flex flex-col">
          <div>{userData?.followers.length}</div>
          <div>followers</div>
        </div>
        <div className="flex flex-col">
          <div>{userData?.following.length}</div>
          <div>following</div>
        </div>
      </div>
      {
        <div className="p-1 gap-1 flex flex-wrap">
          {postData.map((post, index) => {
            return (
              <div key={index}>
                {" "}
                <img src={post.images[0]} className="w-33 h-45"></img>
              </div>
            );
          })}
        </div>
      }
      <div className="fixed  bottom-0  flex justify-around w-full bg-white pt-2 pb-2">
        <HouseIcon onClick={() => push("/")} />
        <SearchIcon onClick={() => push("/search")} />
        <SquarePlus onClick={() => push("/decision")} />
        <UserCircle onClick={() => push("/profile")} />
      </div>
    </div>
  );
};

export default Page;
