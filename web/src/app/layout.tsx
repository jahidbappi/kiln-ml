import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Kiln — Forge Every Algorithm on Real Data",
  description:
    "Unified ML/CV benchmark platform comparing sklearn, Keras, and YOLO across Kaggle, Roboflow, and sklearn datasets.",
  openGraph: {
    title: "Kiln ML Benchmarks",
    description: "Forge every algorithm on real data.",
    url: "https://kiln-ml.vercel.app",
    siteName: "Kiln",
    images: [
      {
        url: "https://kiln-ml.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "Kiln — ML/CV benchmark platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiln ML Benchmarks",
    description: "Forge every algorithm on real data.",
    images: ["https://kiln-ml.vercel.app/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
