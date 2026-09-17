/** @type {import("next").NextConfig} */
module.exports = {
  poweredByHeader: false,
  experimental: {
    cpus: 1,
  },
  serverExternalPackages: ["pg", "bcrypt"],
};

