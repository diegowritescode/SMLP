import type { Metadata } from "next";
import {
  Fraunces,
  IBM_Plex_Sans,
  IBM_Plex_Serif,
  Inter,
  Lora,
  Merriweather,
  Noto_Serif,
  Source_Serif_4,
} from "next/font/google";
import { ReaderPreferencesSync } from "@/components/layout/reader-preferences-sync";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secure Markdown Reader",
  description: "Plataforma privada de lectura Markdown",
};

const fontUi = Inter({
  subsets: ["latin"],
  variable: "--font-ui-inter",
  display: "swap",
});

const fontReaderPrimary = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-reader-source-serif",
  display: "swap",
});

const fontReaderAlt = Lora({
  subsets: ["latin"],
  variable: "--font-reader-lora",
  display: "swap",
});

const fontReaderMerriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-reader-merriweather",
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

const fontReaderNotoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-reader-noto-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontReaderIbmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  variable: "--font-reader-ibm-plex-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontReaderIbmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-reader-ibm-plex-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontReaderHeading = Fraunces({
  subsets: ["latin"],
  variable: "--font-reader-heading-fraunces",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`h-full antialiased ${fontUi.variable} ${fontReaderPrimary.variable} ${fontReaderAlt.variable} ${fontReaderMerriweather.variable} ${fontReaderNotoSerif.variable} ${fontReaderIbmPlexSerif.variable} ${fontReaderIbmPlexSans.variable} ${fontReaderHeading.variable}`}
      data-reader-theme="clean-paper"
      data-reader-columns="spread"
      data-reader-code-mode="notebook"
    >
      <body className="min-h-full flex flex-col">
        <ReaderPreferencesSync />
        {children}
      </body>
    </html>
  );
}
