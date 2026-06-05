import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { Pricing } from "@/components/Pricing"
import { ElevenLabsWidget } from "@/components/ElevenLabsWidget"
import { generatePageMetadata } from "@/lib/metadata"
import type { Metadata } from "next"

export const revalidate = 3600 // Revalidate services/pricing every hour

export const metadata: Metadata = generatePageMetadata({
  title: "Services & Pricing",
  description: "Professional car wash and detailing packages in Karachi. Choose from Silver, Gold, Platinum, Detailed and Diamond packages.",
  image: "/premium-car-detailing-polishing-and-protection.jpg",
  url: "/services",
})

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[80px]">
        <Pricing />
      </main>
      <Footer />
      <ElevenLabsWidget agentId="agent_0401km3y12mjf95a5h3yspgy3njr" />
    </>
  )
}
