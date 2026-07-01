import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kiln — Forge Every Algorithm on Real Data",
  description:
    "Unified ML/CV benchmark platform comparing sklearn, Keras, and YOLO across Kaggle, Roboflow, and sklearn datasets.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
