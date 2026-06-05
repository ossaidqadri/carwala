"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ContactForm } from "@/components/contact/ContactForm"
import { cn } from "@/lib/utils"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Prevent scrolling when menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border transition-colors duration-200">
        {/* Main Navigation Bar */}
        <div className="h-[60px] md:h-[60px] flex items-center justify-between px-[20px] md:px-[30px] relative z-50 bg-white">
          {/* Desktop Navigation - Left */}
          <nav className="hidden md:flex items-center gap-[25px]">
            <Link href="/services" className="text-foreground text-[15px] font-accent font-medium tracking-wide uppercase hover:text-primary transition-colors">
              SERVICES
            </Link>
            <Link href="/gallery" className="text-foreground text-[15px] font-accent font-medium tracking-wide uppercase hover:text-primary transition-colors">
              GALLERY
            </Link>
          </nav>

          {/* Mobile Menu Button - Left */}
          <div className="flex md:hidden items-center justify-start flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground text-[12px] font-accent font-normal tracking-[1.4px] uppercase hover:opacity-60 transition-opacity w-[60px] text-left"
            >
              {isMobileMenuOpen ? "CLOSE" : "MENU"}
            </button>
          </div>

          {/* Logo - Center (Absolute) */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2" onClick={() => setIsMobileMenuOpen(false)}>
            <h1 className="text-[20px] md:text-[36px] font-pixel font-bold text-foreground tracking-wider whitespace-nowrap">
              CAR WALA
            </h1>
          </Link>

          {/* Mobile Book Now - Right */}
          <div className="flex md:hidden items-center justify-end flex-1">
            <Link 
              href="/calendar"
              className="text-foreground text-[12px] font-accent font-normal tracking-[1.4px] uppercase hover:opacity-60 transition-opacity text-right flex items-center justify-end gap-2"
            >
              <span>BOOK NOW</span>
              <div className="relative w-[12px] h-[12px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute top-1/2 left-1/2 flex h-[1.5px] w-full -translate-x-1/2 -translate-y-1/2 gap-[30%]">
                    <div className="flex-1 bg-current"></div>
                    <div className="flex-1 bg-current"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 flex h-full w-[1.5px] -translate-x-1/2 -translate-y-1/2 flex-col gap-[30%] transition-transform duration-200 ease-in-out">
                    <div className="flex-1 bg-current"></div>
                    <div className="flex-1 bg-current"></div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Actions - Right */}
          <div className="hidden md:flex items-center gap-[25px]">
            <Link 
              href="/calendar"
              className="text-foreground text-[15px] font-accent font-medium tracking-[1.4px] uppercase hover:text-primary transition-colors flex items-center gap-2"
            >
              <span>BOOK NOW</span>
              <div className="relative w-[12px] h-[12px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute top-1/2 left-1/2 flex h-[1.5px] w-full -translate-x-1/2 -translate-y-1/2 gap-[30%]">
                    <div className="flex-1 bg-current"></div>
                    <div className="flex-1 bg-current"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 flex h-full w-[1.5px] -translate-x-1/2 -translate-y-1/2 flex-col gap-[30%] transition-transform duration-200 ease-in-out">
                    <div className="flex-1 bg-current"></div>
                    <div className="flex-1 bg-current"></div>
                  </div>
                </div>
              </div>
            </Link>

            <Dialog>
              <DialogTrigger asChild>
                <button className="text-foreground text-[15px] font-accent font-medium tracking-[1.4px] uppercase hover:text-primary transition-colors">
                  LET'S TALK
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="sr-only">Contact Form</DialogTitle>
                  <DialogDescription className="sr-only">
                    Have questions? Get in touch with us and we'll respond shortly.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <ContactForm />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Below Header */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 top-[60px] z-30 bg-black/20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div 
            className="fixed top-[60px] left-0 right-0 z-40 bg-background border-b border-border shadow-lg md:hidden flex flex-col max-h-[calc(100vh-60px)] overflow-y-auto animate-in slide-in-from-top-2 duration-200"
          >
            <nav className="flex flex-col">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-[56px] items-center px-[20px] text-foreground text-[28px] font-heading font-normal hover:text-primary transition-colors border-b border-foreground/20"
              >
                Home
              </Link>
              <Link 
                href="/services" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-[56px] items-center px-[20px] text-foreground text-[28px] font-heading font-normal hover:text-primary transition-colors border-b border-foreground/20"
              >
                Services
              </Link>
              <Link 
                href="/gallery" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-[56px] items-center px-[20px] text-foreground text-[28px] font-heading font-normal hover:text-primary transition-colors border-b border-foreground/20"
              >
                Gallery
              </Link>
              
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex h-[56px] items-center justify-between px-[20px] text-foreground text-left text-[28px] font-heading font-normal hover:text-primary transition-colors w-full border-b border-foreground/20">
                    <span>Contact</span>
                    <div className="relative w-[16px] h-[16px]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute top-1/2 left-1/2 flex h-[1.5px] w-full -translate-x-1/2 -translate-y-1/2 gap-[30%]">
                          <div className="flex-1 bg-current"></div>
                          <div className="flex-1 bg-current"></div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 flex h-full w-[1.5px] -translate-x-1/2 -translate-y-1/2 flex-col gap-[30%] transition-transform duration-200 ease-in-out [*[aria-expanded='true']_&]:rotate-90">
                          <div className="flex-1 bg-current"></div>
                          <div className="flex-1 bg-current"></div>
                        </div>
                      </div>
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="sr-only">Contact Form</DialogTitle>
                    <DialogDescription className="sr-only">
                      Have questions? Get in touch with us and we'll respond shortly.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <ContactForm />
                  </div>
                </DialogContent>
              </Dialog>
            </nav>
          </div>
        </>
      )}
    </>
  )
}
