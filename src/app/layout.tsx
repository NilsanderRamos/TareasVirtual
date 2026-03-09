import type { Metadata } from "next";
  import { Inter } from "next/font/google";
  import { Header } from "@/components/layout/Header";
  import { Footer } from "@/components/layout/Footer";
  import { siteConfig } from "@/config/site";
  import "@/styles/global.css";


  const inter = Inter({ subsets: ["latin"] });


  export const metadata: Metadata = {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
  };


  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang={siteConfig.language}>
        <body className={inter.className}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    );
  }

