"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/shared/navbar";
// import BottomBar from "@/components/bottomBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/workspace") ||
    pathname.includes("/create");

  //   const isEditorPage =
  //     /^\/workspace\/[a-f0-9]{24}$/.test(pathname) ||
  //     pathname === "/login" ||
  //     pathname === "/register" ||
  //     pathname === "/";

  return (
    <div>
      {!hideNavbar && <Navbar />}

      <main>{children}</main>
    </div>
  );
}
