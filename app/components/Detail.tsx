"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : undefined;

  useEffect(() => {
    if (id) {
      router.replace(`/users/detail/${id}/general`);
    }
  }, [id, router]);

  return null;
}
