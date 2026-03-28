/** @type {import('next').NextConfig} */
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split("/")[1]
  : "";

const explicitBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const resolvedBasePath =
  explicitBasePath || (process.env.NODE_ENV === "production" && repoName ? `/${repoName}` : "");

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: resolvedBasePath,
  assetPrefix: resolvedBasePath || undefined
};

export default nextConfig;
