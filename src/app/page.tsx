"use client";

import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Home() {
  const { user } = useUser();
  const { push } = useRouter();

  useEffect(() => {
    if (!user) push("/login");
  }, [user]);

  return (
    <div>
      {" "}
      <div>{user?.userName}</div>
    </div>
  );
}
