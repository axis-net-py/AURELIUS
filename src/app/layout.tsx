import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getLocale, getMessages } from "next-intl/server";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "AXIS Farm",
  description: "Gestão agrícola — safras, talhões, frota e faturamento",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Locale e mensagens resolvidos no servidor (cookie NEXT_LOCALE) e
  // repassados ao provider de cliente, mantendo SSR e hidratacao iguais.
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
