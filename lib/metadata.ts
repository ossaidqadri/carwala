import type { Metadata } from "next"

interface PageMeta {
  title: string
  description: string
  image?: string
  url?: string
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://carwala.com"

export const defaultMetadata: Metadata = {
  title: {
    template: "%s | Carwala - Premium Car Wash & Detailing",
    default: "Carwala - Premium Car Wash & Detailing",
  },
  description:
    "Professional car wash and detailing services in Karachi. Keep your vehicle spotless with Carwala premium car care.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/Website Favicon.png",
    apple: "/apple-icon.png",
    shortcut: "/Website Favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Carwala - Premium Car Wash & Detailing",
    description:
      "Professional car wash and detailing services in Karachi. Keep your vehicle spotless with Carwala premium car care.",
    siteName: "Carwala",
    images: [
      {
        url: "/premium-car-detailing-polishing-and-protection.jpg",
        width: 1200,
        height: 630,
        alt: "Carwala - Premium Car Wash & Detailing",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carwala - Premium Car Wash & Detailing",
    description:
      "Professional car wash and detailing services in Karachi. Keep your vehicle spotless with Carwala premium car care.",
    images: ["/premium-car-detailing-polishing-and-protection.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "facebook-domain-verification": "mjjdu5mt0rst8aqrrypyvo5e0nn6nc",
  },
}

export function generatePageMetadata({
  title,
  description,
  image,
  url,
}: PageMeta): Metadata {
  const imageUrl = image || "/premium-car-detailing-polishing-and-protection.jpg"
  const pageUrl = url || siteUrl

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }
}
