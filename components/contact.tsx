"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, Mail, Send, ExternalLink, Globe, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

export default function Contact({ showFull = true }: { showFull?: boolean }) {
  const [copied, setCopied] = useState<string | null>(null)
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopied(email)
  }

  const contactItems = [
    {
      id: 1,
      title: "Email",
      value: "mudassirsidiki@gmail.com",
      icon: <Mail className="h-6 w-6" />,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      link: "mailto:mudassirsidiki@gmail.com",
      copyable: true
    },
    {
      id: 2,
      title: "LinkedIn",
      value: "linkedin.com/in/mudassirsidiki",
      icon: <Linkedin className="h-6 w-6" />,
      color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
      link: "https://www.linkedin.com/in/mudassirsidiki/",
      external: true
    },
    {
      id: 3,
      title: "GitHub",
      value: "github.com/mudassirsidiki",
      icon: <Github className="h-6 w-6" />,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      link: "https://github.com/mudassirsidiki",
      external: true
    },
    {
      id: 4,
      title: "Location",
      value: "Available for Remote Work",
      icon: <MapPin className="h-6 w-6" />,
      color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
    },
    {
      id: 5,
      title: "Availability",
      value: "Open to New Opportunities",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
    },
    {
      id: 6,
      title: "Portfolio",
      value: "View My Work",
      icon: <Globe className="h-6 w-6" />,
      color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
      link: "/projects",
      internal: true
    }
  ]

  return (
    <div className="w-full py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-3">Get In Touch</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Have a project in mind or want to collaborate? Let's connect!
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <Card className="border border-primary/10 bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-8">
            <CardTitle className="text-2xl md:text-3xl">Contact Information</CardTitle>
            <CardDescription className="text-base md:text-lg">
              Connect with me through these platforms
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: item.id * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <div className="flex items-center space-x-4 p-4 rounded-xl border border-muted hover:border-primary/20 transition-all">
                    <div className={`p-3 rounded-full ${item.color}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                      {item.link ? (
                        <Link 
                          href={item.link} 
                          className="font-semibold hover:text-primary transition-colors" 
                          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          <span className="flex items-center">
                            {item.value}
                            {item.external && <ExternalLink className="ml-1 h-3.5 w-3.5" />}
                          </span>
                        </Link>
                      ) : (
                        <p className="font-semibold">{item.value}</p>
                      )}
                    </div>
                    
                    {item.copyable && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCopyEmail(item.value)}
                        className="absolute right-2 top-2"
                        aria-label="Copy email address"
                      >
                        {copied === item.value ? "Copied!" : "Copy"}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {!showFull && (
              <div className="mt-8 flex justify-center">
                <Button size="lg" className="px-8" asChild>
                  <Link href="/contact">
                    View Full Contact Info <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}