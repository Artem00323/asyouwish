'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { motion } from "framer-motion"
import { Gift, Calendar, Share2, Sparkles } from 'lucide-react'

export function ModernLandingPageComponent() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-indigo-800"
        >
          AsYouWish
        </motion.h1>
        <nav>
          <Button variant="ghost" asChild className="mr-2">
            <Link href="/login" className="text-black">Login</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl font-bold text-indigo-900 mb-4"
          >
            Your Wishes, Realized
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-indigo-700 mb-8"
          >
            Create, share, and fulfill wishlists with a touch of magic.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center items-center space-x-4"
          >
            <Input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-64 bg-white"
            />
            <Button size="lg">
              Get Early Access <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </section>
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Gift, title: "Smart Wishlists", description: "AI-powered suggestions based on your preferences." },
            { icon: Share2, title: "Easy Sharing", description: "Share your wishlists across all social platforms." },
            { icon: Calendar, title: "Event Reminders", description: "Never miss a gifting opportunity with smart alerts." },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * (index + 4) }}
            >
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <feature.icon className="h-12 w-12 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold text-indigo-800 mb-2">{feature.title}</h3>
                  <p className="text-indigo-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>
        <section className="text-center mb-16">
          <h3 className="text-3xl font-bold text-indigo-800 mb-8">How It Works</h3>
          <div className="flex justify-center items-center space-x-8">
            {[
              { step: 1, text: "Create your wishlist" },
              { step: 2, text: "Share with friends" },
              { step: 3, text: "Receive perfect gifts" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * (index + 10) }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <p className="text-indigo-700">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <footer className="bg-indigo-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">&copy; 2024 AsYouWish. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/contact" className="hover:underline">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
