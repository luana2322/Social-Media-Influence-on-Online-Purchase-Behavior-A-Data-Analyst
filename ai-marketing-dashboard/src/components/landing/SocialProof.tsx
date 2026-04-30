"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { Badge } from "@/components/ui/badge";

export default function SocialProof() {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tech Stack */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {language === "vi" ? "Công nghệ xây dựng" : "Built With"}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm">
              XGBoost
            </Badge>
            <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm">
              FastAPI
            </Badge>
            <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm">
              Spring Boot
            </Badge>
            <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm">
              Next.js
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">1M+</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {language === "vi" ? "Dòng dữ liệu xử lý" : "Rows processed"}
            </p>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-purple-600">95.4%</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {language === "vi" ? "Độ chính xác dự đoán" : "Prediction accuracy"}
            </p>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">500+</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {language === "vi" ? "Nhà tiếp thị tin dùng" : "Marketers trust us"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
