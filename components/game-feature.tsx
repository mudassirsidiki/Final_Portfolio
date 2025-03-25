"use client"

import { useEffect, useRef, useState } from "react"

// Using the specific purple rgb(124, 58, 237)
const COLOR = "rgb(124, 58, 237)" // Main purple color
const HIT_COLOR = "rgba(124, 58, 237, 0.3)" // Faded version of the same purple
const BACKGROUND_COLOR = "transparent" // Transparent background
const BALL_COLOR = "rgb(124, 58, 237)" // Same purple for the ball
const PADDLE_COLOR = "rgb(124, 58, 237)" // Same purple for paddles
const LETTER_SPACING = 1
const WORD_SPACING = 3

const PIXEL_MAP = {
  P: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  R: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  G: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  U: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  W: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  B: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
}

interface Pixel {
  x: number
  y: number
  size: number
  hit: boolean
}

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
  targetY: number
  isVertical: boolean
}

export default function GameFeature() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 })
  const paddlesRef = useRef<Paddle[]>([])
  const scaleRef = useRef(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Guard against SSR
    if (!isClient) return

    try {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setError("Canvas 2D context not supported")
        return
      }

      const resizeCanvas = () => {
        try {
          if (!containerRef.current) return

          const { width, height } = containerRef.current.getBoundingClientRect()
          
          // Prevent canvas from being too small
          if (width < 100 || height < 100) return
          
          canvas.width = width
          canvas.height = height
          scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000)
          initializeGame()
        } catch (err) {
          console.error("Resize error:", err)
          setError("Failed to resize canvas")
        }
      }

      const initializeGame = () => {
        try {
          const scale = scaleRef.current
          const LARGE_PIXEL_SIZE = 8 * scale
          const SMALL_PIXEL_SIZE = 4 * scale
          const BALL_SPEED = 5 * scale // Slightly reduced for better performance

          pixelsRef.current = []
          const words = ["PORTFOLIO", "WEBSITE"]

          const calculateWordWidth = (word: string, pixelSize: number) => {
            return (
              word.split("").reduce((width, letter) => {
                const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0
                return width + letterWidth * pixelSize + LETTER_SPACING * pixelSize
              }, 0) -
              LETTER_SPACING * pixelSize
            )
          }

          const totalWidthLarge = calculateWordWidth(words[0], LARGE_PIXEL_SIZE)
          const totalWidthSmall = words[1].split(" ").reduce((width, word, index) => {
            return width + calculateWordWidth(word, SMALL_PIXEL_SIZE) + (index > 0 ? WORD_SPACING * SMALL_PIXEL_SIZE : 0)
          }, 0)
          const totalWidth = Math.max(totalWidthLarge, totalWidthSmall)
          const scaleFactor = (canvas.width * 0.8) / totalWidth

          const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor
          const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor

          const largeTextHeight = 5 * adjustedLargePixelSize
          const smallTextHeight = 5 * adjustedSmallPixelSize
          const spaceBetweenLines = 5 * adjustedLargePixelSize
          const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight

          let startY = (canvas.height - totalTextHeight) / 2

          words.forEach((word, wordIndex) => {
            const pixelSize = wordIndex === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize
            const totalWidth =
              wordIndex === 0
                ? calculateWordWidth(word, adjustedLargePixelSize)
                : words[1].split(" ").reduce((width, w, index) => {
                    return (
                      width +
                      calculateWordWidth(w, adjustedSmallPixelSize) +
                      (index > 0 ? WORD_SPACING * adjustedSmallPixelSize : 0)
                    )
                  }, 0)

            let startX = (canvas.width - totalWidth) / 2

            if (wordIndex === 1) {
              word.split(" ").forEach((subWord) => {
                subWord.split("").forEach((letter) => {
                  const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
                  if (!pixelMap) return

                  for (let i = 0; i < pixelMap.length; i++) {
                    for (let j = 0; j < pixelMap[i].length; j++) {
                      if (pixelMap[i][j]) {
                        const x = startX + j * pixelSize
                        const y = startY + i * pixelSize
                        pixelsRef.current.push({ x, y, size: pixelSize, hit: false })
                      }
                    }
                  }
                  startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
                })
                startX += WORD_SPACING * adjustedSmallPixelSize
              })
            } else {
              word.split("").forEach((letter) => {
                const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
                if (!pixelMap) return

                for (let i = 0; i < pixelMap.length; i++) {
                  for (let j = 0; j < pixelMap[i].length; j++) {
                    if (pixelMap[i][j]) {
                      const x = startX + j * pixelSize
                      const y = startY + i * pixelSize
                      pixelsRef.current.push({ x, y, size: pixelSize, hit: false })
                    }
                  }
                }
                startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
              })
            }
            startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0
          })

          // Initialize ball position near the top right corner
          const ballStartX = canvas.width * 0.9
          const ballStartY = canvas.height * 0.1

          ballRef.current = {
            x: ballStartX,
            y: ballStartY,
            dx: -BALL_SPEED,
            dy: BALL_SPEED,
            radius: adjustedLargePixelSize / 2,
          }

          const paddleWidth = adjustedLargePixelSize
          const paddleLength = 10 * adjustedLargePixelSize

          paddlesRef.current = [
            {
              x: 0,
              y: canvas.height / 2 - paddleLength / 2,
              width: paddleWidth,
              height: paddleLength,
              targetY: canvas.height / 2 - paddleLength / 2,
              isVertical: true,
            },
            {
              x: canvas.width - paddleWidth,
              y: canvas.height / 2 - paddleLength / 2,
              width: paddleWidth,
              height: paddleLength,
              targetY: canvas.height / 2 - paddleLength / 2,
              isVertical: true,
            },
            {
              x: canvas.width / 2 - paddleLength / 2,
              y: 0,
              width: paddleLength,
              height: paddleWidth,
              targetY: canvas.width / 2 - paddleLength / 2,
              isVertical: false,
            },
            {
              x: canvas.width / 2 - paddleLength / 2,
              y: canvas.height - paddleWidth,
              width: paddleLength,
              height: paddleWidth,
              targetY: canvas.width / 2 - paddleLength / 2,
              isVertical: false,
            },
          ]
        } catch (err) {
          console.error("Game initialization error:", err)
          setError("Failed to initialize game")
        }
      }

      const updateGame = () => {
        try {
          const ball = ballRef.current
          const paddles = paddlesRef.current

          ball.x += ball.dx
          ball.y += ball.dy

          if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.dy = -ball.dy
          }
          if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ball.dx = -ball.dx
          }

          paddles.forEach((paddle) => {
            if (paddle.isVertical) {
              if (
                ball.x - ball.radius < paddle.x + paddle.width &&
                ball.x + ball.radius > paddle.x &&
                ball.y > paddle.y &&
                ball.y < paddle.y + paddle.height
              ) {
                ball.dx = -ball.dx
              }
            } else {
              if (
                ball.y - ball.radius < paddle.y + paddle.height &&
                ball.y + ball.radius > paddle.y &&
                ball.x > paddle.x &&
                ball.x < paddle.x + paddle.width
              ) {
                ball.dy = -ball.dy
              }
            }
          })

          paddles.forEach((paddle) => {
            if (paddle.isVertical) {
              paddle.targetY = ball.y - paddle.height / 2
              paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY))
              paddle.y += (paddle.targetY - paddle.y) * 0.1
            } else {
              paddle.targetY = ball.x - paddle.width / 2
              paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY))
              paddle.x += (paddle.targetY - paddle.x) * 0.1
            }
          })

          pixelsRef.current.forEach((pixel) => {
            if (
              !pixel.hit &&
              ball.x + ball.radius > pixel.x &&
              ball.x - ball.radius < pixel.x + pixel.size &&
              ball.y + ball.radius > pixel.y &&
              ball.y - ball.radius < pixel.y + pixel.size
            ) {
              pixel.hit = true
              const centerX = pixel.x + pixel.size / 2
              const centerY = pixel.y + pixel.size / 2
              if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
                ball.dx = -ball.dx
              } else {
                ball.dy = -ball.dy
              }
            }
          })
        } catch (err) {
          console.error("Game update error:", err)
          setError("Game update error")
          
          if (animationFrameRef.current) {
            window.cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
          }
        }
      }

      const drawGame = () => {
        try {
          if (!ctx) return

          // Clear canvas with transparent background
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          pixelsRef.current.forEach((pixel) => {
            ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR
            ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
          })

          ctx.fillStyle = BALL_COLOR
          ctx.beginPath()
          ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = PADDLE_COLOR
          paddlesRef.current.forEach((paddle) => {
            ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
          })
        } catch (err) {
          console.error("Game render error:", err)
          setError("Game render error")
          
          if (animationFrameRef.current) {
            window.cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
          }
        }
      }

      const gameLoop = () => {
        try {
          updateGame()
          drawGame()
          animationFrameRef.current = window.requestAnimationFrame(gameLoop)
        } catch (err) {
          console.error("Game loop error:", err)
          setError("Game loop error")
          
          if (animationFrameRef.current) {
            window.cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
          }
        }
      }

      // Only start the game if visible in viewport
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          if (entry.isIntersecting) {
            resizeCanvas()
            gameLoop()
          } else if (animationFrameRef.current) {
            window.cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
          }
        },
        { threshold: 0.1 }
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }

      // Handle resize with debounce
      let resizeTimeout: ReturnType<typeof setTimeout> | null = null
      const handleResize = () => {
        if (resizeTimeout) clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(resizeCanvas, 250)
      }

      window.addEventListener("resize", handleResize)
      window.addEventListener("orientationchange", handleResize)

      // Also check for visibility changes
      document.addEventListener("visibilitychange", () => {
        if (document.hidden && animationFrameRef.current) {
          window.cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        } else if (!document.hidden && containerRef.current) {
          // Only restart if container is visible
          const rect = containerRef.current.getBoundingClientRect()
          if (
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0
          ) {
            resizeCanvas()
            gameLoop()
          }
        }
      })

      return () => {
        observer.disconnect()
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("orientationchange", handleResize)
        
        if (animationFrameRef.current) {
          window.cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
        
        if (resizeTimeout) {
          clearTimeout(resizeTimeout)
        }
      }
    } catch (err) {
      console.error("Fatal error:", err)
      setError("Failed to initialize game feature")
    }
  }, [isClient])

  // Fallback for server-side rendering or errors
  if (!isClient || error) {
    return (
      <div ref={containerRef} className="w-full h-full relative flex items-center justify-center">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold mb-2 text-purple-600">PORTFOLIO WEBSITE</h2>
          {error && <p className="text-sm text-gray-500">Loading interactive elements...</p>}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" aria-label="Interactive Portfolio Game" />
    </div>
  )
}