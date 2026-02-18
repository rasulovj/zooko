"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, useRefreshUser } from "../lib/auth";
import ZookoLoader from "./ZookoLoader";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  // Refresh user data from server to pick up grade changes
  useRefreshUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <ZookoLoader size={100} />
      </div>
    );
  }

  return <>{children}</>;
}
