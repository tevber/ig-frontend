"use client";
import { useUser } from "@/providers/AuthProvider";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { HouseIcon, SearchIcon, SquarePlus, UserCircle } from "lucide-react";

type UserType = {
  _id: string;
  email: string;
  password: string;
  userName: string;
  bio: string | null;
  profilePic: string | null;
  followers: string[];
  following: string[];
};

const Page = () => {
  const { token } = useUser();
  const { push } = useRouter();
  const [inputValue, setInputValues] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);

  const handleInputValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValues(value);
  };

  const Search = async () => {
    const response = await fetch(
      `https://ig-backend-2u78.onrender.com/search`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();

    setUsers(data);
  };

  useEffect(() => {
    if (token) {
      Search();
    }
  }, [token]);

  return (
    <div>
      <div className="fixed  top-0  flex justify-around w-full bg-white pt-2 pb-2 border-b-1">
        <Input
          onChange={handleInputValues}
          placeholder="search option..."
          className="w-40"
        ></Input>
      </div>
      <div className="pt-15 gap-5">
        {users
          ?.filter((userInfo) => {
            return userInfo.userName.toLowerCase() === inputValue.toLowerCase();
          })
          .map((userInfo, index) => {
            return (
              <div key={index}>
                <div
                  className="flex"
                  onClick={() => push(`/profile/${userInfo?._id}`)}
                >
                  <Avatar>
                    <AvatarImage src={userInfo.profilePic || undefined} />
                    <AvatarFallback>
                      {userInfo.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="pt-5">{userInfo.userName}</div>

                  <div className="text-gray-500 pl-45 pt-5">
                    {userInfo.email}
                  </div>
                </div>
              </div>
            );
          })}
        <div className="fixed  bottom-0  flex justify-around w-full bg-white pt-2 pb-2">
          <HouseIcon onClick={() => push("/")} />
          <SearchIcon onClick={() => push("/search")} />
          <SquarePlus onClick={() => push("decision")} />
          <UserCircle onClick={() => push("/profile")} />
        </div>
      </div>
    </div>
  );
};

export default Page;
