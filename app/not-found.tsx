"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <h1 className="text-9xl font-extrabold text-gray-300 mb-6">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Sahifa topilmadi
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Siz izlayotgan sahifa mavjud emas yoki tayyorlanish bosqichida.
      </p>
      <Button
        onClick={() => router.push("/")}
        className="bg-primary text-white hover:bg-primary/90"
      >
        Bosh sahifaga qaytish
      </Button>
    </div>
  );
};

export default NotFoundPage;
