/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /pdf\.worker\.entry\.js$/,
      use: { loader: "file-loader", options: { name: "[name].[hash].js" } },
    });
    return config;
  },
   images: {
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ufs.sh',
        pathname: '/f/**',
      },
      {
        protocol: 'https',
        hostname: '**.uploadthing.com',
        pathname: '/f/**',
      },
       {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
