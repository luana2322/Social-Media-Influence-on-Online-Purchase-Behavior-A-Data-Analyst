"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { ArrowDown, Upload } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleTryDemo = () => {
    document
      .getElementById("demo-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpload = () => {
    router.push("/upload");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Pain + Solution Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">
              {t("landing.hero.headline")}
            </span>
          </h1>

          {/* Outcome Subheadline */}
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl sm:leading-9 md:text-2xl">
            {t("landing.hero.subheadline")}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleTryDemo}
              className="rounded-full px-8 py-6 text-lg"
            >
              {t("landing.hero.tryDemo")}
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleUpload}
              className="rounded-full px-8 py-6 text-lg"
            >
              <Upload className="mr-2 h-5 w-5" />
              {t("landing.hero.uploadData")}
            </Button>
          </div>

          {/* Social Proof */}
          <p className="mt-8 text-sm text-muted-foreground">
            {t("landing.hero.socialProof")}
          </p>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-200 opacity-20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-200 opacity-20 blur-3xl" />
    </section>
  );
}
