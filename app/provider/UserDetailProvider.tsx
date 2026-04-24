"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUsers, type UserData } from "@/hooks/useUsers";
import UserDetailCard from "@/app/components/UserDetail";
import UserContext from "@/context/UserContext";
import styles from "./UserDetailProvider.module.scss";

const STORAGE_KEY = (id: string) => `user_detail_${id}`;

export default function UserDetailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const id = params?.id as string;

  const { data: users = [], isLoading, error } = useUsers();
  const [cachedUser, setCachedUser] = useState<UserData | null>(null);

  // Load from localStorage
  useEffect(() => {
    if (!id) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY(id));
      if (stored) {
        setCachedUser(JSON.parse(stored));
      }
    } catch {}
  }, [id]);

  // Persist
  const liveUser = users.find((u) => u.id === id);

  useEffect(() => {
    if (!liveUser) return;
    try {
      localStorage.setItem(STORAGE_KEY(liveUser.id), JSON.stringify(liveUser));
      setCachedUser(liveUser);
    } catch {}
  }, [liveUser]);

  const user = liveUser ?? cachedUser;

  if ((isLoading && !user) || !id) {
    return (
      <div className={styles.centerScreen}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Loading user data...</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className={styles.centerScreen}>
        <div className={styles.errorText}>
          Failed to load users. Please refresh.
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.centerScreen}>
        <div className={styles.errorText}>User not found. ID: {id}</div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={user}>
      <div className={styles.wrapper}>
        <UserDetailCard user={user} />
        {children}
      </div>
    </UserContext.Provider>
  );
}
