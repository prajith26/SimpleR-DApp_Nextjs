import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat R&D",
  description: "Sample routing experiment with chat ids",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
