import { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public', // Output directory for service worker
  register: true, // Automatically register the service worker
  skipWaiting: true, // Force the new service worker to activate immediately
  disable: process.env.NODE_ENV === 'development' // Disable PWA in development for easier debugging
});

const nextConfig: NextConfig = {
  // Your existing Next.js config (if any) can be added here
};

module.exports = withPWA(nextConfig);