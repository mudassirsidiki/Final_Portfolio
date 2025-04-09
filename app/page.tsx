import { Suspense } from "react"
import Hero from "@/components/hero"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Contact from "@/components/contact"
// import FloatingShapes from "@/components/floating-shapes"
import ClientGameFeature from "@/components/ClientGameFeature"


export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* <FloatingShapes /> */}
      <div className="container mx-auto px-4 py-8">
        <section id="hero" className="relative min-h-[90vh] flex items-center">
          <Hero />
        </section>
        
        <section id="game" className="py-8 relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Interactive Experience</h2>
            <p className="text-muted-foreground">Play with this retro-inspired game</p>
          </div>
          <div className=" w-full rounded-xl overflow-hidden border border-primary/20 shadow-lg">
            <ClientGameFeature />
          </div>
        </section>
        
        <section id="projects" className="py-10">
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