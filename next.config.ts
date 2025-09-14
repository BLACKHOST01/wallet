import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  matcher: ["/dashboard/:path*", "/profile/:path*"], // list all protected routes
};

export default nextConfig;
