import { NextResponse, type NextRequest } from "next/server"
import { get } from "@vercel/edge-config"

const EXCLUDED_PATHS = [
  "/api",
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/maintenance",
]

function isExcludedPath(pathname: string): boolean {
  return EXCLUDED_PATHS.some((excluded) => pathname.startsWith(excluded))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isExcludedPath(pathname)) {
    return NextResponse.next()
  }

  try {
    const isInMaintenanceMode = await get<boolean>("isInMaintenanceMode")

    if (isInMaintenanceMode === true) {
      const maintenanceUrl = new URL("/maintenance", request.url)
      return NextResponse.rewrite(maintenanceUrl)
    }
  } catch (error) {
    console.error("Edge Config error:", error instanceof Error ? error.message : "Unknown error")
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
