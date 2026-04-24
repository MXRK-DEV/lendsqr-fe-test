"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "lendsqr_userName";
const FALLBACK_NAME = "---";

export function useAuthUser() {
  const [displayName, setDisplayName] = useState(FALLBACK_NAME);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setDisplayName(stored);
    }
  }, []);

  // Extract and persist
  const storeNameFromEmail = useCallback((email: string) => {
    const localPart = email.trim().split("@")[0];
    localStorage.setItem(STORAGE_KEY, localPart);
    setDisplayName(localPart);
  }, []);

  return { displayName, storeNameFromEmail };
}
