const path = require("path");

/** @type {import("next").NextConfig} */
module.exports = {
  poweredByHeader: false,
  experimental: {
    cpus: 1,
  },
  serverExternalPackages: ["@prisma/adapter-pg", "pg", "bcrypt"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@prisma/client": path.join(
        __dirname,
        "app/generated/prisma/client",
      ),
    };
    return config;
  },
};

