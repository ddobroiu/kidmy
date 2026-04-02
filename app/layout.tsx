import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kidmy - Creează-ți Lumea 3D | Platformă Educațională",
    template: "%s | Kidmy"
  },
  description: "Platforma educațională unde copiii își transformă desenele în modele 3D reale, învață despre animale și explorează viitorul prin AR și AI.",
  keywords: ["educatie copii", "3d pentru copii", "realitate augmentata copii", "invatare interactiva", "animale 3d", "ai pentru copii", "creativitate digitala"],
  authors: [{ name: "Kidmy Team" }],
  creator: "Kidmy",
  publisher: "Kidmy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://www.kidmy.ro",
    siteName: "Kidmy",
    title: "Kidmy - Magia 3D pentru Copii",
    description: "Transformă imaginația în realitate 3D și învață prin joacă.",
    images: [
      {
        url: "https://www.kidmy.ro/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kidmy 3D Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kidmy - Creează-ți Lumea 3D",
    description: "Platforma educațională 3D pentru micii creatori.",
    images: ["https://www.kidmy.ro/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body
        className={`${outfit.variable} ${plusJakartaSans.variable} antialiased selection:bg-primary/30 min-h-screen flex flex-col font-jakarta`}
      >
        <Providers>
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
