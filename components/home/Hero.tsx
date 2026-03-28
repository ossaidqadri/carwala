import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

const imgDivRowBg = "https://www.figma.com/api/mcp/asset/4c72266c-c3c5-4d50-ac94-c7eb03383897";
const img501Homepage020Mp4 = "/media/501-homepage-020.mp4";

export function Hero() {
  return (
    <div className="relative w-full h-screen min-h-[800px] flex items-end pb-25 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={img501Homepage020Mp4} type="video/mp4" />
        </video>
        {/* Fallback image for reduced-motion users */}
        <div className="hidden motion-reduce:block absolute inset-0 z-0 bg-gradient-to-br from-gray-900 to-gray-700">
          <div className="absolute inset-0 opacity-20 bg-[url('/media/501-homepage-020.mp4')] bg-cover bg-center" />
        </div>
      </div>

      <div className="container relative z-20 max-w-[1365px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-0 items-end">
        {/* Left Column */}
        <div className="flex flex-col gap-2.5 text-white">
          <div className="flex flex-wrap gap-1 text-base font-body font-normal leading-[1.2] animate-hero-fade-up">
            <span>We</span>
            <span>don't</span>
            <span>sell</span>
            <span>product,</span>
            <span>we</span>
            <span>sell</span>
            <span>results.</span>
          </div>
          <h1 className="text-5xl md:text-[65px] font-heading font-medium leading-[1.1] md:leading-[1.2] tracking-tight animate-hero-fade-up [animation-delay:100ms]">
            Premium Car<br />Detailing in Karachi
          </h1>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-7.5 text-white md:pl-20">
          <p className="text-base font-body leading-[1.2] animate-hero-fade-up [animation-delay:200ms]">
            Welcome to Car Wala, where we don't just clean, we transform.
            Whether it's a luxury sedan, rugged 4x4, or a high-performance beast, your car deserves the best.
            We deliver exceptional detailing, PPF, ceramic coatings, and more, right at our studio or at your doorstep.
          </p>

          <div className="flex flex-wrap gap-8 items-center animate-hero-fade-up [animation-delay:300ms]">
            {/* Service Link/Button */}
            <div className="flex flex-col">
               <Link href="/services">
                 <Button className="bg-white text-black hover:bg-gray-100 rounded-none px-7.5 py-3.75 h-auto text-xs font-sans tracking-[1.3px] font-normal uppercase flex items-center gap-3 transition-colors">
                    <span>View Services</span>
                    <ArrowUpRight className="w-5 h-5" />
                 </Button>
               </Link>
            </div>

            {/* Stats/Social Proof */}
            <div className="flex items-center gap-5">
               <div className="flex -space-x-2">
                  {[
                    "/media/501-homepage-007.webp",
                    "/media/501-homepage-008.webp",
                    "/media/501-homepage-009.webp",
                    "/media/501-homepage-010.webp"
                  ].map((src, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden relative z-0 bg-gray-800">
                      <img src={src} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
               </div>
               <div className="text-[13.6px] leading-none font-body font-normal">
                  <p>500+ vehicles detailed</p>
                  <p>across Karachi</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
