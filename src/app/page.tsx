"use client";

import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function Home() {
  const { user } = useUser();
  const { push } = useRouter();

  if (!user) push("/login");

  return <div>{user?.userName}</div>;
}
