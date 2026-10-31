import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import InAppBrowserBanner from "@/components/InAppBrowserBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ironandhabit.vercel.app"),
  title: "Iron & Habit - আপনার ফিটনেস ও অভ্যাসের সঠিক সঙ্গী",
  description:
    "সালাত, পুষ্টিকর খাবার, ওয়ার্কআউট এবং শক্তিশালী অভ্যাস গড়ার আধুনিক প্ল্যাটফর্ম। কোনো ইনস্টলেশন ফি ছাড়া সরাসরি ব্যবহার করুন।",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Iron & Habit",
  },
  openGraph: {
    title: "Iron & Habit - আপনার ফিটনেস ও অভ্যাসের সঠিক সঙ্গী",
    description:
      "সালাত, পুষ্টিকর খাবার, ওয়ার্কআউট এবং শক্তিশালী অভ্যাস গড়ার আধুনিক প্ল্যাটফর্ম। কোনো ইনস্টলেশন ফি ছাড়া সরাসরি ব্যবহার করুন।",
    url: "https://ironandhabit.vercel.app",
    siteName: "Iron & Habit",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Iron & Habit Logo",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iron & Habit - আপনার ফিটনেস ও অভ্যাসের সঠিক সঙ্গী",
    description:
      "সালাত, পুষ্টিকর খাবার, ওয়ার্কআউট এবং শক্তিশালী অভ্যাস গড়ার আধুনিক প্ল্যাটফর্ম। কোনো ইনস্টলেশন ফি ছাড়া সরাসরি ব্যবহার করুন।",
    images: ["/icons/icon-512x512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      </head>
      <body className="min-h-full flex flex-col bg-[#07090e] text-[#f9fafb] selection:bg-[#ccff00] selection:text-black">
        <InAppBrowserBanner />
        <GoogleAnalytics />
        <LanguageProvider>
          <AuthProvider>
            {children}
            <AuthModal />
            <ServiceWorkerRegister />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
