"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { usePathname } from "next/navigation";

export function Header() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLang = language === "en" ? "vi" : "en";
    setLanguage(newLang);
    window.location.reload();
  };

  // Simplified header for landing page
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return (
      <header className="fixed top-0 left-0 w-full h-16 border-b bg-background/80 backdrop-blur-sm z-10 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 font-semibold">
          <span>AI Marketing</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={language === "en" ? "default" : "outline"}
            size="sm"
            className="rounded-2xl flex items-center gap-2"
            onClick={toggleLanguage}
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-medium">
              {language === "en" ? "EN" : "VI"}
            </span>
          </Button>
          <Button
            size="sm"
            className="rounded-2xl"
            onClick={() => router.push("/dashboard")}
          >
            {language === "vi" ? "Bảng điều khiển" : "Dashboard"}
          </Button>
        </div>
      </header>
    );
  }

  // Original header for other pages
  return (
    <header className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 border-b bg-background z-10 flex items-center justify-between px-6">
      <div className="relative w-96">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-2xl bg-accent/50 border-none px-4 py-2 pl-10 text-sm"
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant={language === "en" ? "default" : "outline"}
          size="sm"
          className="rounded-2xl flex items-center gap-2"
          onClick={toggleLanguage}
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">
            {language === "en" ? "EN" : "VI"}
          </span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-2xl">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-2xl hover:bg-accent transition-colors cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            J
          </div>
          <span>John Doe</span>
        </div>
      </div>
    </header>
  );
}

// Import needed components
import { Search, Bell } from "lucide-react";
