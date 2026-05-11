import HeroSection from "@/components/landing/HeroSection"
import DemoPreview from "@/components/landing/DemoPreview"
import FeaturesSection from "@/components/landing/FeaturesSection"
import ChatbotPreview from "@/components/landing/ChatbotPreview"
import CTASection from "@/components/landing/CTASection"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <DemoPreview />
      <FeaturesSection />
      <ChatbotPreview />
      <CTASection />
    </div>
  )
}
