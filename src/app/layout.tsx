import type { Metadata } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { fetchPublicProfile } from "@/lib/supabasePublic";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let brand = "Portfolio";
  try {
    const profile = await fetchPublicProfile();
    const name = profile?.name?.trim();
    if (name) brand = name;
  } catch {
    // Keep fallback metadata when profile data is unavailable.
  }

  return {
    title: {
      default: brand,
      template: `%s | ${brand}`,
    },
    description: "Professional portfolio — content is loaded from the database.",
    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      title: brand,
      description: "Professional portfolio.",
      siteName: brand,
    },
    twitter: {
      card: "summary_large_image",
      title: brand,
      description: "Professional portfolio.",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} ${poppins.variable} scroll-smooth scroll-pt-16`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=document.documentElement;var s=localStorage.getItem('theme');if(s==='dark'){r.classList.add('dark');}else if(s==='light'){r.classList.remove('dark');}else{if(window.matchMedia('(prefers-color-scheme: dark)').matches){r.classList.add('dark');}else{r.classList.remove('dark');}}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${openSans.className} flex min-h-screen flex-col bg-sky-50 text-gray-950 antialiased transition-colors selection:bg-teal-200 selection:text-gray-900 dark:bg-navy dark:text-slate-heading dark:selection:bg-mint dark:selection:text-navy`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
