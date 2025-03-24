"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Shape {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  type: "circle" | "square" | "triangle" | "dot"
  color: string
  delay: number
  duration: number
}

export default function FloatingShapes() {
  const [shapes, setShapes] = useState<Shape[]>([])

  useEffect(() => {
    const colors = [
      "rgba(138, 43, 226, 0.2)", // purple
      "rgba(0, 191, 255, 0.2)", // blue
      "rgba(255, 105, 180, 0.2)", // pink
      "rgba(50, 205, 50, 0.2)", // green
    ]

    const types: ("circle" | "square" | "triangle" | "dot")[] = ["circle", "square", "triangle", "dot"]

    const generatedShapes: Shape[] = []

    for (let i = 0; i < 20; i++) {
      generatedShapes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 80 + 20,
        rotation: Math.random() * 360,
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 5,
        duration: Math.random() * 20 + 20,
      })
    }

    setShapes(generatedShapes)
  }, [])

  const renderShape = (shape: Shape) => {
    switch (shape.type) {
      case "circle":
        return (
          <div
            className="rounded-full absolute"
            style={{
              width: shape.size,
              height: shape.size,
              backgroundColor: shape.color,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
            }}
          />
        )
      case "square":
        return (
          <div
            className="absolute"
            style={{
              width: shape.size,
              height: shape.size,
              backgroundColor: shape.color,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              transform: `rotate(${shape.rotation}deg)`,
            }}
          />
        )
      case "triangle":
        return (
          <div
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              transform: `rotate(${shape.rotation}deg)`,
            }}
          />
        )
      case "dot":
        return (
          <div
            className="rounded-full absolute"
            style={{
              width: shape.size / 4,
              height: shape.size / 4,
              backgroundColor: shape.color,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          initial={{
            x: `${shape.x}%`,
            y: `${shape.y}%`,
            opacity: 0,
            rotate: shape.rotation,
          }}
          animate={{
            x: [`${shape.x}%`, `${shape.x + (Math.random() * 10 - 5)}%`],
            y: [`${shape.y}%`, `${shape.y + (Math.random() * 10 - 5)}%`],
            opacity: [0, 0.8, 0.4],
            rotate: [shape.rotation, shape.rotation + 360],
          }}
          transition={{
            duration: shape.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: shape.delay,
            ease: "easeInOut",
          }}
        >
          {renderShape(shape)}
        </motion.div>
      ))}
    </div>
  )
}

