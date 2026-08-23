import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "KMI Architectural Hardware | Kumkum Metal Industries",
  description: "Manufacturer of premium door handles, mortise handles, locks, pull handles and high-quality door accessories. Established in 2011, Aligarh, India.",
  keywords: "KMI Hardware, Kumkum Metal, Mortise Handles, Door Locks, Pull Handles, Aligarh Hardware",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
