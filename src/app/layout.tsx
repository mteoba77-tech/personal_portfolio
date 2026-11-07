import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProfile } from "@/lib/content";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

// Content can change at runtime (admin edits), so render on each request.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: { default: `${profile.name} | Portfolio`, template: `%s | ${profile.name}` },
    description: `${profile.name} — ${profile.title}`,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header name={profile.name} />
        <main className="flex-1">{children}</main>
        <Footer profile={profile} />
      </body>
    </html>
  );
}
