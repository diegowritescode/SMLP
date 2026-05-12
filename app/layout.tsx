import type { Metadata } from "next";
import { Fraunces, Inter, Lora, Source_Serif_4 } from "next/font/google";
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
      className={`h-full antialiased ${fontUi.variable} ${fontReaderPrimary.variable} ${fontReaderAlt.variable} ${fontReaderHeading.variable}`}
      data-reader-theme="clean-paper"
      data-reader-columns="spread"
    >
      <body className="min-h-full flex flex-col">
        <ReaderPreferencesSync />
        {children}
      </body>
    </html>
  );
}
