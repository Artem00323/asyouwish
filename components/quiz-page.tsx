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
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl font-bold text-center">Quick Questions</CardTitle>
          <CardDescription className="text-center text-base">
            Help us personalize your experience
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-6">
            {currentStep === 1 && (
              <div className="space-y-4 flex flex-col items-center">
                <div className="text-center w-full">
                  <Label htmlFor="birthDate" className="text-lg font-medium block mb-2">
                    When is your birthday?
                  </Label>
                </div>
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-muted-foreground text-xs text-center">
                  We&apos;ll remind your friends about your special day
                </p>
                <Button 
                  className="w-3/4 mt-4 h-10 text-base" 
                  onClick={handleNextStep} 
                  disabled={!birthDate}
                >
                  Next
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 flex flex-col items-center">
                <div className="text-center w-full">
                  <Label className="text-lg font-medium block mb-2">
                    How did you hear about us?
                  </Label>
                </div>
                <RadioGroup 
                  value={heardFrom} 
                  onValueChange={setHeardFrom} 
                  className="space-y-3 w-full"
                >
                  {[
                    { value: 'social_media', label: 'Social Media' },
                    { value: 'friend', label: 'Friend or Family' },
                    { value: 'search', label: 'Search Engine' },
                    { value: 'advertisement', label: 'Advertisement' },
                    { value: 'other', label: 'Other' },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-grow cursor-pointer text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-muted-foreground text-xs text-center">
                  Your feedback helps us improve
                </p>
                <Button 
                  className="w-3/4 mt-4 h-10 text-base" 
                  type="submit" 
                  disabled={isLoading || !heardFrom}
                >
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
