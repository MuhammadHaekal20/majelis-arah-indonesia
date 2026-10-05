import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";
import { publicAppUrl, sanitizeRuntimeEnv } from "@/lib/env";

sanitizeRuntimeEnv();

function incomingHostname(req: NextRequest): string {
  const raw =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  return raw.split(",")[0].trim().split(":")[0].toLowerCase();
}

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

  const incoming = incomingHostname(req);
  if (!incoming || incoming === canonical.hostname) {
    return null;
  }

  if (
    incoming === "0.0.0.0" ||
    incoming === "localhost" ||
    incoming === "127.0.0.1"
  ) {
    return null;
  }

  if (incoming !== `www.${canonical.hostname}`) {
    return null;
  }

  const dest = new URL(
    `${req.nextUrl.pathname}${req.nextUrl.search}`,
    canonical.origin,
  );
  return NextResponse.redirect(dest, 308);
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
