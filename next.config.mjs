/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /pdf\.worker\.entry\.js$/,
      use: { loader: "file-loader", options: { name: "[name].[hash].js" } },
    });
    return config;
  },
};

export default nextConfig;
