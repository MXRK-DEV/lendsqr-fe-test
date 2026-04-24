import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UserLayout from "@/app/components/UserLayout";
import "../../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lendsqr",
  description: "Admin dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserLayout>{children}</UserLayout>
    </>
  );
}
