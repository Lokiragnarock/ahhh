import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SyncAgent } from "@/components/SyncAgent";
import { SubjectProvider } from "@/lib/subject/context";
import { currentSubject } from "@/lib/subject/server";
import { TrackProvider } from "@/lib/tracks-context";
import { currentTrack } from "@/lib/tracks-server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Study Planner",
  description: "Personal study planner and schedule",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const subject = currentSubject();
  const track = currentTrack();
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background font-body-md text-body-md text-on-surface antialiased">
        <TrackProvider track={track}>
          <SubjectProvider subject={subject}>
            <SyncAgent />
            {children}
          </SubjectProvider>
        </TrackProvider>
      </body>
    </html>
  );
}
