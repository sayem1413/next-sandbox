import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo Demo | Next.js",
  description: "A demo todo app with Next.js API routes and JSON responses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
