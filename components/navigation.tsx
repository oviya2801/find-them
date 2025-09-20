"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Users, Camera } from "lucide-react"

export function Navigation() {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FindThem</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/cases" className="text-gray-600 hover:text-gray-900 font-medium">
              Browse Cases
            </Link>
            <Link href="/report-sighting" className="text-gray-600 hover:text-gray-900 font-medium">
              Report Sighting
            </Link>
            <Link href="/photo-match" className="text-gray-600 hover:text-gray-900 font-medium">
              Photo Match
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium">
              About
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/photo-match">
                <Camera className="mr-2 h-4 w-4" />
                Photo Match
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/organization/login">
                <Users className="mr-2 h-4 w-4" />
                Organization Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
