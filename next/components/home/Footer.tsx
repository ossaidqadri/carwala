"use client"

import Link from "next/link"
import { ArrowUpRight, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ContactForm } from "@/components/contact/ContactForm"
import { Input } from "@/components/ui/input"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-footer-bg text-foreground font-body border-t border-footer-border">
      {/* ─── Top: Full-width brand wordmark ─── */}
      <div className="border-b border-footer-border py-8 md:py-10 overflow-hidden">
        <svg viewBox="0 0 580 80" className="w-full h-auto select-none" aria-label="Carwala" role="img">
          <text
            x="290"
            y="65"
            textAnchor="middle"
            fill="currentColor"
            stroke="var(--footer-bg)"
            strokeWidth="8"
            paintOrder="stroke fill"
            style={{ fontFamily: "'Pixel Operator', monospace", fontWeight: 700, fontSize: "80px", letterSpacing: "0.25em" }}
          >
            CARWALA
          </text>
        </svg>
      </div>

      {/* ─── Middle: Two-column content grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-footer-border">
        {/* Left Column */}
        <div className="px-6 py-10 md:px-12 md:py-14 md:border-r md:border-dotted md:border-footer-border flex flex-col gap-10">
          {/* Navigation */}
          <nav className="flex flex-col gap-3">
            <span className="text-xs font-accent uppercase tracking-widest opacity-60 mb-1">Navigate</span>
            {[
              { name: "Services", href: "/services" },
              { name: "Gallery", href: "/gallery" },
              { name: "Why Us", href: "#why-us" },
              { name: "Book Now", href: "/calendar" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 text-base uppercase tracking-wide hover:opacity-60 transition-opacity group w-fit"
              >
                {link.name}
                <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 text-base uppercase tracking-wide hover:opacity-60 transition-opacity group w-fit text-left">
                  Contact
                  <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="font-heading text-3xl">Send Us an Enquiry</DialogTitle>
                  <DialogDescription>
                    Have questions? Get in touch with us and we&apos;ll respond shortly.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <ContactForm />
                </div>
              </DialogContent>
            </Dialog>
          </nav>

          {/* Location & Hours */}
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="font-accent uppercase tracking-widest text-xs opacity-60">Location</span>
              <span>Karachi, Pakistan</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-accent uppercase tracking-widest text-xs opacity-60">Hours</span>
              <span>Weekdays: 8AM – 7PM</span>
              <span>Weekends: 9AM – 6PM</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="px-6 py-10 md:px-12 md:py-14 flex flex-col gap-10 border-t border-footer-border md:border-t-0">
          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <span className="font-heading font-semibold text-xl md:text-2xl uppercase tracking-wide">
              Join Our Mailing List
            </span>
            <div className="relative max-w-sm">
              <Input
                type="email"
                placeholder="Your Email Address"
                className="h-11 rounded-none border-footer-border bg-white text-foreground placeholder:text-muted-foreground pr-12 uppercase tracking-wide text-sm"
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center border-l border-footer-border hover:opacity-60 transition-opacity"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-accent uppercase tracking-widest opacity-60 mb-1">Follow Us</span>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {[
                { name: "Facebook", href: "https://www.facebook.com/carwala.official" },
                { name: "Instagram", href: "https://www.instagram.com/carwala.official" },
                { name: "TikTok", href: "https://www.tiktok.com/@carswala.official" },
                { name: "LinkedIn", href: "https://www.linkedin.com/company/car-wala" },
                { name: "YouTube", href: "https://www.youtube.com/@carswala.official" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm uppercase tracking-wide hover:opacity-60 transition-opacity group"
                >
                  {link.name}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-accent uppercase tracking-widest opacity-60">General Enquiries</span>
            <Link
              href="https://wa.me/923310444333"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg md:text-xl font-heading hover:opacity-60 transition-opacity w-fit"
            >
              +92 331 0444333
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Bottom: Legal bar ─── */}
      <div className="px-6 py-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-accent uppercase tracking-widest opacity-70">
        <span>© {currentYear} Carwala. All Rights Reserved.</span>
        <span>
          Made with <span className="text-red-500 normal-case">❤</span> by{" "}
          <Link
            href="https://otherdev.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60 transition-opacity border-b border-current"
          >
            Other Dev
          </Link>
        </span>
      </div>
    </footer >
  )
}
