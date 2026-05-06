"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, MessageSquare, BarChart3 } from "lucide-react";

export default function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          {t("landing.features.title")}
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12">
          {/* Feature 1 */}
          <div className="rounded-2xl border-0 shadow-lg transition-all hover:shadow-xl p-8 text-center">
            <div className="mb-4 rounded-full p-4 bg-blue-100 text-blue-600 inline-block">
              <Brain className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {t("landing.features.prediction.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("landing.features.prediction.desc")}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border-0 shadow-lg transition-all hover:shadow-xl p-8 text-center">
            <div className="mb-4 rounded-full p-4 bg-purple-100 text-purple-600 inline-block">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {t("landing.features.segmentation.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("landing.features.segmentation.desc")}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border-0 shadow-lg transition-all hover:shadow-xl p-8 text-center">
            <div className="mb-4 rounded-full p-4 bg-green-100 text-green-600 inline-block">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {t("landing.features.chatbot.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("landing.features.chatbot.desc")}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-2xl border-0 shadow-lg transition-all hover:shadow-xl p-8 text-center">
            <div className="mb-4 rounded-full p-4 bg-orange-100 text-orange-600 inline-block">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {t("landing.features.analytics.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("landing.features.analytics.desc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
