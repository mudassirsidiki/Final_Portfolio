"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import dynamic from 'next/dynamic'

// Dynamically import the galaxy scene with no SSR
const GalaxyCanvas = dynamic(() => import('./galaxy-canvas'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-b from-blue-900 to-black flex items-center justify-center">
      <div className="text-white opacity-50 animate-pulse">Loading galaxy...</div>
    </div>
  )
})

// Main component - this is what you'll import in your Hero component
export default function Galaxy() {
  const [mounted, setMounted] = useState(false)
  
  // Make sure the component is only rendered client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Render nothing during SSR or hydration
  if (!mounted) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-blue-900 to-black"></div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="w-full h-full"
    >
      <GalaxyCanvas />
    </motion.div>
  )
}