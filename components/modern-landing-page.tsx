'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { motion } from "framer-motion"
import { Gift, Calendar, Share2 } from 'lucide-react'

export function ModernLandingPageComponent() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-100 dark:via-purple-100 dark:to-pink-100 flex flex-col">
      <header className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 flex justify-between items-center bg-white/50 dark:bg-white/50 backdrop-blur-sm rounded-lg shadow-sm mb-4 sm:mb-8">
        <div className="flex items-center space-x-2 sm:space-x-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg sm:text-xl md:text-4xl font-bold text-indigo-800 dark:text-indigo-800"
          >
            AsYouWish
          </motion.h1>
        </div>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <Button 
            variant="ghost" 
            asChild 
            className="px-3 py-2 h-8 text-sm sm:px-4 sm:h-10 sm:text-base
                       text-indigo-800 hover:text-indigo-900 hover:bg-indigo-100/50
                       transition-colors duration-200"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button 
            variant="default" 
            asChild 
            className="px-3 py-2 h-8 text-sm sm:px-4 sm:h-10 sm:text-base
                       bg-indigo-600 hover:bg-indigo-700 text-white
                       shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        <section className="mb-8 sm:mb-16">
          <div className="container mx-auto rounded-xl p-4 md:p-6">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-800 mb-2">Your Wishes, Realized</h2>
              <p className="text-sm sm:text-base md:text-lg text-indigo-700">Create, share, and fulfill wishlists with magic.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {[
                { 
                  icon: Gift, 
                  title: "Smart Wishlists", 
                  description: "Create personalized wishlists with AI that learns your style and suggests perfect gifts tailored to your taste.",
                },
                { 
                  icon: Share2, 
                  title: "Easy Sharing", 
                  description: "Share your wishlists instantly with friends and family across any platform, making group gifting seamless.",
                },
                { 
                  icon: Calendar, 
                  title: "Event Reminders", 
                  description: "Stay on top of important dates with smart notifications and never miss the perfect moment to celebrate.",
                },
              ].map((feature, index) => (
                <motion.div key={index}>
                  <Card className="h-full shadow-md bg-white/80 dark:bg-white/80">
                    <CardContent className="p-4 md:p-6">
                      {/* Mobile layout (flex row for icon + title, then description below) */}
                      <div className="md:hidden flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <feature.icon className="h-5 w-5 flex-shrink-0 text-indigo-800 dark:text-indigo-800" />
                          <h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-800">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-xs text-indigo-600 dark:text-indigo-600">
                          {feature.description}
                        </p>
                      </div>

                      {/* Desktop layout (centered column) */}
                      <div className="hidden md:flex flex-col items-center text-center">
                        <div className="mb-4">
                          <feature.icon className="h-6 w-6 lg:h-8 lg:w-8 text-indigo-800" />
                        </div>
                        <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-base text-indigo-600">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="w-11/12 sm:w-2/3 h-px bg-indigo-300 mx-auto my-4 sm:my-8 opacity-70" />
        </section>
        <section className="mb-2 sm:mb-4 rounded-xl p-4 md:p-6">
          <h3 className="text-xl md:text-3xl font-bold text-indigo-800 mb-4 md:mb-8 text-center">Perfect For Every Occasion</h3>
          <div className="relative overflow-hidden max-w-6xl mx-auto py-4">
            <motion.div 
              className="flex space-x-4"
              animate={{ 
                x: ["0%", "-50%"]
              }}
              transition={{ 
                duration: 30,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              }}
              style={{
                width: "fit-content"
              }}
            >
              {[...Array(3)].map((_, arrayIndex) => (
                <div key={arrayIndex} className="flex space-x-4">
                  {[
                    { 
                      icon: "🎂", 
                      title: "Birthdays", 
                      description: "Never forget special celebrations again"
                    },
                    { 
                      icon: "💍", 
                      title: "Weddings", 
                      description: "Perfect gifts for happy couples"
                    },
                    { 
                      icon: "👶", 
                      title: "Baby Showers", 
                      description: "Help welcome new family members"
                    },
                    { 
                      icon: "🎄", 
                      title: "Holidays", 
                      description: "Make holiday gifting effortless"
                    },
                    { 
                      icon: "🎓", 
                      title: "Graduations", 
                      description: "Celebrate academic milestones together"
                    },
                    { 
                      icon: "🎉", 
                      title: "Any Occasion", 
                      description: "Perfect for every celebration"
                    },
                  ].map((occasion, index) => (
                    <div
                      key={index}
                      className="w-[120px] md:w-[200px] shrink-0"
                    >
                      <div className="p-2 md:p-4 bg-white rounded-lg shadow-md h-full text-center">
                        <div className="text-xl md:text-4xl mb-1 md:mb-2">{occasion.icon}</div>
                        <h4 className="text-xs md:text-lg font-semibold text-indigo-800 mb-1">
                          {occasion.title}
                        </h4>
                        <p className="hidden md:block text-xs text-indigo-600">
                          {occasion.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
          <div className="w-11/12 sm:w-2/3 h-px bg-indigo-300 mx-auto my-2 sm:my-4 opacity-70" />
        </section>
        {/* <section className="text-center mb-16 bg-white py-12 rounded-lg shadow-md">
          <h3 className="text-3xl font-bold text-indigo-800 mb-8">Why Choose AsYouWish?</h3>
          <div className="grid md:grid-cols-4 gap-8 px-4">
            {[
              { number: "10k+", label: "Active Users" },
              { number: "50k+", label: "Gifts Coordinated" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "15k+", label: "Wishlists Created" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                className="flex flex-col items-center"
              >
                <span className="text-4xl font-bold text-indigo-600 mb-2">{stat.number}</span>
                <span className="text-indigo-800">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section> */}
        <section className="mb-4 sm:mb-8 rounded-xl p-4 md:p-6 mt-2 sm:mt-4">
          <h3 className="text-xl md:text-3xl font-bold text-indigo-800 mb-4 md:mb-8 text-center">How It Works</h3>
          <div className="relative max-w-4xl mx-auto px-4">
            <div className="absolute top-[20px] md:top-[40px] left-[20%] right-[20%] h-1 md:h-1.5 bg-indigo-600/50" />
            <div className="grid grid-cols-3 gap-5 md:gap-8 relative">
              {[
                { 
                  step: 1, 
                  text: "Create your wishlist",
                  description: "Build your perfect wishlist",
                  icon: "✨",
                },
                { 
                  step: 2, 
                  text: "Share with friends",
                  description: "Easily share with family and friends",
                  icon: "🔗",
                },
                { 
                  step: 3, 
                  text: "Receive perfect gifts",
                  description: "Get exactly what you wished for",
                  icon: "🎁",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="relative flex flex-col items-center"
                >
                  <div className="relative z-10">
                    <motion.div
                      className="w-10 h-10 md:w-20 md:h-20 rounded-full bg-white shadow-lg 
                               flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-xl md:text-3xl">{item.icon}</span>
                    </motion.div>
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 
                                 w-5 h-5 md:w-8 md:h-8 rounded-full bg-indigo-600 
                                 text-white flex items-center justify-center 
                                 text-xs md:text-sm font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="mt-2 md:mt-4 bg-white rounded-lg p-2 md:p-6 shadow-md w-[calc(100%+10px)] h-[80px] md:h-[120px] flex flex-col items-center justify-center">
                    <h4 className="text-xs sm:text-sm md:text-xl font-semibold text-indigo-800 text-center">
                      {item.text}
                    </h4>
                    <p className="hidden md:block text-xs sm:text-sm md:text-base text-indigo-600 mt-1 text-center">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-indigo-900 dark:bg-indigo-900 text-white dark:text-white py-8 mt-auto">
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

{/* Add this to your global CSS or style tag */}
<style jsx global>{`
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .section-container {
    background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.3));
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 1rem;
  }
`}</style>
