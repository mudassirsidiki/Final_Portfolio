import { Suspense } from "react"
import dynamic from "next/dynamic"
import Hero from "@/components/hero"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Contact from "@/components/contact"
// import FloatingShapes from "@/components/floating-shapes"

// Dynamically import components that use canvas/WebGL
const GameFeature = dynamic(() => import("@/components/game-feature"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="text-purple-300/70 animate-pulse">Loading interactive experience...</div>
    </div>
  )
})

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* <FloatingShapes /> */}
      <div className="container mx-auto px-4 py-8">
        <section id="hero" className="relative min-h-[90vh] flex items-center">
          <Hero />
        </section>
        
        <section id="game" className="py-16 relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Interactive Experience</h2>
            <p className="text-muted-foreground">Play with this retro-inspired game</p>
          </div>
          <div className="h-[500px] w-full rounded-xl overflow-hidden border border-primary/20 shadow-lg">
            <GameFeature />
          </div>
        </section>
        
        <section id="projects" className="py-16">
          <div className="container mx-auto px-4">
            <Suspense fallback={<div className="animate-pulse">Loading projects...</div>}>
              <Projects showAll={false} limit={3} />
            </Suspense>
          </div>
        </section>
        
        <section id="skills" className="py-16">
          <Suspense fallback={<div className="animate-pulse">Loading skills...</div>}>
            <Skills showAll={false} />
          </Suspense>
        </section>
        
        <section id="contact" className="py-16">
          <Suspense fallback={<div className="animate-pulse">Loading contact info...</div>}>
            <Contact showFull={false} />
          </Suspense>
        </section>
      </div>
    </main>
  )
}