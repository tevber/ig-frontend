"use client";

import { Header } from "@/icons/header";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Heart,
  HouseIcon,
  MessageCircle,
  SearchIcon,
  SquarePlus,
  UserCircle,
} from "lucide-react";
import { User } from "../providers/AuthProvider";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    const response = await fetch(
      "https://ig-backend-2u78.onrender.com/post/all-post",
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

  const postLike = async (postId: string) => {
    const response = await fetch(
      `https://ig-backend-2u78.onrender.com/post/toggle-like/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      await getPosts();
    }
  };

  useEffect(() => {
    if (token) {
      getPosts();
    } else {
      push("/login");
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
            <div key={index} className="pt-10 border-1">
              <div className="flex">
                <Avatar onClick={() => push(`/profile/${post.userId._id}`)}>
                  <AvatarImage src={post.userId.profilePic || undefined} />
                  <AvatarFallback>
                    {post.userId.userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>{post.userId.userName}</div>
              </div>
              <div className="flex justify-center">
                {post.images.length === 1 ? (
                  <img
                    src={post.images?.[0] || undefined}
                    loading="lazy"
                    className="justify-center"
                  />
                ) : (
                  <div className="flex justify-center pl-4.5">
                    <Carousel className="w-110">
                      <CarouselContent className="w-110">
                        {post.images.map((url, index) => {
                          return (
                            <CarouselItem
                              className="flex aspect-square items-center justify-center p-6 flex-col w-full"
                              key={index}
                            >
                              <img src={url} loading="lazy"></img>
                              <div className="text-1xl font-semibold flex ">
                                {index + 1} / {post.images.length}
                              </div>
                            </CarouselItem>
                          );
                        })}
                      </CarouselContent>
                    </Carousel>
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <MessageCircle onClick={() => push(`/comment/${post._id}`)} />
                <div onClick={() => postLike(post._id)}>
                  <div className="flex">
                    {post.likes.includes(myId!) ? (
                      <Heart color="red" fill="red" />
                    ) : (
                      <Heart />
                    )}
                  </div>
                </div>
              </div>
              <div>{post.likes.length} likes</div>
              <div className="flex gap-[5px]">
                <div className="font-bold">{post.userId.userName}</div>
                <div>{post.caption}</div>
              </div>
            </div>
          );
        })}
        <div className="fixed  bottom-0  flex justify-around w-full bg-white pt-2 pb-2 border-t-1">
          <HouseIcon onClick={() => push("/")} />
          <SearchIcon onClick={() => push("/search")} />
          <SquarePlus onClick={() => push("/decision")} />
          <UserCircle onClick={() => push("/profile")} />
        </div>
      </div>
    </div>
  );
}
