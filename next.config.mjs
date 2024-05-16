import { withSentryConfig } from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "own-jn",
    project: "javascript-nextjs",
  },
  {
    widenClientFileUpload: true,

    transpileClientSDK: true,

    hideSourceMaps: true,

    disableLogger: true,

    automaticVercelMonitors: true,
  }
);
