"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "lendsqr_userName";
const FALLBACK_NAME = "---";

export function useAuthUser() {
  const [displayName, setDisplayName] = useState(FALLBACK_NAME);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setDisplayName(stored);
  }, []);

  const storeNameFromEmail = useCallback((email: string) => {
    const localPart = email.trim().split("@")[0];
    localStorage.setItem(STORAGE_KEY, localPart);
    setDisplayName(localPart);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setDisplayName(FALLBACK_NAME);
    router.push("/login");
  }, [router]);

  return { displayName, storeNameFromEmail, logout };
}
