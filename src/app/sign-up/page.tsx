"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { decodedTokenType, useUser } from "@/providers/AuthProvider";
import { IG_LOGO } from "@/icons/ig-logo";

type UserType = {
  userName: string;
  fullName: string;
  email: string;
  password: string;
};

type Users = {
  _id: string;
  userName: string;
  fullName: string;
  email: string;
  password: string;
  followers: object;
  following: object;
  bio: string;
  profilePic: string;
  createdAt: Date;
  UpdatedAt: Date;
};

const Page = () => {
  const { user, setUser, token, setToken } = useUser();
  const [userInfo, setUserInfo] = useState<UserType>({
    userName: "",
    fullName: "",
    email: "",
    password: "",
  });
  const { push } = useRouter();

  const handleUserValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "userName") {
      setUserInfo((prev) => {
        return { ...prev, userName: value };
      });
    }
    if (name === "fullName") {
      setUserInfo((prev) => {
        return { ...prev, fullName: value };
      });
    }
    if (name === "email") {
      setUserInfo((prev) => {
        return { ...prev, email: value };
      });
    }
    if (name === "password") {
      setUserInfo((prev) => {
        return { ...prev, password: value };
      });
    }
  };

  const addUserValues = async () => {
    const response = await fetch(
      "https://ig-backend-2u78.onrender.com/signup",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          userName: userInfo.userName,
          fullName: userInfo.fullName,
          email: userInfo.email,
          password: userInfo.password,
        }),
      }
    );
    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);
      setToken(token);
      const decodedToken: decodedTokenType = jwtDecode(token);
      setUser(decodedToken.data);
      push("/");
      toast.success("good");
    } else {
      toast.error("sad ):");
    }
  };

  return (
    <div className="gap-[10px]">
      <div className="pt-30">
        <div className="flex justify-center mb-10">
          <IG_LOGO />
        </div>
        <div className="flex justify-center mb-10 w-100 flex-wrap text-gray-500 font-bold">
          <div>sign up to see photos and videos of your friends</div>
        </div>
        <div className="flex justify-center flex-col w-85 ml-10">
          <div className="pt-1">
            <Input
              placeholder="userName"
              name="userName"
              onChange={handleUserValues}
            ></Input>
          </div>
          <div className="pt-1">
            <Input
              placeholder="fullName"
              name="fullName"
              onChange={handleUserValues}
            ></Input>
          </div>
          <div className="pt-1">
            <Input
              placeholder="email"
              name="email"
              onChange={handleUserValues}
            ></Input>
          </div>
          <div className="pt-1">
            <Input
              placeholder="password"
              name="password"
              onChange={handleUserValues}
            ></Input>
          </div>

          <Button onClick={addUserValues} className="mt-5 w-full bg-blue-400">
            submit
          </Button>
          <div className="flex ml-27 mt-10">Have an account?</div>
          <Button
            onClick={() => push("/login")}
            variant="link"
            className="text-blue-500 underline underline-offset-0 text-2xl"
          >
            log in
          </Button>
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default Page;
