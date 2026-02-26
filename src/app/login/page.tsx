
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Grid3X3 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh px-6">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="space-y-4 flex flex-col items-center pb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-2">
            <Grid3X3 className="text-primary-foreground h-7 w-7" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to manage your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>
            <Input id="password" type="password" />
          </div>
          <Button asChild className="w-full h-11 rounded-full text-lg font-medium" size="lg">
            <Link href="/dashboard">Login</Link>
          </Button>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="rounded-full h-11">Google</Button>
            <Button variant="outline" className="rounded-full h-11">GitHub</Button>
          </div>
          <p className="text-center text-sm text-muted-foreground pt-4">
            Don&apos;t have an account? <Link href="#" className="text-primary hover:underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
