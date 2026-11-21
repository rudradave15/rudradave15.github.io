import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ReceiptProvider } from "@/components/receipt";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { SignalTrace } from "@/components/effects/signal-trace";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const SITE_URL = "https://rudradave.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rudra Dave, builder",
    template: "%s, Rudra Dave",
  },
  description:
    "Rudra Dave builds systems that run against real data: deterministic scoring engines, agent orchestration, analytics on production APIs. Not tutorials.",
  openGraph: {
    title: "Rudra Dave, builder",
    description:
      "Systems that run against real data and real constraints. Deterministic scoring engines, agent orchestration, analytics on production APIs.",
    url: SITE_URL,
    siteName: "Rudra Dave",
    images: [{ url: "/og.svg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rudra Dave, builder",
    description:
      "Systems that run against real data and real constraints. Deterministic scoring engines, agent orchestration, analytics on production APIs.",
    images: ["/og.svg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <div className="aurora" aria-hidden />
        <SignalTrace />
        <ReceiptProvider>
          <SmoothScroll />
          <CursorGlow />
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReceiptProvider>
      </body>
    </html>
  );
}
