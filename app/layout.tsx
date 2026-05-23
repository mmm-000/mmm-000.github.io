import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DVD Sleep Screen",
  description:
    "Browser recreation of the classic bouncing DVD screensaver with adjustable speed, logo size, and custom images."
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1871722914538163"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
