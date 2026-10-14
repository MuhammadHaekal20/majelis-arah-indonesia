/**
 * Sync schema saat app start (bukan saat build).
 * Hostinger build sandbox sering tidak bisa reach MySQL → db push di build selalu gagal.
 */
import { spawnSync } from "node:child_process";

const result = spawnSync(
  "npx",
  ["prisma", "db", "push", "--skip-generate"],
  { stdio: "inherit", shell: true, env: process.env },
);

if (result.status !== 0) {
  console.warn(
    "[sync-db] prisma db push gagal — app tetap start. Cek DATABASE_URL / akses DB.",
  );
}
