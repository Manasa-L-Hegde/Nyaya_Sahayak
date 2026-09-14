import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nyaya Sahayak (न्याय सहायक) - AI Legal Assistance for India",
  description:
    "Context-aware Indian AI legal assistant. Intelligent issue classification, safety triage, targeted clarifying questions, statutory citations, and procedural guidance.",
  keywords: [
    "Legal aid India",
    "Nyaya Sahayak",
    "Tenant rights India",
    "Consumer protection",
    "Cyber fraud 1930",
    "Domestic violence 181",
    "RTI portal",
    "BNSS FIR",
  ],
  authors: [{ name: "Nyaya Sahayak Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://generativelanguage.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://generativelanguage.googleapis.com" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        {children}
      </body>
    </html>
  );
}
