import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DVD Sleep Screen",
  description: "Classic bouncing DVD logo simulation with controls."
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
