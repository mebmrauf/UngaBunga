import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import AppWrapper from "../components/AppWrapper";

export const metadata: Metadata = {
  title: "Admin Panel | Greenora",
  description: "Greenora Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppWrapper>{children}</AppWrapper>
        </Providers>
      </body>
    </html>
  );
}
