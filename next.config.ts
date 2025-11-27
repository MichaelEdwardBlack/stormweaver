import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/characters/:id/edit",
        destination: "/characters/:id/edit/origin",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
