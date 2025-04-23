import { ROUTE_PATH } from '@/constant/Routes';
import type { NextConfig } from 'next';
import { Life_Savers } from 'next/font/google';

const nextConfig: NextConfig = {
  /* Other config options */
  devIndicators: false,
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: true
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: ROUTE_PATH.AUTH.LOGIN,
        permanent: false
      }
    ];
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_S3_HOSTNAME ?? '']
  }
};

export default nextConfig;
