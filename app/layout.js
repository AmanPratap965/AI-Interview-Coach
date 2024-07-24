import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Interview Mocker",
  description: "Practice Mock Interviews through ai",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster/>
        </body>
    </html>
    </ClerkProvider>
  );
}
