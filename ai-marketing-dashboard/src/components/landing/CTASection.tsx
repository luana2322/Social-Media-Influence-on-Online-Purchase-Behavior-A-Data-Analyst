"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { ArrowDown, Upload } from "lucide-react";

export default function CTASection() {
  const router = useRouter();
  const { t } = useLanguage();

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
          {t("landing.cta.headline")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {t("landing.cta.subheadline")}
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={handleTryDemo}
            className="rounded-full px-8 py-6 text-lg"
          >
            {t("landing.cta.tryDemo")}
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleGetStarted}
            className="rounded-full px-8 py-6 text-lg"
          >
            <Upload className="mr-2 h-5 w-5" />
            {t("landing.cta.getStarted")}
          </Button>
        </div>
      </div>
    </section>
  );
}
