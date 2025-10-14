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
import { User } from "../providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type PostType = {
  _id: string;
  images: string[];
  caption: string;
  likes: string[];
  userId: User;
};

export default function Home() {
  const { user, token } = useUser();
  const { push } = useRouter();
  const [postData, setPostData] = useState<PostType[]>([]);

  const myId = user?._id;

  const getPosts = async () => {
    const response = await fetch("http://localhost:4000/post/all-post", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setPostData(data);
    } else {
      toast.error("failure");
    }
  };

  const postLike = async (postId: string) => {
    const response = await fetch(
      `http://localhost:4000/post/toggle-like/${postId}`,
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

  useEffect(() => {
    if (!user) push("/login");
  }, [user]);

  useEffect(() => {
    if (token) {
      getPosts();
    }
  }, [token]);

  return (
    <div>
      <div className="fixed bg-white w-full">
        {" "}
        <Header></Header>{" "}
      </div>
      <div className="pb-10 pt-10">
        {postData.map((post, index) => {
          return (
            <div key={index}>
              <div onClick={() => push(`/profile/${post.userId._id}`)}>
                <div>{post.userId.userName}</div>
                {post.userId.followers.includes(myId!) ? (
                  <Button onClick={() => followUser(post.userId._id)}>
                    follow
                  </Button>
                ) : (
                  <Button onClick={() => followUser(post.userId._id)}>
                    follow
                  </Button>
                )}
              </div>
              <img src={post.images[0]}></img>

              <div>{post.caption}</div>
              <div>{post.likes}</div>
              <div className="flex">
                <div onClick={() => postLike(post._id)}>
                  <div className="flex">
                    {post.likes.includes(myId!) ? (
                      <Heart color="red" fill="red" />
                    ) : (
                      <Heart />
                    )}
                    <div>{post.likes.length}</div>
                  </div>
                </div>
              </div>
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
    </div>
  );
}
