/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',                // <-- genera archivos estáticos
  images: {
    unoptimized: true,            
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig