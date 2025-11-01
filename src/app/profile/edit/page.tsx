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
  const [imageUrl, setImageUrl] = useState("");

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
  const uploadImage = async () => {
    if (!file) return;
    const uploaded = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });

    setImageUrl(uploaded.url);
  };

  const addPicValues = async () => {
    const response = await fetch(
      `https://ig-backend-2u78.onrender.com/edit-pic/${user?._id}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profilePic: imageUrl,
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

  console.log(names.bio);

  return (
    <div>
      {" "}
      <div className="fixed bg-white w-full flex justify-center border-b-1">
        Edit Profile
      </div>
      <div>Edit Profile</div>
      <div className="flex flex-col">
        <img
          src={user?.profilePic || undefined}
          className="rounded-full w-10 h-10"
          onClick={() => push("/profile")}
        />
        <div>{user?.userName}</div>
        <Dialog>
          <DialogTrigger>
            {" "}
            <div>edit picture</div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Options</DialogTitle>
            </DialogHeader>
            <div>Caption change:</div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFile}
            ></Input>{" "}
            <Button onClick={() => uploadImage()}>
              set new picture (click first)
            </Button>
            <Button onClick={() => addPicValues()}>
              set new picture (click second)
            </Button>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            {" "}
            <div>edit userName and bio</div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Options</DialogTitle>
            </DialogHeader>
            <div>changes:</div>
            <Input
              onChange={handleChanges}
              name="bio"
              placeholder="bio..."
            ></Input>
            <Input
              onChange={handleChanges}
              name="userName"
              placeholder="userName..."
            ></Input>
            {""}
            <Button onClick={() => updateInfo()}>update your info</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
