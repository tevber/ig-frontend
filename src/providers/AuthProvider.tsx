"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  _id: string;
  email: string;
  password: string;
  userName: string;
  bio: string | null;
  profilePic: string | null;
};

type AuthContext = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
};

export type decodedTokenType = {
  data: User;
};

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { push } = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
      const decodedToken: decodedTokenType = jwtDecode(localToken);
      setUser(decodedToken.data);
    }
  }, []);

  const values = {
    user,
    setUser,
    token,
    setToken,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("hoooo");
  }
  return authContext;
};
