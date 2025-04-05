"use client"

import { useEffect, useRef } from "react"

// Using the specific purple rgb(124, 58, 237)
const COLOR = "rgb(124, 58, 237)" // Main purple color
const HIT_COLOR = "rgba(124, 58, 237, 0.3)" // Faded version of the same purple
const BACKGROUND_COLOR = "transparent" // Transparent background
const BALL_COLOR = "rgb(124, 58, 237)" // Same purple for the ball
const PADDLE_COLOR = "rgb(124, 58, 237)" // Same purple for paddles
const LETTER_SPACING = 1
const WORD_SPACING = 3

// MANUAL SIZE CONTROLS - Modify these values to adjust the game container dimensions
// ==================================================================================
// For small mobile devices (width <= 400px)
const SMALL_MOBILE_HEIGHT_RATIO = 0.6  // Height as a ratio of width (e.g., 0.6 = 60% of width)
const SMALL_MOBILE_MAX_HEIGHT = 250    // Maximum height in pixels

// For medium mobile devices (width <= 768px)
const MOBILE_HEIGHT_RATIO = 0.7        // Height as a ratio of width
const MOBILE_MAX_HEIGHT = 300          // Maximum height in pixels

// For desktop devices (width > 768px)
const DESKTOP_HEIGHT_RATIO = 0.6       // Height as a ratio of width
const DESKTOP_MAX_HEIGHT = 500         // Maximum height in pixels
// ==================================================================================

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
  const gameHeightRef = useRef(0)
  const isMobileRef = useRef(false)
  const isSmallMobileRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      if (!containerRef.current) return

      const { width } = containerRef.current.getBoundingClientRect()
      const isMobile = window.innerWidth <= 768
      const isSmallMobile = window.innerWidth <= 400 // iPhone-size detection
      
      // Update device status
      isMobileRef.current = isMobile
      isSmallMobileRef.current = isSmallMobile

      // Set canvas width
      canvas.width = width
      
      // MANUAL HEIGHT CONTROL - This section determines the game height
      // Calculate height based on width and device type using the configurable ratios
      let calculatedHeight
      
      if (isSmallMobile) {
        // Very small devices: Use width ratio with maximum height constraint
        calculatedHeight = Math.min(width * SMALL_MOBILE_HEIGHT_RATIO, SMALL_MOBILE_MAX_HEIGHT)
      } else if (isMobile) {
        // Mobile devices: Use width ratio with maximum height constraint
        calculatedHeight = Math.min(width * MOBILE_HEIGHT_RATIO, MOBILE_MAX_HEIGHT)
      } else {
        // Desktop: Use width ratio with maximum height constraint
        calculatedHeight = Math.min(width * DESKTOP_HEIGHT_RATIO, DESKTOP_MAX_HEIGHT)
      }
      
      // Apply the calculated height
      canvas.height = calculatedHeight
      gameHeightRef.current = calculatedHeight

      // Apply calculated height to container with no bottom padding
      if (containerRef.current) {
        containerRef.current.style.height = `${calculatedHeight}px`
        containerRef.current.style.padding = "0"
        containerRef.current.style.margin = "0 auto"
      }

      // Set adaptive scale based on device type
      let baseScale = 1.0
      if (isSmallMobile) {
        baseScale = 0.55 // Much smaller for iPhone
      } else if (isMobile) {
        baseScale = 0.65 // Smaller for other mobile
      }
      
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 800) * baseScale

      initializeGame()
    }

    const initializeGame = () => {
      const scale = scaleRef.current
      const isMobile = isMobileRef.current
      const isSmallMobile = isSmallMobileRef.current
      
      // Even more adaptive sizing based on device
      let LARGE_PIXEL_SIZE, SMALL_PIXEL_SIZE, BALL_SPEED
      
      if (isSmallMobile) {
        LARGE_PIXEL_SIZE = 5 * scale
        SMALL_PIXEL_SIZE = 2.5 * scale
        BALL_SPEED = 3.5 * scale
      } else if (isMobile) {
        LARGE_PIXEL_SIZE = 6 * scale
        SMALL_PIXEL_SIZE = 3 * scale
        BALL_SPEED = 4 * scale
      } else {
        LARGE_PIXEL_SIZE = 8 * scale
        SMALL_PIXEL_SIZE = 4 * scale
        BALL_SPEED = 6 * scale
      }

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
      
      // More conservative width percentage for smaller devices
      let maxWidthPercentage
      if (isSmallMobile) {
        maxWidthPercentage = 0.65 // Even smaller for iPhones
      } else if (isMobile) {
        maxWidthPercentage = 0.7 // Small for general mobile
      } else {
        maxWidthPercentage = 0.8 // Standard for desktop
      }
      
      const scaleFactor = (canvas.width * maxWidthPercentage) / totalWidth

      const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor
      const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor

      const largeTextHeight = 5 * adjustedLargePixelSize
      const smallTextHeight = 5 * adjustedSmallPixelSize
      
      // Reduce spacing between lines for smaller screens
      let spaceBetweenLines
      if (isSmallMobile) {
        spaceBetweenLines = 2 * adjustedLargePixelSize
      } else if (isMobile) {
        spaceBetweenLines = 3 * adjustedLargePixelSize
      } else {
        spaceBetweenLines = 4 * adjustedLargePixelSize
      }
      
      const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight

      // Center vertically with consideration for smaller screens
      let startY = (canvas.height - totalTextHeight) / 2
      
      // For very small screens, move text up slightly to compensate for paddles
      if (isSmallMobile) {
        startY = Math.max((canvas.height - totalTextHeight) / 2 - adjustedLargePixelSize, adjustedLargePixelSize)
      }

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

      // Even smaller ball on small mobile
      let ballRadius
      if (isSmallMobile) {
        ballRadius = adjustedLargePixelSize / 3
      } else if (isMobile) {
        ballRadius = adjustedLargePixelSize / 2.5
      } else {
        ballRadius = adjustedLargePixelSize / 2
      }

      ballRef.current = {
        x: ballStartX,
        y: ballStartY,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: ballRadius,
      }

      // More adaptive paddle dimensions
      let paddleWidth, paddleLength
      
      if (isSmallMobile) {
        paddleWidth = adjustedLargePixelSize * 0.7
        paddleLength = 6 * adjustedLargePixelSize
      } else if (isMobile) {
        paddleWidth = adjustedLargePixelSize * 0.8
        paddleLength = 8 * adjustedLargePixelSize
      } else {
        paddleWidth = adjustedLargePixelSize
        paddleLength = 10 * adjustedLargePixelSize
      }

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
    }

    const updateGame = () => {
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

      // Adjust paddle movement speed based on device
      let paddleSpeed
      if (isSmallMobileRef.current) {
        paddleSpeed = 0.2 // Faster for small mobile
      } else if (isMobileRef.current) {
        paddleSpeed = 0.15 // Fast for mobile
      } else {
        paddleSpeed = 0.1 // Normal for desktop
      }

      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          paddle.targetY = ball.y - paddle.height / 2
          paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY))
          paddle.y += (paddle.targetY - paddle.y) * paddleSpeed
        } else {
          paddle.targetY = ball.x - paddle.width / 2
          paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY))
          paddle.x += (paddle.targetY - paddle.x) * paddleSpeed
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
    }

    const drawGame = () => {
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
    }

    const gameLoop = () => {
      updateGame()
      drawGame()
      requestAnimationFrame(gameLoop)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    gameLoop()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full relative">
      <canvas ref={canvasRef} className="w-full block" aria-label="Interactive Portfolio Game" />
    </div>
  )
}