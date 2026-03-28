import { Header } from "@/components/home/Header"
import { Hero } from "@/components/home/Hero"
import { WhyChooseUs } from "@/components/home/WhyChooseUs"
// import { Stats } from "@/components/home/Stats"
import { Services } from "@/components/home/Services"
import { CallToAction } from "@/components/home/CallToAction"
import { Footer } from "@/components/home/Footer"
import { generatePageMetadata } from "@/lib/metadata"
import type { Metadata } from "next"
import { ElevenLabsWidget } from "@/components/ElevenLabsWidget"

export const dynamic = 'force-static'

export const metadata: Metadata = generatePageMetadata({
  title: "Home",
  description: "Professional car wash and detailing services in Karachi. Premium car care with mobile service available.",
  image: "/premium-car-detailing-polishing-and-protection.jpg",
})

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WhyChooseUs />
      {/* <Stats /> */}
      <Services />
      <CallToAction />
      <Footer />
      <ElevenLabsWidget agentId="agent_0401km3y12mjf95a5h3yspgy3njr" />
    </main>
  )
}
