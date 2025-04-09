"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SplineModel from "./SplineModel";

export default function Hero() {
  // ============= STATE MANAGEMENT =============

  // Check if we're on mobile - only for conditional rendering
  const [isMobile, setIsMobile] = useState(false);

  const [viewport, setViewport] = useState({
    scale: 0.75,
    translateY: -30,
  });

  // Add this useEffect for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        // Mobile device settings
        setViewport({
          scale: 0.4, // Much smaller scale on mobile
          translateY: 0, // Different position for mobile
        });
      } else {
        // Keep original desktop settings
        setViewport({
          scale: 0.75,
          translateY: -30,
        });
      }
    };

    // Run once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // State for the primary name typewriter effect
  const [nameText, setNameText] = useState("");
  const fullNameText = "I am Mudassir Siddiqui";

  // State for rotating roles
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["I am a Full Stack Developer", "I am a Data Analyst"];

  // Refs and scroll state for parallax effects
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  // ============= EFFECTS =============

  // Name typewriter effect
  useEffect(() => {
    let i = 0;
    let isDeleting = false;
    let isPaused = false;
    const pauseDuration = 1500;

    const typingInterval = setInterval(
      () => {
        if (isPaused) {
          isPaused = false;
          isDeleting = !isDeleting;
          return;
        }

        if (!isDeleting) {
          // Typing forward
          if (i < fullNameText.length) {
            setNameText(fullNameText.substring(0, i + 1));
            i++;
          } else {
            // Reached the end of text, pause before deleting
            isPaused = true;
            setTimeout(() => {
              isDeleting = true;
            }, pauseDuration);
          }
        } else {
          // Deleting backwards
          if (i > 0) {
            setNameText(fullNameText.substring(0, i - 1));
            i--;
          } else {
            // Finished deleting, pause before typing again
            isPaused = true;
            setTimeout(() => {
              isDeleting = false;
            }, pauseDuration);
          }
        }
      },
      isDeleting ? 30 : 50
    );

    return () => clearInterval(typingInterval);
  }, []);

  // Role rotation effect
  useEffect(() => {
    const roleInterval = setInterval(() => {
      setRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
    }, 3000);

    return () => clearInterval(roleInterval);
  }, []);

  // Set black background for the entire website
  useEffect(() => {
    // Apply black background to the document body and html
    document.documentElement.style.backgroundColor = "#000000";
    document.body.style.backgroundColor = "#000000";

    // Optional: Make sure text color contrasts with black background
    document.body.style.color = "#ffffff";

    return () => {
      // Cleanup if component unmounts (though unlikely for a hero section)
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Replace the entire section component with this updated version
  return (
    <section
      className="relative min-h-screen w-screen overflow-hidden bg-black"
      ref={containerRef}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 z-0 opacity-30">
        {/* <AnimatedParticles /> */}
      </div>

      {/* Floating tech badges */}
      <div className="absolute inset-0 z-0">{/* <FloatingTechBadges /> */}</div>

      {/* Robot model - With responsive settings */}
      <div
        className="absolute inset-0 w-full h-full z-0 overflow-hidden"
        style={{
          clipPath: "inset(0 0 0 0)", // Ensure content is clipped to this container
        }}
      >
        {/* Desktop model */}
        {!isMobile && (
          <div
            style={{
              transform: `scale(${viewport.scale}) translateY(${viewport.translateY}%)`,
              transformOrigin: "center center",
              width: "100%",
              height: "120%",
              position: "relative",
            }}
          >
            <SplineModel modelUrl="https://prod.spline.design/YSJs-eVUVnXfq4i2/scene.splinecode" />
          </div>
        )}

        {/* Mobile model */}
        {isMobile && (
          <div
            style={{
              transform: `scale(${viewport.scale}) translateY(${viewport.translateY}%)`,
              transformOrigin: "center center",
              width: "100%",
              height: "120%",
              position: "relative",
            }}
          >
            <SplineModel modelUrl="https://prod.spline.design/kkyZ0Mgv0ZsQ89GE/scene.splinecode" />
          </div>
        )}
      </div>

      {/* Decorative gradient circles */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-30 -mr-24 -mb-24"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl opacity-20"></div>

      {/* Content positioned on the far left side */}
      <div className="absolute inset-0 z-10">
        <div className="container mx-auto px-4 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side content */}
            <div className="pl-0 md:pl-2 lg:pl-1 md:pt-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col space-y-4 max-w-xl"
              >
                {/* ============= TEXT HEADINGS ============= */}
                <div className="space-y-3 mt-4 md:mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="space-y-1"
                  >
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-white text-left">
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                        Hello, world.
                      </span>
                    </h1>

                    <div className="h-12 md:h-14 lg:h-14 flex items-start justify-start text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                      <span>{nameText}</span>
                      <span className="animate-blink ml-1 h-10 md:h-12 w-[3px] bg-blue-400 inline-block"></span>
                    </div>

                    <div className="h-8 md:h-10 lg:h-10 flex items-start justify-start text-xl md:text-2xl lg:text-4xl font-medium tracking-tight text-white">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`role-${roleIndex}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.5 }}
                          className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400"
                        >
                          {roles[roleIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2 justify-start">
                  <Button size="lg" asChild>
                    <Link href="#projects">
                      View My Work <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact">Get In Touch</Link>
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Right side - Intro moved more to the right with positioning controls */}
            <div className="hidden md:flex md:items-center md:justify-end">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="relative z-10 max-w-md p-6 ml-8 mr-4 bg-black/50 backdrop-blur-sm rounded-lg"
                style={{ marginRight: "-10px" }}
              >
                <p className="text-gray-300 mb-3">
                  I'm a passionate Full Stack Developer and Data Analyst with
                  expertise in modern web technologies and data science. With a
                  strong foundation in both frontend and backend development, I
                  create seamless, user-focused digital experiences.
                </p>
                <p className="text-gray-300"></p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile About Text - Only visible on mobile */}
        {isMobile && (
          <div className="px-4 mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black/50 backdrop-blur-sm rounded-lg p-4"
            >
              <p className="text-sm text-gray-300">
                I'm a passionate Full Stack Developer and Data Analyst with
                expertise in modern web technologies and data science. Lorem
                ipsum dolor sit, amet consectetur adipisicing elit. Dolores,
                consequatur in reprehenderit maxime hic sequi repellendus
                ratione vero nisi iusto sint odio ad.
              </p>
            </motion.div>

            {/* Mobile Spline Model - positioned between bio and tagline */}
            <div className="w-full h-48 mt-4 mb-6 relative">
              <SplineModel modelUrl="https://prod.spline.design/kkyZ0Mgv0ZsQ89GE/scene.splinecode" />
            </div>
          </div>
        )}

        {/* Bottom tagline - "Data Guru by day..." */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-6 left-6 md:left-8 z-20"
          style={{ marginBottom: isMobile ? "40px" : "140px" }}
        >
          <p className="text-base md:text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
            Data Guru by day,
          </p>
          <p className="text-base md:text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
            Debugger Therapist at night
          </p>
        </motion.div>
      </div>
    </section>
  );
}
