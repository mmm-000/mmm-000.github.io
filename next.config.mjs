/** @type {import('next').NextConfig} */
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split("/")[1]
  : "";

const explicitBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// User/org Pages (repo name: username.github.io) is served from domain root.
const isUserOrgPagesRepo = repoName.endsWith(".github.io");

const resolvedBasePath =
  explicitBasePath ||
  (process.env.NODE_ENV === "production" && repoName && !isUserOrgPagesRepo
    ? `/${repoName}`
    : "");

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: resolvedBasePath,
  assetPrefix: resolvedBasePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: resolvedBasePath
  }
};

export default nextConfig;
