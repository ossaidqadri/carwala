"use client"

import { Wrench, Truck, UserCheck, Award } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

const img501Homepage003Mp4 = "/media/501-homepage-003.mp4";

const features = [
  {
    icon: Wrench,
    title: "Professional-grade products & tools"
  },
  {
    icon: Truck,
    title: "Mobile & in-shop service options"
  },
  {
    icon: UserCheck,
    title: "Paint-safe techniques by trained experts"
  },
  {
    icon: Award,
    title: "Guaranteed results, not just promises"
  }
];

export function WhyChooseUs() {
  const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.1 });
  const { ref: cardsRef, inView: cardsInView } = useInView({ threshold: 0.2 });

  return (
    <section className="pt-24 pb-0 bg-background">
      <div ref={headingRef} className="container mx-auto px-4 mb-16">
        <div className="flex items-center justify-center gap-[var(--gap-section-header)]">
          <h2 className={`section-heading text-foreground font-heading ${headingInView ? 'animate-hero-fade-up' : 'opacity-0'}`}>Why Choose Us?</h2>
          <div className={`h-[var(--divider-height)] w-px bg-foreground opacity-50 ${headingInView ? 'animate-hero-fade-up delay-100' : 'opacity-0'}`}></div>
          <div className={`flex gap-[5px] section-subheading text-foreground font-body ${headingInView ? 'animate-hero-fade-up delay-200' : 'opacity-0'}`}>
            <span>More</span>
            <span>Than</span>
            <span>Clean</span>
          </div>
        </div>
      </div>

      <div ref={cardsRef} className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Video Section */}
          <div className="lg:col-span-4 relative min-h-[400px] bg-black overflow-hidden group">
            <video
              className={`absolute inset-0 w-full h-full object-cover motion-reduce:hidden ${cardsInView ? 'animate-why-choose-video' : ''}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={img501Homepage003Mp4} type="video/mp4" />
            </video>
            {/* Fallback static background for reduced-motion users */}
            <div className="hidden motion-reduce:block absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />
          </div>

          {/* Features Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`group p-10 border border-border hover:bg-muted/30 transition-all duration-300 flex flex-col gap-6 h-full justify-center relative overflow-hidden ${cardsInView ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Border animation lines */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-destructive/30 origin-left" style={{ transformOrigin: 'left' }}></div>
                <div className="absolute bottom-0 right-0 w-full h-[1px] bg-destructive/30 origin-right" style={{ transformOrigin: 'right' }}></div>
                
                {/* Icon with drop animation */}
                <div className={`w-16 h-16 ${cardsInView ? 'animate-why-choose-icon' : 'opacity-0'}`} style={{ animationDelay: `${i * 150}ms` }}>
                  <feature.icon className="w-full h-full text-destructive group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                {/* Title with slide animation */}
                <h3 className={`text-[28px] font-heading leading-tight font-normal max-w-[280px] ${cardsInView ? 'animate-why-choose-title' : 'opacity-0'}`} style={{ animationDelay: `${i * 150 + 100}ms` }}>
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
