/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Notes and question JSON are read with fs at request time; ship them with every route.
    outputFileTracingIncludes: { "/**": ["./content/**/*"] },
  },
};

export default nextConfig;
