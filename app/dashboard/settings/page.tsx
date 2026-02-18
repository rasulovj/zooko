"use client";

import { useState, useEffect, useRef } from "react";
import { getStoredUser } from "../../lib/auth";
import { useTheme } from "../../providers/ThemeProvider";
import api from "../../lib/api";
import { User, Camera, Save, Eye, EyeOff, Sun, Moon, KeyRound, AtSign } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function SettingsPage() {
  const user = getStoredUser();
  const { theme, toggleTheme } = useTheme();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setUserName(user.userName || "");
      setAvatar(user.avatar || "");
    }
  }, []);

  const handleAvatarUpload = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const { data } = await api.post("/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      setAvatar(data.url);
    } catch {
      setMessage({ type: "error", text: "Rasmni yuklashda xatolik" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (password && password !== confirmPassword) {
      setMessage({ type: "error", text: "Parollar mos kelmaydi" });
      return;
    }
    if (password && password.length < 6) {
      setMessage({ type: "error", text: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const payload: any = { firstName, lastName, userName, avatar };
      if (password) payload.password = password;

      const { data } = await api.put("/auth/profile", payload);
      localStorage.setItem("zooko_user", JSON.stringify({
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        role: data.role,
        coins: data.coins,
        avatar: data.avatar,
        grade: data.grade,
      }));
      setPassword("");
      setConfirmPassword("");
      setMessage({ type: "success", text: "Profil muvaffaqiyatli yangilandi!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Xatolik yuz berdi" });
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = avatar
    ? avatar.startsWith("http") ? avatar : `${API_URL}${avatar}`
    : null;

  const inputClass = "w-full h-12 px-4 bg-[var(--input-bg)] border-2 border-[var(--input-border)] rounded-xl text-base text-[var(--foreground)] placeholder:text-[var(--foreground)]/25 focus:outline-none focus:ring-2 focus:ring-[var(--green-300)]/30 focus:border-[var(--green-600)]/30";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>
        Sozlamalar
      </h1>

      {/* Avatar */}
      <div className="bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-2xl p-6">
        <h2 className="text-base font-bold text-[var(--foreground)] mb-4">Profil rasmi</h2>
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-[var(--green-50)] flex items-center justify-center overflow-hidden border-2 border-[var(--card-border)]">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-[var(--green-600)]" />
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-[var(--green-600)] text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-md"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handleAvatarUpload(e.target.files[0]); }} />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--foreground)]">{firstName} {lastName}</p>
            <p className="text-xs text-[var(--foreground)]/50">@{userName}</p>
            {uploading && <p className="text-xs text-[var(--green-600)] mt-1">Yuklanmoqda...</p>}
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-[var(--foreground)] mb-2">Shaxsiy ma'lumotlar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[var(--foreground)]/50 mb-1.5 block">Ism</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ism" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-[var(--foreground)]/50 mb-1.5 block">Familiya</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Familiya" className={inputClass} />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-[var(--foreground)]/50 mb-1.5 block flex items-center gap-1.5"><AtSign className="w-3.5 h-3.5" /> Foydalanuvchi nomi</label>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="username" className={inputClass} />
        </div>
      </div>

      {/* Password */}
      <div className="bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-[var(--foreground)] mb-2 flex items-center gap-2"><KeyRound className="w-4 h-4 text-[var(--green-600)]" /> Parolni o'zgartirish</h2>
        <div>
          <label className="text-xs font-bold text-[var(--foreground)]/50 mb-1.5 block">Yangi parol</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Yangi parol" className={inputClass} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30 hover:text-[var(--foreground)]/60">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-[var(--foreground)]/50 mb-1.5 block">Parolni tasdiqlang</label>
          <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Parolni qayta kiriting" className={inputClass} />
        </div>
        {password && <p className="text-xs text-[var(--foreground)]/40">Bo'sh qoldiring — parol o'zgarmaydi</p>}
      </div>

      {/* Theme */}
      <div className="bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-2xl p-6">
        <h2 className="text-base font-bold text-[var(--foreground)] mb-4">Mavzu</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Moon className="w-5 h-5 text-[var(--green-600)]" /> : <Sun className="w-5 h-5 text-[var(--green-600)]" />}
            <span className="text-sm font-medium text-[var(--foreground)]">{theme === "dark" ? "Tungi rejim" : "Kunduzgi rejim"}</span>
          </div>
          <button onClick={toggleTheme}
            className="w-14 h-8 rounded-full relative transition-colors"
            style={{ background: theme === "dark" ? "var(--green-600)" : "var(--input-border)" }}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${theme === "dark" ? "left-7" : "left-1"}`} />
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-[var(--green-600)] text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-[var(--green-600)]/15">
        <Save className="w-5 h-5" />
        {saving ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </div>
  );
}
