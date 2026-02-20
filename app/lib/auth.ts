import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "../lib/api";

type LoginPayload = {
  userName: string;
  password: string;
};

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  role: string;
  coins: number;
  avatar: string;
  grade?: string;
};

type LoginResponse = {
  token: string;
  user: User;
};

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginPayload): Promise<LoginResponse> => {
      const { data } = await api.post("/auth/login", payload);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("zooko_token", data.token);
      localStorage.setItem("zooko_user", JSON.stringify(data.user));
      router.push("/dashboard");
    },
  });
}

type RegisterPayload = {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  grade: string;
};

type RegisterResponse = {
  token: string;
  user: User;
  message: string;
};

export function usePublicRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: RegisterPayload): Promise<RegisterResponse> => {
      const { data } = await api.post("/auth/public-register", payload);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("zooko_token", data.token);
      localStorage.setItem("zooko_user", JSON.stringify(data.user));
      router.push("/dashboard");
    },
  });
}

export function useLogout() {
  const router = useRouter();

  return () => {
    localStorage.removeItem("zooko_token");
    localStorage.removeItem("zooko_user");
    router.push("/login");
  };
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("zooko_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("zooko_token");
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}

// Refresh stored user data from server (picks up grade changes from admin)
export function useRefreshUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      // Update stored user with fresh data
      const stored = getStoredUser();
      if (stored) {
        const updated = { ...stored, grade: data.grade, coins: data.coins, avatar: data.avatar };
        localStorage.setItem("zooko_user", JSON.stringify(updated));
      }
      return data;
    },
    enabled: isAuthenticated(),
    staleTime: 5 * 60 * 1000, // refresh every 5 minutes
  });
}
