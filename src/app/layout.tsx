import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "%s | Portfolio",
  },
  description: "Professional portfolio — content is loaded from the database.",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Portfolio",
    description: "Professional portfolio.",
    siteName: "Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio",
    description: "Professional portfolio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth scroll-pt-16"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-white text-gray-950 transition-colors dark:bg-gray-950 dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
