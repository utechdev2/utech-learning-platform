import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UTECH Learning Hub",
  description: "Learn. Build. Grow. — A modern learning platform by UTECH.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}