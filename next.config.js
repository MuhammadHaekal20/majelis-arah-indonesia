/** @type {import("next").NextConfig} */
module.exports = {
  poweredByHeader: false,
  experimental: {
    cpus: 1,
  },
  serverExternalPackages: ["pg", "bcrypt"],
  async rewrites() {
    return {
      // Lewati static public/uploads (404 setelah redeploy) → API baca DB.
      beforeFiles: [
        {
          source: "/uploads/:filename",
          destination: "/api/media/:filename",
        },
      ],
    };
  },
};
