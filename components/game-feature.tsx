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

// REVISED SIZE CONTROLS - Reduced heights for mobile devices
// ==================================================================================
// For very small mobile devices (width <= 375px) - iPhone SE size
const VERY_SMALL_MOBILE_HEIGHT_RATIO = 0.55  // Reduced from 0.8 to 0.55
const VERY_SMALL_MOBILE_MAX_HEIGHT = 200     // Reduced from 300 to 200

// For small mobile devices (width <= 400px but > 375px)
const SMALL_MOBILE_HEIGHT_RATIO = 0.6        // Reduced from 0.8 to 0.6
const SMALL_MOBILE_MAX_HEIGHT = 220          // Reduced from 300 to 220

// For medium mobile devices (width <= 768px)
const MOBILE_HEIGHT_RATIO = 0.65             // Reduced from 0.75 to 0.65
const MOBILE_MAX_HEIGHT = 280                // Reduced from 350 to 280

// For desktop devices (width > 768px)
const DESKTOP_HEIGHT_RATIO = 0.5
const DESKTOP_MAX_HEIGHT = 600
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
  const isVerySmallMobileRef = useRef(false)
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      if (!containerRef.current) return

      const { width } = containerRef.current.getBoundingClientRect()
      const screenWidth = window.innerWidth
      const isVerySmallMobile = screenWidth <= 375  // iPhone SE size
      const isSmallMobile = screenWidth <= 400 && screenWidth > 375  // iPhone-size detection
      const isMobile = screenWidth <= 768 && screenWidth > 400
      
      // Update device status
      isMobileRef.current = isMobile
      isSmallMobileRef.current = isSmallMobile
      isVerySmallMobileRef.current = isVerySmallMobile

      // Set canvas width
      canvas.width = width
      
      // UPDATED HEIGHT CONTROL - Better responsive calculations with smaller heights
      // Calculate height based on width and device type using the configurable ratios
      let calculatedHeight
      
      if (isVerySmallMobile) {
        // iPhone SE and similar: Use width ratio with minimum and maximum height constraints
        calculatedHeight = Math.min(Math.max(width * VERY_SMALL_MOBILE_HEIGHT_RATIO, 180), VERY_SMALL_MOBILE_MAX_HEIGHT)
      } else if (isSmallMobile) {
        // Small devices: Use width ratio with minimum and maximum height constraints
        calculatedHeight = Math.min(Math.max(width * SMALL_MOBILE_HEIGHT_RATIO, 200), SMALL_MOBILE_MAX_HEIGHT)
      } else if (isMobile) {
        // Mobile devices: Use width ratio with minimum and maximum height constraints
        calculatedHeight = Math.min(Math.max(width * MOBILE_HEIGHT_RATIO, 240), MOBILE_MAX_HEIGHT)
      } else {
        // Desktop: Use width ratio with minimum and maximum height constraints
        calculatedHeight = Math.min(Math.max(width * DESKTOP_HEIGHT_RATIO, 400), DESKTOP_MAX_HEIGHT)
      }
      
      // Apply the calculated height
      canvas.height = calculatedHeight
      gameHeightRef.current = calculatedHeight

      // Apply calculated height to container and ensure proper sizing
      if (containerRef.current) {
        containerRef.current.style.height = `${calculatedHeight}px`
        containerRef.current.style.padding = "0"
        containerRef.current.style.margin = "0 auto"
        containerRef.current.style.overflow = "hidden" // Prevent scrolling
        containerRef.current.style.position = "relative" // Ensure position context
      }

      // Set adaptive scale based on device type and size
      let baseScale = 1.0
      if (isVerySmallMobile) {
        baseScale = 0.55 // Smaller scale for very small screens
      } else if (isSmallMobile) {
        baseScale = 0.6
      } else if (isMobile) {
        baseScale = 0.7
      }
      
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 600) * baseScale

      initializeGame()
    }

    const initializeGame = () => {
      const scale = scaleRef.current
      const isMobile = isMobileRef.current
      const isSmallMobile = isSmallMobileRef.current
      const isVerySmallMobile = isVerySmallMobileRef.current
      
      // Adaptive sizing based on device and game container
      let LARGE_PIXEL_SIZE, SMALL_PIXEL_SIZE, BALL_SPEED
      
      if (isVerySmallMobile) {
        LARGE_PIXEL_SIZE = 5 * scale // Smaller for very small screens
        SMALL_PIXEL_SIZE = 2.8 * scale
        BALL_SPEED = 3.2 * scale
      } else if (isSmallMobile) {
        LARGE_PIXEL_SIZE = 5.5 * scale
        SMALL_PIXEL_SIZE = 3 * scale
        BALL_SPEED = 3.5 * scale
      } else if (isMobile) {
        LARGE_PIXEL_SIZE = 6.5 * scale
        SMALL_PIXEL_SIZE = 3.5 * scale
        BALL_SPEED = 4 * scale
      } else {
        LARGE_PIXEL_SIZE = 8 * scale
        SMALL_PIXEL_SIZE = 4 * scale
        BALL_SPEED = 5 * scale
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
      
      // Adjusted width percentage for better display
      let maxWidthPercentage
      if (isVerySmallMobile) {
        maxWidthPercentage = 0.8 // Better fit for very small screens
      } else if (isSmallMobile) {
        maxWidthPercentage = 0.75
      } else if (isMobile) {
        maxWidthPercentage = 0.8
      } else {
        maxWidthPercentage = 0.85
      }
      
      const scaleFactor = (canvas.width * maxWidthPercentage) / totalWidth

      const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor
      const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor

      const largeTextHeight = 5 * adjustedLargePixelSize
      const smallTextHeight = 5 * adjustedSmallPixelSize
      
      // Adjusted spacing between lines for better vertical distribution
      let spaceBetweenLines
      if (isVerySmallMobile) {
        spaceBetweenLines = 2 * adjustedLargePixelSize // Reduced spacing for very small screens
      } else if (isSmallMobile) {
        spaceBetweenLines = 3 * adjustedLargePixelSize
      } else if (isMobile) {
        spaceBetweenLines = 4 * adjustedLargePixelSize
      } else {
        spaceBetweenLines = 5 * adjustedLargePixelSize
      }
      
      const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight

      // Improved vertical centering
      let startY = (canvas.height - totalTextHeight) / 2
      
      // For very small screens, ensure text is well-positioned
      if (isVerySmallMobile || isSmallMobile) {
        startY = Math.max((canvas.height - totalTextHeight) / 2, adjustedLargePixelSize)
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

      // Initialize ball position with better defaults
      const ballStartX = canvas.width * 0.75
      const ballStartY = canvas.height * 0.25

      // Adjusted ball sizes for better visibility
      let ballRadius
      if (isVerySmallMobile) {
        ballRadius = adjustedLargePixelSize / 2.8 // Smaller for very small screens
      } else if (isSmallMobile) {
        ballRadius = adjustedLargePixelSize / 2.5
      } else if (isMobile) {
        ballRadius = adjustedLargePixelSize / 2.2
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

      // Improved paddle dimensions
      let paddleWidth, paddleLength
      
      if (isVerySmallMobile) {
        paddleWidth = adjustedLargePixelSize * 0.7
        paddleLength = 6 * adjustedLargePixelSize // Shorter paddles for very small screens
      } else if (isSmallMobile) {
        paddleWidth = adjustedLargePixelSize * 0.8
        paddleLength = 7 * adjustedLargePixelSize
      } else if (isMobile) {
        paddleWidth = adjustedLargePixelSize * 0.9
        paddleLength = 9 * adjustedLargePixelSize
      } else {
        paddleWidth = adjustedLargePixelSize
        paddleLength = 12 * adjustedLargePixelSize
      }

      paddlesRef.current = [
        // Left paddle
        {
          x: 0,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        // Right paddle
        {
          x: canvas.width - paddleWidth,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        // Top paddle
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: 0,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
        // Bottom paddle
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

      // Enhanced boundary handling to ensure ball stays inside canvas
      if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.dy = Math.abs(ball.dy);
      } else if (ball.y + ball.radius >= canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.dy = -Math.abs(ball.dy);
      }
      
      if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.dx = Math.abs(ball.dx);
      } else if (ball.x + ball.radius >= canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.dx = -Math.abs(ball.dx);
      }

      // Improved paddle collision detection
      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          if (
            ball.x - ball.radius < paddle.x + paddle.width &&
            ball.x + ball.radius > paddle.x &&
            ball.y > paddle.y &&
            ball.y < paddle.y + paddle.height
          ) {
            // Push ball out of paddle to prevent getting stuck
            if (paddle.x < canvas.width / 2) { // Left paddle
              ball.x = paddle.x + paddle.width + ball.radius;
            } else { // Right paddle
              ball.x = paddle.x - ball.radius;
            }
            ball.dx = -ball.dx;
          }
        } else {
          if (
            ball.y - ball.radius < paddle.y + paddle.height &&
            ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
          ) {
            // Push ball out of paddle to prevent getting stuck
            if (paddle.y < canvas.height / 2) { // Top paddle
              ball.y = paddle.y + paddle.height + ball.radius;
            } else { // Bottom paddle
              ball.y = paddle.y - ball.radius;
            }
            ball.dy = -ball.dy;
          }
        }
      })

      // Adjusted paddle movement speed based on device
      let paddleSpeed
      if (isVerySmallMobileRef.current) {
        paddleSpeed = 0.2 // Faster response on very small screens
      } else if (isSmallMobileRef.current) {
        paddleSpeed = 0.18
      } else if (isMobileRef.current) {
        paddleSpeed = 0.15
      } else {
        paddleSpeed = 0.12
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

      // Improved pixel collision detection
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
          
          // Calculate direction from pixel center to ball center
          const dx = ball.x - centerX
          const dy = ball.y - centerY
          
          // Determine which side of the pixel was hit
          if (Math.abs(dx) > Math.abs(dy)) {
            ball.dx = dx > 0 ? Math.abs(ball.dx) : -Math.abs(ball.dx)
          } else {
            ball.dy = dy > 0 ? Math.abs(ball.dy) : -Math.abs(ball.dy)
          }
          
          // Add a small boost to prevent the ball from getting stuck
          ball.dx *= 1.01
          ball.dy *= 1.01
        }
      })
    }

    const drawGame = () => {
      if (!ctx) return

      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw pixels
      pixelsRef.current.forEach((pixel) => {
        ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
      })

      // Draw ball with a slight shadow for better visibility
      ctx.fillStyle = BALL_COLOR
      ctx.beginPath()
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw paddles
      ctx.fillStyle = PADDLE_COLOR
      paddlesRef.current.forEach((paddle) => {
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
      })
    }

    const gameLoop = () => {
      updateGame()
      drawGame()
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    // Handle resize on load and window resize
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    
    // Start the game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop)

    // Cleanup function to prevent memory leaks
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="w-full relative" 
      style={{minHeight: "180px"}} // Reduced minimum height from 250px to 180px
    >
      <canvas 
        ref={canvasRef} 
        className="w-full block" 
        aria-label="Interactive Portfolio Game"
      />
    </div>
  )
}