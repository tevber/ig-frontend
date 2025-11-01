"use client";

import { Header } from "@/icons/header";
import { AuthProvider, useUser } from "@/providers/AuthProvider";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import {
  Heart,
  HouseIcon,
  SearchIcon,
  SquarePlus,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { User } from "@/providers/AuthProvider";

type comment = {
  _id: string;
  comment: string;
  post: string;
  userId: string;
  user: User;
};

export default function Home() {
  const { user, token } = useUser();
  const params = useParams();
  const [comments, setComments] = useState<comment[]>([]);
  const [inputValue, setInputValues] = useState("");
  const [userData, setUserData] = useState<User>();
  const { push } = useRouter();

  const postId = params.postid;

  useEffect(() => {
    if (!user) push("/login");
  }, [user]);

  const handleInputValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValues(value);
  };

  const postComment = async () => {
    const response = await fetch(
      "https://ig-backend-2u78.onrender.com/comment/create",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: inputValue,
          postId: postId,
        }),
      }
    );
    if (response.ok) {
      toast.success("success");
    } else {
      toast.error("failure2");
    }
  };

  const deleteComment = async (commentId: string) => {
    const response = await fetch(
      `https://ig-backend-2u78.onrender.com/comment/delete/${commentId}`,
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

  const getUser = async () => {
    const response = await fetch(
      `https://ig-backend-2u78.onrender.com/profile/${user?._id}`,
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

  const getComments = async () => {
    const response = await fetch(
      `https://ig-backend-2u78.onrender.com/comment/get/${postId}`,
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
      setComments(data);
    } else {
      toast.error("failure");
    }
  };

  useEffect(() => {
    if (token) {
      getComments();
      getUser();
    }
  }, []);

  return (
    <div>
      <div className="flex justify-center border-b-1">comments</div>
      {comments.map((comment, index) => {
        return (
          <div key={index} className="flex gap-5">
            <div>{comment.comment}</div>
            <Button
              onClick={() => deleteComment(comment._id)}
              variant="ghost"
              className="h-7 bg-red-100 "
            >
              Delete
            </Button>
          </div>
        );
      })}
      <div className="fixed bottom-10 flex justify-between">
        <Input onChange={handleInputValues} className="w-75"></Input>
        <Button onClick={() => postComment()}>comment</Button>
      </div>

      <div>
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
