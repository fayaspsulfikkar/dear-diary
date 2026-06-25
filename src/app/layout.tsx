import type { Metadata } from "next";
import { Inter, Lora, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { createClient } from '@/lib/supabase/server';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Dear Diary",
  description: "A private, beautiful, and secure space for your thoughts.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let fontClass = 'font-sans';
  
  if (user) {
    const { data } = await supabase.from('profiles').select('font_preference').eq('id', user.id).single();
    if (data?.font_preference === 'serif') {
      fontClass = 'font-serif';
    }
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${cormorant.variable} ${greatVibes.variable} h-full antialiased ${fontClass}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
