import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { Pricing } from "@/components/Pricing"
import { ElevenLabsWidget } from "@/components/ElevenLabsWidget"

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
