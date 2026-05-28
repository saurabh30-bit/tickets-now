/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/tickets-now',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
