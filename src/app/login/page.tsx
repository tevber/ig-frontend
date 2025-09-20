"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

type UserType = {
  email: string;
  password: string;
};

const Page = () => {
  const { setUser, user } = useUser();
  const { push } = useRouter();

  const handleLogin = async () => {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: "gg",
        password: "fh",
      }),
    });

    const user = await response.json();

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  if (user) push("/");
  return (
    <div>
      <Input placeholder="email" name="email"></Input>
      <Input placeholder="password" name="password"></Input>
      <Button onClick={handleLogin}>login</Button>
    </div>
  );
};

export default Page();
