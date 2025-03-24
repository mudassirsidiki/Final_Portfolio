"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface Skill {
  id: number
  name: string
  icon: string
  level: number
  category: "frontend" | "backend" | "data" | "tools"
}

const skills: Skill[] = [
  { id: 1, name: "React", icon: "⚛️", level: 90, category: "frontend" },
  { id: 2, name: "Next.js", icon: "▲", level: 85, category: "frontend" },
  { id: 3, name: "TypeScript", icon: "TS", level: 80, category: "frontend" },
  { id: 4, name: "Node.js", icon: "🟢", level: 85, category: "backend" },
  { id: 5, name: "Python", icon: "🐍", level: 75, category: "backend" },
  { id: 6, name: "SQL", icon: "🗃️", level: 80, category: "data" },
  { id: 7, name: "MongoDB", icon: "🍃", level: 75, category: "data" },
  { id: 8, name: "AWS", icon: "☁️", level: 70, category: "tools" },
  { id: 9, name: "Docker", icon: "🐳", level: 65, category: "tools" },
  { id: 10, name: "Tailwind CSS", icon: "🎨", level: 90, category: "frontend" },
]

export default function Skills({ showAll = true }: { showAll?: boolean }) {
  const displayedSkills = showAll ? skills : skills.slice(0, 6)

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">My Skills</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Technologies and tools I've mastered throughout my journey as a developer
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayedSkills.map((skill) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: skill.id * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <Card className="overflow-hidden h-full border border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-2">{skill.icon}</div>
                <h3 className="font-medium">{skill.name}</h3>
                <div className="w-full bg-muted rounded-full h-2 mt-3">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {!showAll && (
        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/skills">
              View All Skills <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

