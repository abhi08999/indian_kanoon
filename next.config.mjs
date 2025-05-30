/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useLightningcss: false
  },
    eslint: {
      ignoreDuringBuilds: true, // Disable ESLint during build
    },
  };
  
  export default nextConfig;