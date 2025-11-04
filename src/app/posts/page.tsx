"use client";

import { Header } from "@/icons/header";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import {
  Forward,
  Heart,
  HouseIcon,
  MessageCircle,
  SearchIcon,
  SquarePlus,
  UserCircle,
} from "lucide-react";
import { User } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
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
  const [inputValue, setInputValue] = useState("");
  const [postData, setPostData] = useState<PostType[]>([]);

  const myId = user?._id;

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
      toast.success("success");
    } else {
      toast.error("failure2");
    }
    if (response.ok) {
      await getPosts();
    }
  };

  const deletePost = async (postId: string) => {
    const response = await fetch(
      `https://ig-backend-2u78.onrender.com/post/delete/${postId}`,
      {
        method: "DELETE",
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

  const handleInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value);
  };

  const editPost = async (postId: string) => {
    const response = await fetch(
      `https://ig-backend-2u78.onrender.com/post/edit/${postId}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caption: inputValue,
        }),
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
            <div key={index} className="pt-10">
              <Dialog>
                <DialogTrigger>
                  {" "}
                  <Forward className="flex pl-50" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Options</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone
                    </DialogDescription>
                  </DialogHeader>
                  <Button onClick={() => deletePost(post._id)}>delete</Button>
                  <div>Caption change:</div>
                  <Input onChange={handleInputValue}></Input>
                  <Button onClick={() => editPost(post._id)}>
                    change caption
                  </Button>
                </DialogContent>
              </Dialog>

              {post.images.length === 1 ? (
                <img src={post.images[0]} />
              ) : (
                <div className="flex justify-center pl-4.5">
                  <Carousel className="w-110">
                    <CarouselContent className="w-110">
                      {post.images.map((url, index) => {
                        return (
                          <CarouselItem
                            className="flex aspect-square items-center justify-center p-6 flex-col w-110 "
                            key={index}
                          >
                            <img src={url}></img>
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
              <div className="flex">
                <MessageCircle onClick={() => push(`/comment/${post._id}`)} />
                <div onClick={() => postLike(post._id)}>
                  <div onClick={() => getPosts()}>
                    <div className="flex">
                      {post.likes.includes(myId!) ? (
                        <Heart color="red" fill="red" />
                      ) : (
                        <Heart />
                      )}
                    </div>
                    <div>{post.likes.length}</div>
                  </div>
                </div>
              </div>
              <div>{post.caption}</div>
            </div>
          );
        })}
        <div className="fixed  bottom-0  flex justify-around w-full bg-white pt-2 pb-2">
          <HouseIcon onClick={() => push("/")} />
          <SearchIcon onClick={() => push("/search")} />
          <SquarePlus onClick={() => push("/decision")} />
          <UserCircle onClick={() => push("/profile")} />
        </div>
      </div>
    </div>
  );
}
