"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Sparkles, Shield, Wand2, Gem, Sun } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import Link from "next/link"

const services = [
  {
    title: "Premium Interior & Exterior Detailing",
    description: "Deep clean, seat shampooing, engine bay wash, and interior sanitization.",
    icon: Sparkles,
  },
  {
    title: "Paint Protection Film (PPF)",
    description: "Invisible armor shields your paint from scratches, stone chips, and UV damage.",
    icon: Shield,
  },
  {
    title: "Paint Correction & Polishing",
    description: "Multi-stage compounding and polishing to restore factory-fresh gloss.",
    icon: Wand2,
  },
  {
    title: "Ceramic Coating",
    description: "Semi-permanent nano-ceramic barrier for long-lasting gloss and hydrophobic protection.",
    icon: Gem,
  },
  {
    title: "Window Tinting",
    description: "Professional-grade tint for heat rejection, UV protection, and privacy.",
    icon: Sun,
  },
]

export function Services() {
  const { ref: sectionRef, inView } = useInView({ threshold: 0.1 })

  return (
    <section ref={sectionRef} className="pt-8 pb-24 bg-background">
      <div className="container mx-auto px-4 mb-16">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <h2 className={`text-[40px] font-heading font-medium text-foreground ${inView ? "animate-hero-fade-up" : "opacity-0"}`}>
            Our Services
          </h2>
          <div className={`hidden md:block w-px h-10 bg-foreground/20 ${inView ? "animate-hero-fade-up delay-100" : "opacity-0"}`} />
          <div className={`flex flex-wrap justify-center gap-1.5 text-[16px] font-body text-foreground/80 text-center ${inView ? "animate-hero-fade-up delay-200" : "opacity-0"}`}>
            <span>Based in Karachi</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className={`group relative flex flex-col gap-4 p-8 bg-muted/30 border border-border rounded-sm overflow-hidden cursor-pointer ${i === 3 ? "lg:col-span-2" : ""} ${inView ? `animate-hero-fade-up delay-${300 + i * 100}` : "opacity-0"}`}
              style={{ animationDelay: `${300 + i * 100}ms` }}
            >
              <div className="w-10 h-10 text-foreground">
                <service.icon className="w-full h-full" />
              </div>
              <div>
                <h3 className="text-[22px] font-heading font-normal text-foreground leading-tight mb-2">
                  {service.title}
                </h3>
                <p className="text-sm font-body text-foreground/70 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Link href="/calendar">
            <Button className={`bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-7.5 py-3.75 h-auto text-xs tracking-[1.3px] font-sans font-normal uppercase flex items-center gap-3 transition-colors ${inView ? "animate-hero-fade-up delay-900" : "opacity-0"}`}>
              <span>Book Appointment</span>
              <Calendar className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
