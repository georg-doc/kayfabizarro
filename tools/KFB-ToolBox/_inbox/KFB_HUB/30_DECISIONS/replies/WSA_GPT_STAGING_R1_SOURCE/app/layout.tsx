import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KFB · WS1 Staging",
  description: "Geprüfte WS1-Stände direkt auf der GPT-Zielplattform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
