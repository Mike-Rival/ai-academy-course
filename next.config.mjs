// basePath comes from the env so local dev (no var set) serves at "/"
// and GitHub Pages serves under /<repo-name>/. The GH Actions workflow
// sets NEXT_PUBLIC_BASE_PATH; locally you leave it unset.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
