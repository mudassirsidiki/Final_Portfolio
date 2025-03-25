"use client"

import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function GalaxyCanvas() {
  const canvasRef = useRef(null)
  const galaxyRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)
  const clockRef = useRef(null)
  const frameIdRef = useRef(null)
  const [error, setError] = useState(null)
  const [isClient, setIsClient] = useState(false)

  // Galaxy parameters with nice default values
  const parameters = useMemo(() => ({
    count: 150000, // Reduced for better performance
    size: 0.005,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.5,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
    rotationSpeed: 0.05
  }), [])

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)
    clockRef.current = new THREE.Clock()
  }, [])

  // Generate galaxy function
  const generateGalaxy = (scene) => {
    try {
      // Clean up existing galaxy
      if (galaxyRef.current) {
        galaxyRef.current.geometry.dispose()
        galaxyRef.current.material.dispose()
        scene.remove(galaxyRef.current)
      }

      // Create geometry
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(parameters.count * 3)
      const colors = new Float32Array(parameters.count * 3)

      const insideColor = new THREE.Color(parameters.insideColor)
      const outsideColor = new THREE.Color(parameters.outsideColor)

      // Deterministic random function for SSR compatibility
      const seededRandom = (i) => {
        const x = Math.sin(i) * 10000
        return x - Math.floor(x)
      }

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3

        // Position
        const radius = seededRandom(i) * parameters.radius
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2
        const spinAngle = radius * parameters.spin

        // Add randomness to positions
        const randomX = 
          Math.pow(seededRandom(i + 1000), parameters.randomnessPower) * 
          (seededRandom(i + 2000) < 0.5 ? 1 : -1) * 
          parameters.randomness * 
          radius
        
        const randomY = 
          Math.pow(seededRandom(i + 3000), parameters.randomnessPower) * 
          (seededRandom(i + 4000) < 0.5 ? 1 : -1) * 
          parameters.randomness * 
          radius
        
        const randomZ = 
          Math.pow(seededRandom(i + 5000), parameters.randomnessPower) * 
          (seededRandom(i + 6000) < 0.5 ? 1 : -1) * 
          parameters.randomness * 
          radius

        // Calculate position based on branch, spin, and randomness
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // Color
        const mixedColor = insideColor.clone()
        mixedColor.lerp(outsideColor, radius / parameters.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
      }

      // Set geometry attributes
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      // Create material
      const material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
      })

      // Create points and add to scene
      const galaxy = new THREE.Points(geometry, material)
      scene.add(galaxy)
      galaxyRef.current = galaxy
    } catch (error) {
      console.error("Error generating galaxy:", error)
      setError(error.message)
    }
  }

  // Initialize the scene
  useEffect(() => {
    // Guard against SSR
    if (!isClient || !canvasRef.current) return
    
    try {
      // Create scene
      const scene = new THREE.Scene()
      sceneRef.current = scene

      // Check for WebGL support
      if (!THREE.WebGLRenderer.isWebGLAvailable()) {
        const warning = THREE.WebGLRenderer.getWebGLErrorMessage()
        setError(warning.textContent || "WebGL not supported")
        return
      }

      // Create camera
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      )
      camera.position.set(3, 3, 3)
      scene.add(camera)
      cameraRef.current = camera

      // Create renderer with error handling
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      rendererRef.current = renderer

      // Create controls
      const controls = new OrbitControls(camera, canvasRef.current)
      controls.enableDamping = true
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.5
      controls.enableZoom = true
      controls.maxDistance = 20
      controls.minDistance = 1
      controlsRef.current = controls

      // Generate galaxy
      generateGalaxy(scene)

      // Handle resize
      const handleResize = () => {
        // Update sizes
        const width = window.innerWidth
        const height = window.innerHeight

        // Update camera
        camera.aspect = width / height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      }

      window.addEventListener('resize', handleResize)

      // Animation
      const animate = () => {
        try {
          const elapsedTime = clockRef.current.getElapsedTime()

          // Rotate galaxy
          if (galaxyRef.current) {
            galaxyRef.current.rotation.y = elapsedTime * parameters.rotationSpeed
          }

          // Update controls
          controls.update()

          // Render
          renderer.render(scene, camera)

          // Continue animation loop
          frameIdRef.current = window.requestAnimationFrame(animate)
        } catch (error) {
          console.error("Animation error:", error)
          setError(error.message)
          if (frameIdRef.current) {
            window.cancelAnimationFrame(frameIdRef.current)
          }
        }
      }

      animate()

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize)
        if (frameIdRef.current) {
          window.cancelAnimationFrame(frameIdRef.current)
        }
        
        if (rendererRef.current) {
          rendererRef.current.dispose()
        }
        
        if (galaxyRef.current) {
          galaxyRef.current.geometry.dispose()
          galaxyRef.current.material.dispose()
          scene.remove(galaxyRef.current)
        }
        
        if (controlsRef.current) {
          controlsRef.current.dispose()
        }
      }
    } catch (err) {
      console.error("Galaxy initialization error:", err)
      setError(err.message)
    }
  }, [isClient, parameters])

  if (error) {
    return (
      <div className="w-full h-full fixed inset-0 -z-10 bg-gradient-to-b from-blue-900 to-black flex items-center justify-center">
        <div className="text-white text-center p-4 max-w-md">
          <h3 className="text-xl font-bold mb-2">Could not initialize galaxy</h3>
          <p>Your browser may not support WebGL or 3D graphics.</p>
        </div>
      </div>
    )
  }

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full fixed inset-0 -z-10"
      aria-label="Interactive galaxy background"
    />
  )
}