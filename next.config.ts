import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  experimental: {
    turbo: {
      root: path.resolve(__dirname),
    },
  } as any,
};

export default nextConfig;
