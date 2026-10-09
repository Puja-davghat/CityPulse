import type { Metadata } from "next";
import { Public_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const publicSans = Public_Sans({ subsets: ["latin"], variable: '--font-sans', fallback: ['system-ui', 'sans-serif'] });
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: '--font-serif',
  style: ['normal', 'italic'],
  adjustFontFallback: false,
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
});

export const metadata: Metadata = {
  title: "CityPulse",
  description: "A local guide to food, heritage, stays and routes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} ${newsreader.variable}`}>
      <body className="flex flex-col min-h-screen bg-ivory text-forest font-sans">
        <AuthProvider>
          <Header />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
