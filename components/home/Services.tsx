"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Sparkles, Shield, Wand2, Gem, Sun } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import Link from "next/link"

const imgDivBoxBg = "/media/501-homepage-007.webp";
const imgDivBoxBg1 = "/media/501-homepage-008.webp";
const imgDivBoxBg2 = "/media/501-homepage-009.webp";
const imgDivBoxBg3 = "/media/501-homepage-010.webp";
const imgDivBoxBg4 = "/media/501-homepage-011.webp";

export function Services() {
  const services = [
    {
      title: "Premium Interior & Exterior Detailing",
      icon: Sparkles,
      bg: imgDivBoxBg
    },
    {
      title: "Paint Protection Film (PPF)",
      icon: Shield,
      bg: imgDivBoxBg1
    },
    {
      title: "Paint Correction & Polishing",
      icon: Wand2,
      bg: imgDivBoxBg2
    },
    {
      title: "Ceramic Coating",
      icon: Gem,
      bg: imgDivBoxBg3
    },
    {
      title: "Window Tinting",
      icon: Sun,
      bg: imgDivBoxBg4
    }
  ];

  const { ref: sectionRef, inView } = useInView({ threshold: 0.1 });

  return (
    <section ref={sectionRef} className="pt-8 pb-24 bg-background">
      <div className="container mx-auto px-4 mb-16">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <h2 className={`text-[40px] font-heading font-medium text-foreground ${inView ? 'animate-hero-fade-up' : 'opacity-0'}`}>Our Services</h2>
          <div className={`hidden md:block w-px h-10 bg-foreground/20 ${inView ? 'animate-hero-fade-up delay-100' : 'opacity-0'}`}></div>
          <div className={`flex flex-wrap justify-center gap-1.5 text-[16px] font-body text-foreground/80 text-center ${inView ? 'animate-hero-fade-up delay-200' : 'opacity-0'}`}>
            <span>Based in Karachi</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className={`group relative h-[450px] overflow-hidden cursor-pointer ${i === 3 ? 'lg:col-span-2' : ''} ${inView ? `animate-slight-twist delay-${300 + i * 100}` : 'opacity-0'}`}
              style={{ animationDelay: `${300 + i * 100}ms` }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={service.bg} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt="" 
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-90" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">
                <div className="w-10 h-10 mb-6 relative">
                  <service.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-[30px] font-heading font-normal text-white leading-tight">
                  {service.title}
                </h3>

                {/* Borders for corner effect */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full border border-white/10 group-hover:border-white/30 transition-colors"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Link href="/calendar">
            <Button className={`bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-7.5 py-3.75 h-auto text-xs tracking-[1.3px] font-sans font-normal uppercase flex items-center gap-3 transition-colors ${inView ? 'animate-hero-fade-up delay-900' : 'opacity-0'}`}>
              <span>Book Appointment</span>
              <Calendar className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
