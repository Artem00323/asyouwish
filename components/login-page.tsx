'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail, AlertCircle } from "lucide-react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, getFriendlyErrorMessage } from "@/components/backend/firebase";

export function LoginPageComponent() {
  const [email, setEmail] = useState('');       // State for email
  const [password, setPassword] = useState(''); // State for password
  const [error, setError] = useState<string>(''); // State for error messages (string type)
  const router = useRouter(); // Initialize the router

  // Handle Gmail (Google) Login
  const handleGmailLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Gmail login successful:", result.user);
      router.push('/wishlist'); // Redirect to wishlist or desired page
    } catch (err: unknown) {
      if (err instanceof Error && (err as any).code) {
        const errorCode = (err as any).code;
        const friendlyMessage = getFriendlyErrorMessage(errorCode);
        setError(friendlyMessage);
      } else {
        setError("An unknown error occurred. Please try again.");
      }
      console.error("Gmail login error:", err);
    }
  };

  // Handle Email/Password Login
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error state

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User logged in:", user);
      router.push('/wishlist'); // Redirect to wishlist or desired page
    } catch (err: unknown) {
      if (err instanceof Error && (err as any).code) {
        const errorCode = (err as any).code;
        const friendlyMessage = getFriendlyErrorMessage(errorCode);
        setError(friendlyMessage);
      } else {
        setError("An unknown error occurred. Please try again.");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login to AsYouWish</CardTitle>
          <CardDescription className="text-center">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>

        {/* Display the error message */}
        {error && (
          <div className="mx-6 mb-4">
            <div
              className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-sm transition-all duration-300 ease-in-out"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Start of the form */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit">
              Sign In
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGmailLogin}>
              <Mail className="mr-2 h-4 w-4" /> Login with Gmail
            </Button>
          </CardContent>
        </form>

        {/* End of the form */}
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            <span className="mr-1">Don&apos;t have an account?</span>
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
