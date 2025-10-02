
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Gem } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push("/admin");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!adminEmail) {
        console.error("Admin email is not configured in environment variables.");
        toast({
            variant: "destructive",
            title: "Configuration Error",
            description: "The application is not configured for admin login. Please contact support.",
        });
        setGoogleLoading(false);
        return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email === adminEmail) {
        toast({ title: "Login Successful", description: "Welcome, Admin!" });
        router.push("/admin");
      } else {
        // If the email doesn't match, sign the user out immediately.
        await signOut(auth);
        toast({
          variant: "destructive",
          title: "Not Authorized",
          description: "This email address is not authorized for admin access.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: error.message,
      });
    } finally {
      setGoogleLoading(false);
    }
  };


  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <div className="flex items-center gap-2">
                    <Gem className="h-8 w-8 text-primary" />
                    <span className="font-headline text-2xl font-bold uppercase tracking-wider text-foreground">
                        LUX G
                    </span>
                </div>
            </div>
          <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || googleLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password"
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || googleLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || googleLoading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
            <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin} disabled={loading || googleLoading}>
              {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.4 64.5c-24.3-23.6-57.5-38.4-96.5-38.4-87.8 0-159.4 71.6-159.4 159.4s71.6 159.4 159.4 159.4c100.3 0 133.1-62.2 137-95.4H248v-73.3h239.5c1.4 12.1 2.2 24.2 2.5 36.8z"></path></svg>}
              Login with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
