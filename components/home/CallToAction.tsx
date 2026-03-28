import Link from "next/link";
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const imgDivRowBg = "https://www.figma.com/api/mcp/asset/f973817b-372d-4108-bf3a-57c486a00d88";
const img501Homepage021Mp4 = "/media/501-homepage-021.mp4";

export function CallToAction() {
  return (
    <section className="relative py-32 overflow-hidden">
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
          <source src={img501Homepage021Mp4} type="video/mp4" />
        </video>
        {/* Fallback for reduced-motion users */}
        <div className="hidden motion-reduce:block absolute inset-0 z-0 bg-gradient-to-br from-gray-900 to-gray-700" />
      </div>

      <div className="container relative z-20 mx-auto px-4 text-center">
        <h2 className="text-[40px] md:text-[48px] font-heading font-medium text-white mb-8 leading-tight">
          We Don't Just Clean Cars,<br />
          We Transform Them
        </h2>

        <div className="max-w-2xl mx-auto mb-12">
          <p className="text-[16px] font-body text-white/90 leading-relaxed">
            From deep detailing to paint protection, we bring out the best in every ride.
            In Karachi or at your doorstep, we've got your car covered.
          </p>
        </div>

        <div className="flex justify-center">
          <Button asChild className="bg-white text-black hover:bg-gray-100 rounded-none px-7.5 py-3.75 h-auto text-xs tracking-[1.3px] font-normal uppercase flex items-center gap-3 transition-colors">
            <Link href="/calendar">
              <span>Book Appointment</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
