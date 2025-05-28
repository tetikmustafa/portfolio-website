"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Github, ExternalLink, Search, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  topics: string[]
  language: string | null
  created_at: string
  updated_at: string
  additionalDescriptions?: string[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("updated")
  const [filterBy, setFilterBy] = useState("all")
  const { toast } = useToast()

  const data: Project[] = [
    {
      id: 1,
      name: "Deep Learning Models Research Paper",
      description: "Analysis of Suicide Content in Social Media Posts with Deep Learning Models and Comparison of Models",
      html_url: "",
      homepage: "",
      topics: ["Deep Learning", "NLP", "CNN"],
      language: "Python",
      additionalDescriptions: [
        "Authored a research paper on detecting suicidal intent in social media posts using deep learning models.",
        "Implemented and compared two unused models in literature, achieving 97% accuracy in both models.",
        "Conducted data preprocessing, feature extraction, and model evaluation to improve classification performance."
      ],
      created_at: "2023-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      name: "Order Managing App",
      description: "Backend project for order management application",
      html_url: "https://github.com/tetikmustafa/OrdersAppMicroservices",
      homepage: "",
      topics: ["SpringBoot", "MVC", "Microservice", "RESTful API","Docker","MySQL"],
      language: "Java",
      additionalDescriptions: [
        "Developed a Spring Boot backend for managing customers, orders, and products in a structured web application.",
        "Designed the system using both monolithic and microservices architectures, leveraging OpenFeign for inter-service communication.",
        "Built the project as a RESTful API, implementing CRUD operations with proper request validation, error handling, and standardized response structures.",
        "Implemented MVC and DTO patterns for clean architecture and efficient data handling.",
        "Integrated MySQL as the relational database for data storage and management.",
        "Used Docker and Docker Compose for containerization and deployment."
      ],
      created_at: "2023-03-20T10:00:00Z",
      updated_at: "2023-12-10T10:00:00Z",
    },
    {
      id: 3,
      name: "Multiplayer Pacman Game",
      description: "A Pacman themed multiplayer game made with unity.",
      html_url: "https://github.com/tetikmustafa/MultiplayerPacmanGame",
      homepage: "",
      topics: ["C#", "Photon"],
      language: "Unity",
      additionalDescriptions: [
        "Developed a multiplayer version of the classic Pac-Man game using C# and Unity.",
        "Implemented real-time player-controlled ghosts with Photon for networking and multiplayer synchronization.",
        "Designed game mechanics to maintain the original Pac-Man experience while enhancing interactivity.",
        "Focused on smooth network communication, responsive controls, and an engaging multiplayer experience."
      ],
      created_at: "2023-06-10T10:00:00Z",
      updated_at: "2023-11-20T10:00:00Z",
    },
    {
      id: 4,
      name: "Assembly Car Game",
      description: "Simple Car Game Coded With Assembly",
      html_url: "https://github.com/tetikmustafa/AssemblyCarGame",
      homepage: null,
      topics: ["Emu8086"],
      language: "Assembly",
      additionalDescriptions: [
        "A simple car game made with assembly codes. Used emu8086 version 4.05. 8086 microprocessor emulator."
      ],
      created_at: "2023-08-05T10:00:00Z",
      updated_at: "2024-01-05T10:00:00Z",
    },
    {
      id: 5,
      name: "Syllabus Creator App",
      description: "An application that helps you manage your weekly courses.",
      html_url: "https://github.com/tetikmustafa/Syllabus-Creator-App",
      homepage: null,
      topics: ["Javafx"],
      language: "Java",
      additionalDescriptions: [
        "Easy to use, user friendly interface.",
        "8 Course time for 7 days of the week.",
        "Choose your course type.",
        "Different Syllabus' for different accounts."
      ],
      created_at: "2023-08-05T10:00:00Z",
      updated_at: "2024-01-05T10:00:00Z",
    },
    {
      id: 6,
      name: "Solar System Model",
      description: "A website for observing a scale model of the solar system ",
      html_url: "https://github.com/tetikmustafa/SolarSystemModel",
      homepage: "https://tetikmustafa.github.io/SolarSystemModel/",
      topics: ["Three.js","HTML","CSS"],
      language: "Javascript",
      additionalDescriptions: [
        "Realistic 3D models of all planets in our solar system.",
        "Interactive camera controls for exploring the solar system.",
        "Planet trails showing orbital paths.",
      ],
      created_at: "2023-08-05T10:00:00Z",
      updated_at: "2024-01-05T10:00:00Z",
    },
  ]

  useEffect(() => {
    // Simulate API call
    const fetchProjects = async () => {
      setLoading(true)
      try {
        // fetch from GitHub API:
        // const response = await fetch('https://api.github.com/users/tetikmustafa/repos')
        // const data = await response.json()

        // Simulate loading delay
        // await new Promise((resolve) => setTimeout(resolve, 1500))

        setProjects(data)
        setFilteredProjects(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch projects from GitHub",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [toast])

  // useEffect(() => {
  //   let filtered = projects.filter(
  //     (project) =>
  //       project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())),
  //   )

  //   if (filterBy !== "all") {
  //     filtered = filtered.filter((project) => project.language?.toLowerCase() === filterBy.toLowerCase())
  //   }

  //   // Sort projects
  //   filtered.sort((a, b) => {
  //     switch (sortBy) {
  //       case "name":
  //         return a.name.localeCompare(b.name)
  //       case "stars":
  //         return b.stargazers_count - a.stargazers_count
  //       case "created":
  //         return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  //       case "updated":
  //       default:
  //         return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  //     }
  //   })

  //   setFilteredProjects(filtered)
  // }, [projects, searchTerm, sortBy, filterBy])

  // const languages = Array.from(new Set(projects.map((p) => p.language).filter(Boolean)))

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">Projects</h1>

          <div className="mb-8 space-y-4">
            <p className="text-lg text-muted-foreground">
              Here are some of my recent projects.
            </p>

            {/* Filters and Search */}
            {/* <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Last Updated</SelectItem>
                  <SelectItem value="created">Date Created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="stars">Stars</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang!.toLowerCase()}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6 grid-cols-1">
            {loading
              ? // Loading skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="h-64">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-14" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="break-words">{project.name}</span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground break-words">
                          {project.description || "No description available"}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.language && <Badge variant="secondary">{project.language}</Badge>}
                          {project.topics.map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>

                        {project.additionalDescriptions && project.additionalDescriptions.length > 0 && (
                          <div className="mb-4">
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {project.additionalDescriptions.map((desc: string, i: number) => (
                                <li key={i}>{desc}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex gap-2">

                          {project.html_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={project.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <Github className="h-4 w-4" />
                                Code
                              </a>
                            </Button>
                          )}
                          

                          {project.homepage && (
                            <Button size="sm" asChild>
                              <a
                                href={project.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Demo
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </div>

          {!loading && filteredProjects.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
