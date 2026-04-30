"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Brain, MessageSquare } from "lucide-react";

export default function HowItWorks() {
  const { t, language } = useLanguage();

  const steps = [
    {
      icon: Upload,
      titleKey: "landing.howItWorks.step1.title",
      descKey: "landing.howItWorks.step1.desc",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Brain,
      titleKey: "landing.howItWorks.step2.title",
      descKey: "landing.howItWorks.step2.desc",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: MessageSquare,
      titleKey: "landing.howItWorks.step3.title",
      descKey: "landing.howItWorks.step3.desc",
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          {t("landing.howItWorks.title")}
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full rounded-2xl border-0 shadow-lg transition-shadow hover:shadow-xl">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  {/* Numbered badge */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white font-bold">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`mb-4 rounded-full p-4 ${step.color}`}>
                    <step.icon className="h-8 w-8" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {t(step.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground">
                    {t(step.descKey)}
                  </p>
                </CardContent>
              </Card>

              {/* Arrow between steps (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 z-10 -translate-y-1/2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-gray-300"
                  >
                    <path
                      d="M5 12h14m-4 -4l4 4l-4 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
