import type { Metadata } from "next";
import "@fontsource/newsreader/600.css";
import "@fontsource/newsreader/500-italic.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "RWAOS - Real World Asset Operating System",
  description:
    "An agentic financial operating system for tokenized Real World Assets, built with Brickken.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-rwaos-bg font-sans text-rwaos-text antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
