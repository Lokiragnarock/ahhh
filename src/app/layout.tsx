import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SyncAgent } from "@/components/SyncAgent";
import { SubjectProvider } from "@/lib/subject/context";
import { currentSubject } from "@/lib/subject/server";
import { currentPlayer } from "@/lib/gmat/current";
import { TrackProvider } from "@/lib/tracks-context";
import { currentTrack } from "@/lib/tracks-server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// GMAT skin fonts. Loaded for both tracks (variables only); applied under
// [data-track="gmat"] in globals.css.
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
const jbmono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbmono", display: "swap" });

export const metadata: Metadata = {
  title: "Study Planner",
  description: "Personal study planner and schedule",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const subject = currentSubject();
  const track = currentTrack();
  // One query, GMAT only: the nav needs the role to show owner-only links.
  const me = track === "gmat" ? await currentPlayer() : null;
  const role = me?.state === "ok" ? me.player.role : null;
  return (
    <html lang="en" className={`${inter.variable} ${hanken.variable} ${jbmono.variable}`}>
      <body data-track={track} className="bg-background font-body-md text-body-md text-on-surface antialiased">
        <TrackProvider track={track} role={role}>
          <SubjectProvider subject={subject}>
            <SyncAgent />
            {children}
          </SubjectProvider>
        </TrackProvider>
      </body>
    </html>
  );
}
