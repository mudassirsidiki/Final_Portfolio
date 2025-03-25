import Projects from "@/components/projects"
import { Suspense } from "react"

export const metadata = {
  title: "Projects | Mudassir Ahmed Siddiqui",
  description: "Explore my portfolio of web development and data engineering projects",
}

// This is a server component that can read search params
export default function ProjectsPage({ 
  searchParams 
}: { 
  searchParams: { category?: string } 
}) {
  // Get category from URL query parameter and validate it
  const category = searchParams.category && 
    (searchParams.category === "data-analyst" || searchParams.category === "web-development")
    ? searchParams.category 
    : null;
  
  return (
    <main className="container mx-auto px-4 py-16">
      <Suspense fallback={<div>Loading projects...</div>}>
        <Projects showAll={true} category={category} />
      </Suspense>
    </main>
  )
}