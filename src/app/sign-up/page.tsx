"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";

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
  const [user, setUser] = useState<UserType>({
    userName: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [users, setUsers] = useState<Users[]>([]);

  const handleUserValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "userName") {
      setUser((prev) => {
        return { ...prev, userName: value };
      });
    }
    if (name === "fullName") {
      setUser((prev) => {
        return { ...prev, fullName: value };
      });
    }
    if (name === "email") {
      setUser((prev) => {
        return { ...prev, email: value };
      });
    }
    if (name === "password") {
      setUser((prev) => {
        return { ...prev, password: value };
      });
    }
  };

  const addUserValues = async () => {
    await fetch("http://localhost:4000", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        userName: user.userName,
        fullName: user.fullName,
        email: user.email,
        password: user.password,
      }),
    });
  };

  return (
    <div>
      <Input
        placeholder="userName"
        name="userName"
        onChange={(e) => handleUserValues}
      ></Input>
      <Input
        placeholder="fullName"
        name="fullName"
        onChange={(e) => handleUserValues}
      ></Input>
      <Input
        placeholder="email"
        name="email"
        onChange={(e) => handleUserValues}
      ></Input>
      <Input
        placeholder="password"
        name="password"
        onChange={(e) => handleUserValues}
      ></Input>
      <Button onClick={addUserValues}>submit</Button>
    </div>
  );
};

export default Page();
