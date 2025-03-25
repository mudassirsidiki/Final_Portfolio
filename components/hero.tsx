"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Galaxy from "@/components/GALAXY"

export default function Hero() {
  // ============= STATE MANAGEMENT =============

  // State for the primary name typewriter effect
  const [nameText, setNameText] = useState("");
  const fullNameText = "I am Mudassir Siddiqui";

  // State for rotating roles
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = [
    "I am a Full Stack Developer",
    "I am a Data Analyst",
  ];

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
      setRoleIndex((prevIndex: number) => (prevIndex + 1) % roles.length);
    }, 3000);

    return () => clearInterval(roleInterval);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="relative min-h-[90vh] flex items-start pt-16 md:pt-24 overflow-hidden"
      ref={containerRef}
    >
      {/* ============= BACKGROUND LAYERS ============= */}

      {/* Galaxy background - The main animated galaxy */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full md:w-2/3 lg:w-1/2 aspect-square">
            <Galaxy />
          </div>
        </div>
      </div>
      

      <div className="w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col space-y-4"
          >
            {/* ============= TEXT HEADINGS ============= */}
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="space-y-1"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                    Hello, world.
                  </span>
                </h1>

                <div className="h-14 sm:h-16 flex items-center text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                  <span>{nameText}</span>
                  <span className="animate-blink ml-1 h-12 w-[3px] bg-blue-400 inline-block"></span>
                </div>

                <div className="h-10 sm:h-12 flex items-center text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white">
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

            <p className="text-lg text-muted-foreground">
            Innovative Web Developer & Data Analyst with a strong passion for building modern, user-friendly web applications and data-driven solutions. Proficient in React.js, Next.js, Tailwind CSS, Express.js, and MongoDB for full-stack development, along with expertise in Power BI, SQL, and Python for analytics and business intelligence. <br />
            With a keen eye for design and functionality, I specialize in crafting seamless digital experiences, implementing dynamic UI/UX components, and optimizing backend performance. My data analytics expertise allows me to extract valuable insights, create interactive dashboards, and develop data-driven strategies that enhance decision-making.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            {/* <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10 rounded-full" />
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Mudassir Ahmed Siddiqui"
                width={400}
                height={400}
                className="object-cover"
                priority
              />
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  )
}