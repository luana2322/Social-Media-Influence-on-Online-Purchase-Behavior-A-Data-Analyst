"use client";

import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import DemoSection from "@/components/landing/DemoSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ChatbotSection from "@/components/landing/ChatbotSection";
import SocialProof from "@/components/landing/SocialProof";
import CTASection from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <DemoSection />
      <FeaturesSection />
      <ChatbotSection />
      <SocialProof />
      <CTASection />
    </div>
  );
}
