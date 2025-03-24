"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Define the project interface with category property
interface Project {
  id: number
  title: string
  description: string
  images: string[]
  tags: string[]
  githubUrl: string
  category: string
  subcategory: string
}

// Projects data restructured with just two main categories
const allProjects: Project[] = [
  // DATA ANALYST PROJECTS (12 total - 9 Power BI, 3 SQL)
  
  // Power BI Projects (9)
  {
    id: 1,
    title: "Sales Performance Dashboard",
    description: "Interactive dashboard analyzing sales performance across regions and product categories.",
    images: ["/images/PBI-1.1.png", "/images/PBI-1.2.png"],
    tags: ["Power BI", "DAX", "Data Modeling", "Visualizations"],
    githubUrl: "https://github.com/yourusername/sales-dashboard",
    category: "data-analyst",
    subcategory: "power-bi"
  },
  {
    id: 2,
    title: "Financial Analysis Report",
    description: "Comprehensive financial analysis with forecast models and budget comparisons.",
    images: ["/images/PBI-2.1.png", "/images/PBI-2.2.png"],
    tags: ["Power BI", "Financial Modeling", "What-if Analysis"],
    githubUrl: "https://github.com/yourusername/financial-analysis",
    category: "data-analyst",
    subcategory: "power-bi"
  },
  {
    id: 3,
    title: "HR Analytics Dashboard",
    description: "Employee performance metrics and workforce analytics visualization.",
    images: ["/images/PBI-3.1.png", "/images/PBI-3.2.png"],
    tags: ["Power BI", "HR Analytics", "DAX", "KPIs"],
    githubUrl: "https://github.com/yourusername/hr-analytics",
    category: "data-analyst",
    subcategory: "power-bi"
  },
  {
    id: 4,
    title: "Supply Chain Monitoring",
    description: "Real-time monitoring of supply chain metrics and inventory management.",
    images: ["/images/PBI-4.1.png", "/images/PBI-4.2.png"],
    tags: ["Power BI", "Supply Chain", "Inventory Analytics"],
    githubUrl: "https://github.com/yourusername/supply-chain",
    category: "data-analyst",
    subcategory: "power-bi"
  },
  {
    id: 5,
    title: "Marketing Campaign Analysis",
    description: "Performance tracking for marketing campaigns across multiple channels.",
    images: ["/images/PBI-5.1.png", "/images/PBI-5.1.png"],
    tags: ["Power BI", "Marketing Analytics", "ROI Analysis"],
    githubUrl: "https://github.com/yourusername/marketing-analysis",
    category: "data-analyst",
    subcategory: "power-bi"
  },
  {
    id: 6,
    title: "Customer Segmentation",
    description: "Customer behavior analysis and segmentation based on purchase history.",
    images: ["/images/PBI-6.1.png"],
    tags: ["Power BI", "Customer Analytics", "Segmentation", "RFM Analysis"],
    githubUrl: "https://github.com/yourusername/customer-segments",
    category: "data-analyst",
    subcategory: "power-bi"
  },
  {
    id: 7,
    title: "Healthcare Metrics Dashboard",
    description: "Key healthcare performance indicators and patient outcomes visualization.",
    images: ["/images/PBI-7.1.png"],
    tags: ["Power BI", "Healthcare Analytics", "Patient Metrics"],
    githubUrl: "https://github.com/yourusername/healthcare-metrics",
    category: "data-analyst",
    subcategory: "power-bi"
  },
  {
    id: 8,
    title: "Retail Store Performance",
    description: "Store-by-store performance comparison with product category breakdowns.",
    images: ["/images/PBI-8.1.png"],
    tags: ["Power BI", "Retail Analytics", "Store Comparison"],
    githubUrl: "https://github.com/yourusername/retail-performance",
    category: "data-analyst",
    subcategory: "power-bi"
  },
  {
    id: 9,
    title: "Financial Budget Tracker",
    description: "Budget vs. actual spending tracker with variance analysis and forecasting.",
    images: ["/images/PBI-9.1.jpg"],
    tags: ["Power BI", "Budget Analysis", "Financial Planning"],
    githubUrl: "https://github.com/yourusername/budget-tracker",
    category: "data-analyst",
    subcategory: "power-bi"
  },
  
  // SQL Projects (3)
  {
    id: 10,
    title: "Sales Data Analysis",
    description: "SQL-based analysis of sales patterns and customer purchase behavior.",
    images: ["/images/SQL-1.1.png", "/images/SQL-1.2.png"],
    tags: ["SQL", "Data Analysis", "Sales Analytics"],
    githubUrl: "https://github.com/yourusername/sql-sales-analysis",
    category: "data-analyst",
    subcategory: "sql"
  },
  {
    id: 11,
    title: "Customer Churn Analysis",
    description: "SQL queries to identify patterns in customer churn and retention.",
    images: ["/images/SQL-2.1.png", "/images/SQL-2.2.png"],
    tags: ["SQL", "Churn Analysis", "Customer Analytics"],
    githubUrl: "https://github.com/yourusername/sql-churn-analysis",
    category: "data-analyst",
    subcategory: "sql"
  },
  {
    id: 12,
    title: "Inventory Management System",
    description: "SQL database design and queries for inventory management and tracking.",
    images: ["/images/SQL-3.1.png", "/images/SQL-3.2.png"],
    tags: ["SQL", "Database Design", "Inventory Control"],
    githubUrl: "https://github.com/yourusername/sql-inventory-system",
    category: "data-analyst",
    subcategory: "sql"
  },
  
  // WEB DEVELOPMENT PROJECTS (12 total - 3 HTML/CSS/JS, 3 Tailwind, 3 React, 3 Next.js)
  
  // HTML/CSS/JavaScript Projects (3)
  {
    id: 13,
    title: "Portfolio Website Purple",
    description: "Responsive website for a restaurant with menu and reservation features.",
    images: ["/images/next_p1_1.png", "/images/next_p1_2.png"],
    tags: ["NEXT.JS", "TAILWIND CSS", "JavaScript", "Responsive Design"],
    githubUrl: "https://github.com/yourusername/restaurant-website",
    category: "web-development",
    subcategory: "nextjs"
  },
  {
    id: 14,
    title: "Portfolio Website Red",
    description: "Clean and professional portfolio template for developers.",
    images: ["/images/next_p2_1.png", "/images/next_p2_2.png"],
    tags: ["NEXT.JS", "TAILWIND CSS", "JavaScript", "Responsive Design"],
    githubUrl: "https://github.com/yourusername/portfolio-template",
    category: "web-development",
    subcategory: "nextjs"
  },
  
  // Tailwind CSS Projects (3)
  {
    id: 16,
    title: "Microsoft Website",
    description: "Modern landing page for a SaaS product using Tailwind CSS.",
    images: ["/images/TWCSS-1.1.png", "/images/TWCSS-1.2.png"],
    tags: ["VITE", "Tailwind CSS", "Responsive Design", "Animation"],
    githubUrl: "https://github.com/yourusername/saas-landing",
    category: "web-development",
    subcategory: "tailwind"
  },
  {
    id: 17,
    title: "Foody Zone Website",
    description: "Clean and modern admin dashboard interface built with Tailwind CSS.",
    images: ["/images/TWCSS-2.1.png", "/images/TWCSS-2.2.png" ],
    tags: ["VITE", "Tailwind CSS", "UI Design", "Dashboard"],
    githubUrl: "https://github.com/yourusername/admin-dashboard",
    category: "web-development",
    subcategory: "tailwind"
  },
  {
    id: 18,
    title: "Contact Page",
    description: "Complete e-commerce UI components built with Tailwind CSS.",
    images: ["/images/TWCSS-3.1.png", "/images/TWCSS-3.2.png" ],
    tags: ["Tailwind CSS", "VITE", "UI Components"],
    githubUrl: "https://github.com/yourusername/ecommerce-ui-kit",
    category: "web-development",
    subcategory: "tailwind"
  },
  
  // React Projects (3)
  {
    id: 19,
    title: "Netflix Landing Page",  
    description: "Feature-rich task management application built with React.",
    images: ["/images/REACT-5.1.png", "/images/REACT-5.2.png" ],
    tags: ["React JS", "Tailwind CSS", "frontend"],
    githubUrl: "https://github.com/yourusername/task-management-app",
    category: "web-development",
    subcategory: "react"
  },
  {
    id: 20,
    title: "Binance NFT Website",
    description: "Social media analytics dashboard built with React and Chart.js.",
    images: ["/images/REACT-4.1.png", "/images/REACT-4.2.png" ],
    tags: ["React JS", "Tailwind CSS", "frontend"],
    githubUrl: "https://github.com/yourusername/social-dashboard",
    category: "web-development",
    subcategory: "react"
  },
  {
    id: 21,
    title: "Nike Landing Page",
    description: "Full-featured e-commerce store with shopping cart and checkout.",
    images: ["/images/REACT-1.1.png", "/images/REACT-1.2.png" ],
    tags: ["VITE", "React", "Tailwind CSS", "frontend"],
    githubUrl: "https://github.com/yourusername/react-ecommerce",
    category: "web-development",
    subcategory: "react"
  },
  
  // Next.js Projects (3)
  {
    id: 22,
    title: "Netflix Landing Page",
    description: "Modern real estate listing platform with property search and filtering.",
    images: ["/images/plain_1.1.png", "/images/plain_1.2.png"],
    tags: ["HTML", "CSS", "Javascript", "frontend", "responsive"],
    githubUrl: "https://github.com/yourusername/real-estate-platform",
    category: "web-development",
    subcategory: "html-css-js"
  },
  {
    id: 23,
    title: "Spotify Landing Page",
    description: "SEO-optimized blog platform with markdown support and content management.",
    images: ["/images/plain_2.1.png", "/images/plain_2.2.png"],
    tags: ["HTML", "CSS", "Javascript", "frontend", "responsive"],
    githubUrl: "https://github.com/yourusername/blog-platform",
    category: "web-development",
    subcategory: "html-css-js"
  },
  {
    id: 24,
    title: "Twitter Landing Page",
    description: "Full-stack job posting and application platform with user authentication.",
    images: ["/images/plain_3.1.png", "/images/plain_3.2.png"],
    tags: ["HTML", "CSS", "Javascript", "frontend", "responsive"],
    githubUrl: "https://github.com/yourusername/job-board",
    category: "web-development",
    subcategory: "html-css-js"
  }
];

// Define category information with proper display names
type CategoryKey = "data-analyst" | "web-development";

const categoryInfo: Record<CategoryKey, { name: string; description: string }> = {
  "data-analyst": {
    name: "Data Analyst",
    description: "Projects showcasing data analysis, visualization, and insights using Power BI and SQL"
  },
  "web-development": {
    name: "Web Development",
    description: "Web applications built with various technologies including HTML/CSS, Tailwind CSS, React, and Next.js"
  }
};

// Get all unique categories
const categories: CategoryKey[] = Object.keys(categoryInfo) as CategoryKey[];

export default function Projects({ 
  showAll = true, 
  category = null,
  limit = 3,
  featuredOnly = false
}: { 
  showAll?: boolean, 
  category?: CategoryKey | null,
  limit?: number,
  featuredOnly?: boolean
}) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [currentImageIndices, setCurrentImageIndices] = useState<{ [key: number]: number }>({});
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(category as CategoryKey | null);

  // Helper function to get featured projects (one from each category)
  const getFeaturedProjects = () => {
    return categories.map(cat => 
      allProjects.find(project => project.category === cat)
    ).filter(Boolean) as Project[];
  };

  // Filter projects based on category if provided
  let filteredProjects = activeCategory 
    ? allProjects.filter(project => project.category === activeCategory)
    : featuredOnly 
      ? getFeaturedProjects() 
      : allProjects;

  // Then limit if showAll is false
  const displayedProjects = showAll 
    ? filteredProjects 
    : filteredProjects.slice(0, limit);

  // Initialize image indices and set up automatic image rotation
  useEffect(() => {
    // Initialize the current image index for each project
    const initialIndices: { [key: number]: number } = {};
    allProjects.forEach(project => {
      initialIndices[project.id] = 0;
    });
    setCurrentImageIndices(initialIndices);

    // Set up interval for image rotation
    const interval = setInterval(() => {
      setCurrentImageIndices(prevIndices => {
        const newIndices = { ...prevIndices };
        allProjects.forEach(project => {
          if (project.images && project.images.length > 0) {
            newIndices[project.id] = (prevIndices[project.id] + 1) % project.images.length;
          }
        });
        return newIndices;
      });
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle category change (client-side)
  const handleCategoryChange = (newCategory: string | null) => {
    setActiveCategory(newCategory as CategoryKey | null);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">My Projects</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore my recent work showcasing my skills in data analysis and web development
        </p>
      </div>

      {/* Categories filter - only show when showAll is true */}
      {showAll && (
        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <Button 
              variant={activeCategory === null ? "default" : "outline"}
              onClick={() => handleCategoryChange(null)}
              className="mb-2"
            >
              All Projects
            </Button>
            
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => handleCategoryChange(cat)}
                className="mb-2"
              >
                {categoryInfo[cat].name}
              </Button>
            ))}
          </div>

          {/* Show category description for selected category */}
          {activeCategory && (
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold">{categoryInfo[activeCategory].name}</h3>
              <p className="text-muted-foreground mt-1">{categoryInfo[activeCategory].description}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="h-full"
          >
            <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg border border-primary/10 bg-card/50 backdrop-blur-sm">
              <div className="relative h-64 overflow-hidden bg-black/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${project.id}-${currentImageIndices[project.id] || 0}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={project.images[currentImageIndices[project.id] || 0]}
                      alt={`${project.title} image ${currentImageIndices[project.id] + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      quality={100}
                      priority={project.id <= 3}
                      className="object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{project.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {!showAll && (
        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/projects">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {showAll && displayedProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found in this category.</p>
          <Button className="mt-4" onClick={() => handleCategoryChange(null)}>
            View All Projects
          </Button>
        </div>
      )}
    </div>
  )
}