/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/Lap10-Project' : '',
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;