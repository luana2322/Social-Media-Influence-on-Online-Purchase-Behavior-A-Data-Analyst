import HeroSection from "@/components/landing/HeroSection"
import DemoPreview from "@/components/landing/DemoPreview"
import FeaturesSection from "@/components/landing/FeaturesSection"
import DirectAnalyzeCTA from "@/components/landing/DirectAnalyzeCTA"
import CTASection from "@/components/landing/CTASection"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <DemoPreview />
      <FeaturesSection />
      <DirectAnalyzeCTA />
      <CTASection />
    </div>
  )
}
