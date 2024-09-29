'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail } from "lucide-react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/components/backend/firebase"; // Adjust the path as necessary

export function LoginPageComponent() {
  const [email, setEmail] = useState('');       // State for email
  const [password, setPassword] = useState(''); // State for password
  const [error, setError] = useState('');       // State for error messages
  const router = useRouter(); // Initialize the router

  // Handle Gmail (Google) Login
  const handleGmailLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // You can access user info via result.user
      console.log("Gmail login successful:", result.user);
      router.push('/wishlist'); // Redirect to wishlist or desired page
    } catch (error: any) {
      setError("Gmail login failed: " + error.message);
      console.error("Gmail login error:", error);
    }
  };

  // Handle Email/Password Login
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Reset error state

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User logged in:", user);
      router.push('/wishlist'); // Redirect to wishlist or desired page
    } catch (error: any) {
      setError("Login failed: " + error.message);
      console.error("Login error:", error);
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
            {error && <p className="text-red-500">{error}</p>}
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
