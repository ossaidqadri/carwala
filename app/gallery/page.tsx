import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { generatePageMetadata } from "@/lib/metadata"
import { Compare } from "@/components/ui/compare"
import type { Metadata } from "next"

export const metadata: Metadata = generatePageMetadata({
  title: "Car Detailing Gallery",
  description: "View our expert car detailing transformations in Karachi - paint correction, ceramic coating, PPF & more.",
  image: "/premium-car-detailing-polishing-and-protection.jpg",
  url: "/gallery",
})

const galleryImages = [
  // Before images
  { src: "/media/Before/dirty-rear-floor.webp", alt: "Before - Dirty rear floor with debris and stains" },
  { src: "/media/Before/scratched-roof-paint.webp", alt: "Before - Scratched and swirled roof paint" },
  { src: "/media/Before/muddy-wheel-arch.webp", alt: "Before - Muddy wheel arch and dusty tire" },
  { src: "/media/Before/dusty-truck-bed.webp", alt: "Before - Dusty truck bed with dirty seats" },
  { src: "/media/Before/dirty-driver-floor-mat.webp", alt: "Before - Dirty driver-side floor mat" },
  // After images
  { src: "/media/After/glossy-side-panel.webp", alt: "After - Glossy black side panel with mirror finish" },
  { src: "/media/After/clean-truck-bed.webp", alt: "After - Clean and polished truck bed" },
  { src: "/media/After/shiny-front-grille.webp", alt: "After - Shiny front grille and hood" },
  { src: "/media/After/polished-hood-reflection.webp", alt: "After - Perfect hood reflections after polishing" },
  { src: "/media/After/clean-truck-seats.webp", alt: "After - Clean truck bed seats" },
]

// Before/After comparison images
const comparisonImages = [
  {
    before: "/media/Before/scratched-roof-paint.webp",
    after: "/media/After/polished-hood-reflection.webp",
    title: "Paint Correction & Polish",
  },
  {
    before: "/media/Before/muddy-wheel-arch.webp",
    after: "/media/After/glossy-side-panel.webp",
    title: "Exterior Detail & Wheel Clean",
  },
  {
    before: "/media/Before/dusty-truck-bed.webp",
    after: "/media/After/clean-truck-bed.webp",
    title: "Truck Bed Deep Clean",
  },
  {
    before: "/media/Before/dirty-rear-floor.webp",
    after: "/media/After/shiny-front-grille.webp",
    title: "Interior Vacuum & Detail",
  },
  {
    before: "/media/Before/dirty-driver-floor-mat.webp",
    after: "/media/After/clean-truck-seats.webp",
    title: "Floor Mat Restoration",
  },
]

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[80px]">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-2xl font-bold sm:text-3xl font-heading mb-4">
              Car Detailing Gallery
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base font-body">
              Browse our portfolio of premium car care transformations
            </p>
          </div>

          {/* Before/After Comparisons Section */}
          <section className="mb-16">
            <h2 className="text-xl font-bold font-heading mb-6 text-center">
              Real Transformations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {comparisonImages.map((comparison, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Compare
                    firstImage={comparison.after}
                    secondImage={comparison.before}
                    firstImageClassName="object-cover w-full h-full"
                    secondImageClassName="object-cover w-full h-full"
                    className="w-full aspect-square rounded-lg border border-border"
                    slideMode="drag"
                    autoplay={true}
                    autoplayDuration={4000}
                  />
                  <p className="mt-3 text-sm text-muted-foreground font-body">
                    {comparison.title}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery Grid Section */}
          <section>
            <h2 className="text-xl font-bold font-heading mb-6 text-center">
              Detailing Portfolio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((item, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
                >
                  {item.isVideo ? (
                    <video
                      src={item.src}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
