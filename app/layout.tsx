import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-rwaos-bg text-rwaos-text antialiased">
        {children}
      </body>
    </html>
  );
}
