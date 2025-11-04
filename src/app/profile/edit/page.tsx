"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState, useEffect } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useUser } from "@/providers/AuthProvider";
import { Forward, HouseIcon, SearchIcon, SquarePlus, User } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserInfoType = {
  bio: string;
  userName: string;
};

const Page = () => {
  const { push } = useRouter();
  const { setToken, token, setUser, user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [names, setNames] = useState<UserInfoType>({
    bio: "",
    userName: `${user?.userName}`,
  });

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };
  const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "bio") {
      setNames((prev) => {
        return { ...prev, bio: value };
      });
    }
    if (name === "userName") {
      setNames((prev) => {
        return { ...prev, userName: value };
      });
    }
  };

  const addPicValues = async () => {
    if (!file) return;
    const uploaded = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });

    const response = await fetch(
      `https://ig-backend-2u78.onrender.com/edit-pic/${user?._id}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profilePic: uploaded.url,
        }),
      }
    );
    if (response.ok) {
      toast.success("success");
    } else {
      toast.error("failure2");
    }
  };

  const updateInfo = async () => {
    const response = await fetch(
      `https://ig-backend-2u78.onrender.com/updateInfo`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio: names.bio,
          userName: names.userName,
        }),
      }
    );
    if (response.ok) {
      toast.success("success");
    }
  };

  return (
    <div className="ml-3 mr-3">
      {" "}
      <div className="fixed bg-white w-full flex justify-center border-b-1">
        Edit Profile
      </div>
      <div>Edit Profile</div>
      <div className="flex flex-col gap-5">
        <div className="mb-2">change photo:</div>
        <div className="bg-gray-500 flex-col flex h-30 w-100 rounded-2xl">
          <div className="flex ">
            <Avatar onClick={() => push("/profile")} className="w-25 h-25 m-3">
              <AvatarImage src={user?.profilePic || undefined} />
              <AvatarFallback>{user?.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-10">{user?.userName}</div>

            <Dialog>
              <DialogTrigger>
                <div className="bold text-[20px] text-blue-500 bg-gray-600 rounded-3xl w-45 h-10 pt-1">
                  change picture
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change picture</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                ></Input>{" "}
                <Button onClick={() => addPicValues()}>set new picture</Button>{" "}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div> bio: </div>
        <Input onChange={handleChanges} name="bio" placeholder="bio..."></Input>
        <div>userName:</div>
        <Input
          onChange={handleChanges}
          name="userName"
          placeholder="userName..."
        ></Input>
        {""}
        <Button onClick={() => updateInfo()}>update your info</Button>
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
