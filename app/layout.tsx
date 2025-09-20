import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "FindThem - Help Bring Missing Children Home",
  description:
    "A collaborative platform connecting NGOs, law enforcement, and communities to locate missing children and reunite families.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <Navigation />
        <main>{children}</main>
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">FindThem</h3>
                <p className="text-gray-400 text-sm">
                  Helping bring missing children home through community collaboration.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="/cases" className="hover:text-white">
                      Browse Cases
                    </a>
                  </li>
                  <li>
                    <a href="/report-sighting" className="hover:text-white">
                      Report Sighting
                    </a>
                  </li>
                  <li>
                    <a href="/photo-match" className="hover:text-white">
                      Photo Match
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="hover:text-white">
                      About Us
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">For Organizations</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="/organization/login" className="hover:text-white">
                      Login
                    </a>
                  </li>
                  <li>
                    <a href="/organization/register" className="hover:text-white">
                      Register
                    </a>
                  </li>
                  <li>
                    <a href="/organization/dashboard" className="hover:text-white">
                      Dashboard
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Emergency</h4>
                <p className="text-sm text-gray-400 mb-2">If you have immediate information about a missing child:</p>
                <p className="text-lg font-bold text-red-400">Call 911</p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 FindThem Platform. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
