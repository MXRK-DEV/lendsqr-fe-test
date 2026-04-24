"use client";

import { createContext, useContext } from "react";
import { type UserData } from "@/hooks/useUsers";

const UserContext = createContext<UserData | undefined>(undefined);

export const useUser = () => useContext(UserContext);

export default UserContext;
