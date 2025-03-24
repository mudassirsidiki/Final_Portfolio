import Skills from "@/components/skills"

export const metadata = {
  title: "Skills | Mudassir Ahmed Siddiqui",
  description: "Explore my technical skills and expertise in web development and data engineering",
}

export default function SkillsPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <Skills showAll={true} />
    </main>
  )
}

