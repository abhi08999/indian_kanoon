// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     useLightningcss: false
//   },
//     eslint: {
//       ignoreDuringBuilds: true, // Disable ESLint during build
//     },
//   };
  
//   export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useLightningcss: false, // Force disable LightningCSS
    serverComponentsExternalPackages: ['lightningcss']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push('lightningcss');
    return config;
  }
};

export default nextConfig;