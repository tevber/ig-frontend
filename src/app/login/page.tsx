"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "../../../../../instagram/instagram-frontend/src/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { IG_LOGO } from "@/icons/ig-logo";
import { toast } from "sonner";
import { useEffect } from "react";
import { decodedTokenType } from "../../../../../instagram/instagram-frontend/src/providers/AuthProvider";
import { jwtDecode } from "jwt-decode";

type UserType = {
  email: string;
  password: string;
};

export default function Page() {
  const { user, setUser, token, setToken } = useUser();
  const [login, setLogin] = useState<UserType>({
    email: "",
    password: "",
  });
  const { push } = useRouter();

  const handleLoginValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "email") {
      setLogin((prev) => {
        return { ...prev, email: value };
      });
    }
    if (name === "password") {
      setLogin((prev) => {
        return { ...prev, password: value };
      });
    }
  };

  const handleLogin = async () => {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: login.email,
        password: login.password,
      }),
    });
    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);
      setToken(token);
      const decodedToken: decodedTokenType = jwtDecode(token);
      setUser(decodedToken.data);
      push("/");
      toast.success("good");
    }
  };

  useEffect(() => {
    if (user) push("/");
  }, [user]);

  return (
    <div className="flex justify-center flex-col gap-[10px]">
      <IG_LOGO />
      <Input
        placeholder="email"
        className="flex justify-center"
        name="email"
        onChange={handleLoginValues}
      ></Input>
      <Input
        placeholder="password"
        name="password"
        onChange={handleLoginValues}
      ></Input>
      <Button onClick={handleLogin}>login</Button>
      <Button onClick={() => push("/sign-up")}>
        dont have an account? make one
      </Button>
    </div>
  );
}
