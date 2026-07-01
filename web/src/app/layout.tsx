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
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
