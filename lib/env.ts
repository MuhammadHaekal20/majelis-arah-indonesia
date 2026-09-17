const RUNTIME_KEYS = [
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "ADMIN_EMAIL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
] as const;

function unwrapQuoted(value: string): string {
  const trimmed = value.trim();
  const quote = trimmed[0];
  if (
    trimmed.length >= 2 &&
    (quote === "'" || quote === '"') &&
    trimmed.endsWith(quote)
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function databaseUrl(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw?.trim()) {
    throw new Error("DATABASE_URL is not set");
  }
  return unwrapQuoted(raw);
}

export function databaseUrlOrDummy(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw?.trim()) {
    return "postgresql://postgres:postgres@127.0.0.1:5432/arah_indonesia?schema=public";
  }
  return unwrapQuoted(raw);
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() &&
      process.env.GOOGLE_CLIENT_SECRET?.trim(),
  );
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  );
}

export function publicAppUrl(): string {
  const raw = process.env.NEXTAUTH_URL?.trim();
  const fallback = "http://localhost:3000";
  const url = unwrapQuoted(raw && raw.length > 0 ? raw : fallback);
  return url.replace(/\/+$/, "");
}

export function googleCallbackUrl(): string {
  return `${publicAppUrl()}/api/auth/callback/google`;
}

/** Hostinger injects KEY='value' literally; pg then resolves host to "base". */
export function sanitizeRuntimeEnv(): void {
  for (const key of RUNTIME_KEYS) {
    const current = process.env[key];
    if (typeof current === "string" && current.length > 0) {
      let value = unwrapQuoted(current);
      if (key === "NEXTAUTH_URL") {
        value = value.replace(/\/+$/, "");
      }
      process.env[key] = value;
    }
  }
}
