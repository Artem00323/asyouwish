// components/login-page.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Mail, AlertCircle } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider, getFriendlyErrorMessage } from '@/components/backend/firebase';
import { FirebaseError } from 'firebase/app';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Function to ensure user exists in the database
  const ensureUserInDatabase = async (userData: {
    user_id: string;
    name: string;
    email: string;
    password_hash: string;
  }) => {
    try {
      const response = await fetch('/api/ensureUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to ensure user in database');
      }
      console.log('User successfully ensured in database:', userData);
    } catch (error) {
      console.error('Error ensuring user in database:', error);
      setError("Failed to save user data. Please try again.");
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError('');

    try {
      // Firebase login logic
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User logged in:', user);

      // Ensure user exists in the database
      await ensureUserInDatabase({
        user_id: user.uid,
        name: user.displayName || '', // or prompt for name if needed
        email: user.email || '',
        password_hash: '', // Not storing passwords
      });

      // Store user_id in localStorage
      localStorage.setItem('user_id', user.uid);

      // Proceed with login flow
      router.push('/wishlist');
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        const friendlyMessage = getFriendlyErrorMessage(err.code);
        setError(friendlyMessage);
      } else if (err instanceof Error) {
        setError('An unexpected error occurred. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Google login successful:', user);

      // Ensure user exists in the database
      await ensureUserInDatabase({
        user_id: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        password_hash: '',
      });

      // Store user_id in localStorage
      localStorage.setItem('user_id', user.uid);

      // Proceed with login flow
      router.push('/wishlist');
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        const friendlyMessage = getFriendlyErrorMessage(err.code);
        setError(friendlyMessage);
      } else if (err instanceof Error) {
        setError('An unexpected error occurred. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Google login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login to Your Account</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials below to login
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

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Logging In..." : "Login"}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Mail className="mr-2 h-4 w-4" /> {isLoading ? "Signing In..." : "Sign in with Google"}
            </Button>
          </CardContent>
        </form>

        <CardFooter>
          <div className="text-sm text-muted-foreground text-center w-full">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}