"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import dynamic from 'next/dynamic'

// Dynamically import the galaxy scene with no SSR
const GalaxyCanvas = dynamic(() => import('./galaxy-canvas'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="text-white opacity-50">Loading galaxy...</div>
    </div>
  )
})

// Main component - this is what you'll import in your Hero component
export default function Galaxy() {
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