const RUNTIME_KEYS = [
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "ADMIN_EMAIL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
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
  const url = unwrapQuoted(raw);
  const scheme = url.split(":")[0]?.toLowerCase() ?? "";
  if (scheme === "postgres" || scheme === "postgresql") {
    throw new Error(
      "DATABASE_URL masih PostgreSQL. Ganti ke mysql://USER:PASSWORD@HOST:3306/DB",
    );
  }
  return url;
}

export function databaseUrlOrDummy(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw?.trim()) {
    return "mysql://root:root@127.0.0.1:3306/arah_indonesia";
  }
  return unwrapQuoted(raw);
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() &&
      process.env.GOOGLE_CLIENT_SECRET?.trim(),
  );
}

/** Hostinger injects KEY='value' literally; strip wrapping quotes. */
export function sanitizeRuntimeEnv(): void {
  for (const key of RUNTIME_KEYS) {
    const current = process.env[key];
    if (typeof current === "string" && current.length > 0) {
      process.env[key] = unwrapQuoted(current);
    }
  }
}
