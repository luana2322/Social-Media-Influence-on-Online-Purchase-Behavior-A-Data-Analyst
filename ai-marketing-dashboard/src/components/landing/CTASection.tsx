"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { ArrowDown, Upload } from "lucide-react";

export default function CTASection() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const handleTryDemo = () => {
    document
      .getElementById("demo-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetStarted = () => {
    router.push("/upload");
  };

  return (
    <section className="bg-muted/50 py-20">
      <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          {language === "vi" ? "Bắt đầu dự đoán ngay hôm nay" : "Start predicting your customers today"}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {language === "vi"
            ? "Tham gia 500+ nhà tiếp thị đang sử dụng AI để tăng 27% chuyển đổi"
            : "Join 500+ marketers using AI to boost conversions by 27%"}
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={handleTryDemo}
            className="rounded-full px-8 py-6 text-lg"
          >
            {language === "vi" ? "Thử Demo" : "Try Demo"}
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleGetStarted}
            className="rounded-full px-8 py-6 text-lg"
          >
            <Upload className="mr-2 h-5 w-5" />
            {language === "vi" ? "Bắt đầu ngay" : "Get Started"}
          </Button>
        </div>
      </div>
    </section>
  );
}
