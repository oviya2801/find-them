import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-red-800">Access Denied</CardTitle>
          <CardDescription>You don't have permission to access this page.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            This page requires specific permissions that your account doesn't have. Please contact your administrator if
            you believe this is an error.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/">Return to Homepage</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/organization/login">Login with Different Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
