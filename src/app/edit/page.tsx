"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState, useEffect } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { decodedTokenType, useUser } from "@/providers/AuthProvider";
import { HouseIcon, SearchIcon, SquarePlus, User } from "lucide-react";

type PostType = {
  userId: string;
  images: string[];
  caption: string;
};

const Page = () => {
  const { push } = useRouter();
  const { setToken, token, setUser, user } = useUser();
  const [postData, setPostData] = useState<PostType[]>([]);
  const [ifClicked, setIfClicked] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value);
  };

  const addPicValues = async () => {
    const response = await fetch("http://localhost:4000/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        profilePic: inputValue,
      }),
    });
    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);
      setToken(token);
      const decodedToken: decodedTokenType = jwtDecode(token);
      setUser(decodedToken.data);
      toast.success("good");
    } else {
      toast.error("sad ):");
    }
  };

  return (
    <div>
      {" "}
      <div className="fixed bg-white w-full flex justify-center border-b-1">
        Edit Profile
      </div>
      <div>Edit Profile</div>
      <div>
        <img src={user?.profilePic} />
        <div>{user?.userName}</div>
        <div onClick={() => setIfClicked(true)}>Change Photo</div>
        {ifClicked ? (
          <div>
            <Input onChange={handleInputValue}></Input>{" "}
            <Button onClick={() => setIfClicked(false)}>cancel</Button>
            <Button onClick={() => addPicValues()}>set new pic</Button>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default Page;
