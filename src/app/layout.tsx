import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { cookies } from "next/headers";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  RTL_LANGUAGES,
  isValidLanguage,
} from "@/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: "TechPath AI",
  description:
    "A technology learning platform for people who want to learn, build, and grow.",
  openGraph: {
    title: "TechPath AI",
    description: "Learn. Build. Understand. Grow.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TechPath AI",
    description: "Learn. Build. Understand. Grow.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const savedLanguage = cookieStore.get(LANGUAGE_STORAGE_KEY)?.value;
  const language = isValidLanguage(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;
  return (
    <html
      lang={language}
      dir={RTL_LANGUAGES.includes(language) ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={inter.variable}
      data-scroll-behavior="smooth"
    >
      <body className="bg-white text-neutral-900 antialiased dark:bg-[#0a090e] dark:text-neutral-100 font-sans transition-colors">
        <LanguageProvider initialLanguage={language}>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
