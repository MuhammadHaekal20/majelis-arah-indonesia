import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";
import { publicAppUrl, sanitizeRuntimeEnv } from "@/lib/env";

sanitizeRuntimeEnv();

function canonicalHostRedirect(req: NextRequest): NextResponse | null {
  let canonical: URL;
  try {
    canonical = new URL(publicAppUrl());
  } catch {
    return null;
  }

  if (
    canonical.hostname === "localhost" ||
    canonical.hostname === "127.0.0.1"
  ) {
    return null;
  }

  if (req.nextUrl.hostname === canonical.hostname) {
    return null;
  }

  const url = req.nextUrl.clone();
  url.protocol = canonical.protocol;
  url.host = canonical.host;
  return NextResponse.redirect(url, 308);
}

export async function middleware(req: NextRequest) {
  const canonical = canonicalHostRedirect(req);
  if (canonical) {
    return canonical;
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp|gif)$).*)",
  ],
};
