"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const SettingsPage = () => {
  const [name, setName] = useState("Islom");
  const [email, setEmail] = useState("islom@example.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/150?img=3");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatar(url);
    }
  };

  const handleSave = () => {
    if (password && password !== confirmPassword) {
      alert("Parollar mos kelmadi!");
      return;
    }
    // Saqlash logikasi (API chaqiruv)
    alert("Sozlamalar saqlandi!");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-gray-900">Sozlamalar</h1>

      {/* Profil Sozlamalari */}
      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <img
              src={avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border border-gray-200"
            />
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Avatarni yangilash
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Ism
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parolni o‘zgartirish */}
      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle>Parolni o‘zgartirish</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Yangi parol"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="Parolni tasdiqlash"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Afzalliklar */}
      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle>Afzalliklar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Bildirishnomalarni yoqish</span>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Tungi rejim</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="mt-2 w-full md:w-40">
        O‘zgarishlarni saqlash
      </Button>
    </div>
  );
};

export default SettingsPage;
