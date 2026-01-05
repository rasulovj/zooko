"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Iltimos, email va parolni kiriting");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      router.push("/dashboard"); // Dashboard sahifasiga yo'naltirish
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <Card className="w-full max-w-md rounded-3xl shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-bold text-xl">
            Z
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Xush kelibsiz
          </CardTitle>
          <p className="mt-2 text-sm text-gray-600">
            Zooko bilan o‘rganishni davom ettirish uchun tizimga kiring
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="siz@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Parol</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Kirish..." : "Kirish"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
