"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export function WhatsAppWidget() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    const footer = document.querySelector("footer")
    if (footer) {
      observer.observe(footer)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <Link
      href="https://wa.me/923310444333"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-label="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 464 488"
        className="w-8 h-8 md:w-10 md:h-10 fill-white"
      >
        <path d="M462 228q0 93-66 159t-160 66q-56 0-109-28L2 464l40-120q-32-54-32-116q0-93 66-158.5T236 4t160 65.5T462 228zM236 39q-79 0-134.5 55.5T46 228q0 62 36 111l-24 70l74-23q49 31 104 31q79 0 134.5-55.5T426 228T370.5 94.5T236 39zm114 241q-1-1-10-7q-3-1-19-8.5t-19-8.5q-9-3-13 2q-1 3-4.5 7.5t-7.5 9t-5 5.5q-4 6-12 1q-34-17-45-27q-7-7-13.5-15t-12-15t-5.5-8q-3-7 3-11q4-6 8-10l6-9q2-5-1-10q-4-13-17-41q-3-9-12-9h-11q-9 0-15 7q-19 19-19 45q0 24 22 57l2 3q2 3 4.5 6.5t7 9t9 10.5t10.5 11.5t13 12.5t14.5 11.5t16.5 10t18 8.5q16 6 27.5 10t18 5t9.5 1t7-1t5-1q9-1 21.5-9t15.5-17q8-21 3-26z"/>
      </svg>
      <span className="absolute -top-10 right-0 bg-white text-foreground text-xs px-3 py-1.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium">
        Chat with us
      </span>
    </Link>
  )
}
