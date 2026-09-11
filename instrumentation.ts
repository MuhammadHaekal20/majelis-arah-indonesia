import { sanitizeRuntimeEnv } from "@/lib/env";

export function register() {
  sanitizeRuntimeEnv();
}
