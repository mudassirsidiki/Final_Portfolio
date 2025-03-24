import Hero from "@/components/hero"
import GameFeature from "@/components/game-feature"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Contact from "@/components/contact"
// import FloatingShapes from "@/components/floating-shapes"

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
            {/* <GameFeature /> */}
          </div>
        </section>

        <section id="projects" className="py-16">
        <div className="container mx-auto px-4">
        <Projects showAll={false} limit={3} />
        </div>
        </section>

        <section id="skills" className="py-16">
          <Skills showAll={false} />
        </section>

        <section id="contact" className="py-16">
          <Contact showFull={false} />
        </section>
      </div>
    </main>
  )
}

