'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function QuizPage() {
  const [birthDate, setBirthDate] = useState('');
  const [heardFrom, setHeardFrom] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Store quiz answers in your database
      const response = await fetch('/api/updateUserQuizAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('user_id'),
          birth_date: birthDate,
          heard_from: heardFrom,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user quiz answers');
      }

      // Proceed to wishlist page
      router.push('/wishlist');
    } catch (error) {
      console.error('Error updating quiz answers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && birthDate) {
      setCurrentStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Tell Us About Yourself</CardTitle>
          <CardDescription className="text-center">
            Help us personalize your experience
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {currentStep === 1 && (
              <div className="space-y-2">
                <Label htmlFor="birthDate">When is your birthday?</Label>
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button className="w-full mt-4" onClick={handleNextStep} disabled={!birthDate}>
                  Next
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-2">
                <Label>How did you hear about us?</Label>
                <RadioGroup value={heardFrom} onValueChange={setHeardFrom} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="social_media" id="social_media" />
                    <Label htmlFor="social_media">Social Media</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="friend" id="friend" />
                    <Label htmlFor="friend">Friend or Family</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="search" id="search" />
                    <Label htmlFor="search">Search Engine</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advertisement" id="advertisement" />
                    <Label htmlFor="advertisement">Advertisement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
                <Button className="w-full mt-4" type="submit" disabled={isLoading || !heardFrom}>
                  {isLoading ? "Saving..." : "Finish"}
                </Button>
              </div>
            )}
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
