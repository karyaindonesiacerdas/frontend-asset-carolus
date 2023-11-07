/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    logo: process.env.NEXT_PUBLIC_LOGO,
  },
};

module.exports = nextConfig;
