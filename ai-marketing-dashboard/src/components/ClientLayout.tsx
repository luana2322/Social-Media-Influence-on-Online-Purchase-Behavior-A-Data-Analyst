"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <div className="flex min-h-screen">
      {!isLandingPage && <Sidebar />}
      <div className={isLandingPage ? "flex-1" : "flex-1 ml-64"}>
        <Header />
        <main className={isLandingPage ? "" : "p-6"}>{children}</main>
      </div>
    </div>
  );
}
