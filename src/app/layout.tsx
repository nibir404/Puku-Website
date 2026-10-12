import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const matter = localFont({
  src: "../fonts/Matter.ttf",
  variable: "--font-matter",
  weight: "300 800",
  display: "swap",
});

const tx02 = localFont({
  src: "../fonts/TX-02.ttf",
  variable: "--font-tx02",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Puku · A calm workbench for shipping software",
    template: "%s · Puku",
  },
  description:
    "Editor, CLI, Chat and App share one memory of your project. Works with the repo you already have.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F1F0E9" },
    { media: "(prefers-color-scheme: dark)", color: "#151614" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${matter.variable} ${tx02.variable}`}>
      <body>
        <Providers>
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
