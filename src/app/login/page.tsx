"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { IG_LOGO } from "@/icons/ig-logo";
import { toast } from "sonner";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { decodedTokenType, useUser } from "@/providers/AuthProvider";

type UserType = {
  email: string;
  password: string;
};

export default function Page() {
  const { user, setUser, setToken } = useUser();
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
    const response = await fetch("https://ig-backend-2u78.onrender.com/login", {
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
    <div className="flex justify-center flex-col gap-[10px] pt-5">
      <div className="flex justify-center pt-20">
        <IG_LOGO />
      </div>
      <div className=" flex flex-col gap-[10px] pt-20 justify-center">
        <div className="w-100 flex flex-col pl-8 gap-[5px]">
          <Input
            placeholder="email"
            className=""
            name="email"
            onChange={handleLoginValues}
          ></Input>
          <Input
            placeholder="password"
            className=""
            name="password"
            onChange={handleLoginValues}
          ></Input>
          <Button onClick={handleLogin} className="bg-blue-400">
            login
          </Button>
        </div>
        <div className="flex justify-center">
          <div className="w-40 border-1 h-[1px] mt-3 mr-2"></div>
          <div>OR</div>
          <div className="w-40 border-1 h-[1px] mt-3 ml-2"></div>
        </div>
        <div className="flex justify-center">
          <div className="mt-1.5">dont have an account?</div>
          <Button
            onClick={() => push("/sign-up")}
            variant="link"
            className="text-blue-500 underline underline-offset-0"
          >
            make one
          </Button>
        </div>
      </div>
    </div>
  );
}
