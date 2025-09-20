"use client";

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
  email: string;
  userName: string;
  password: string;
  bio: string | null;
  profilePic: string | null;
};

type ContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<null | User>>;
  login: (password: string, email: string) => Promise<void>;
};

export const AuthContext = createContext<ContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = async (password: string, email: string) => {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const user = await response.json();
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const values = { login: login, setUser: setUser, user: user };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("hoooo");
  }
  return authContext;
};
