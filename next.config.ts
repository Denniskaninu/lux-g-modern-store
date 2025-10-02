import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
<<<<<<< HEAD
        protocol: 'http',
        hostname: 'localhost',
        port: '**',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '6000-firebase-studio-1759296005596.cluster-cbeiita7rbe7iuwhvjs5zww2i4.cloudworkstations.dev',
=======
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
>>>>>>> 720835e4d38b5459561e3c80df50cd395dd9128a
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
