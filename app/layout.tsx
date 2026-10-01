import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getContent } from "@/lib/content/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { settings: s } = await getContent();
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(site),
    title: { default: s.seo_title, template: `%s — ${s.brand}` },
    description: s.seo_description,
    openGraph: { title: s.seo_title, description: s.seo_description, images: [s.portrait_url], type: "website" },
    twitter: { card: "summary_large_image", title: s.seo_title, description: s.seo_description, images: [s.portrait_url] },
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
