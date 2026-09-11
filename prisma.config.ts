// Prisma ORM 7 — URL datasource ada di sini, bukan di schema.prisma
import "dotenv/config";
import { defineConfig } from "prisma/config";
import { databaseUrlOrDummy } from "./lib/env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  datasource: {
    // Hostinger/CI: generate tidak boleh gagal hanya karena env belum ter-inject.
    url: databaseUrlOrDummy(),
  },
});
