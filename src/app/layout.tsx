import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import SideMenu from "./components/sideMenu"
import type { Metadata } from "next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "IT Step Next/React Project",
  description: "This is a project for IT Step Next/React course",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <SideMenu />
        <div className="lg:pl-72">
          <main className="flex-1 overflow-y-auto min-h-screen text-white">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
