import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink } from "lucide-react"

interface Project {
  id: number
  name: string
  description: string | null
  html_url: string | null
  homepage: string | null
  topics: string[]
  language: string | null
  additionalDescriptions?: string[]
}

const projects: Project[] = [
  {
    id: 1,
    name: "Deep Learning Models Research Paper",
    description: "Analysis of Suicide Content in Social Media Posts with Deep Learning Models and Comparison of Models",
    html_url: null,
    homepage: null,
    topics: ["Deep Learning", "NLP", "CNN"],
    language: "Python",
    additionalDescriptions: [
      "Authored a research paper on detecting suicidal intent in social media posts using deep learning models.",
      "Implemented and compared two unused models in literature, achieving 97% accuracy in both models.",
      "Conducted data preprocessing, feature extraction, and model evaluation to improve classification performance."
    ],  
  },
  {
    id: 2,
    name: "Ransomware Simulation & Analysis",
    description: "Simulated a controlled WannaCry ransomware attack in an isolated virtual lab to analyze behavior and test defense mechanisms.",
    html_url: null,
    homepage: "/ransomware.pdf",
    topics: ["WannaCry", "Malware Analysis", "REMnux", "INetSim", "Wireshark", "Static Analysis", "Dynamic Analysis", "Virtualization"],
    language: "CyberSecurity",
    additionalDescriptions: [
      "Simulated a WannaCry ransomware attack in a fully isolated virtual environment to study infection patterns and defense strategies.",
      "Configured Windows 10 and REMnux virtual machines on a host-only network to ensure total isolation from production systems.",
      "Deployed INetSim to safely emulate internet services, enabling observation of malware's outbound communication attempts.",
      "Monitored system and network activity using Wireshark, tcpdump, Procmon, Process Explorer, and Regshot to capture behavioral indicators.",
      "Performed static analysis with PeStudio to examine malware binaries, structure, and imported libraries.",
      "Analyzed file encryption processes, registry modifications, and lateral movement techniques commonly used by WannaCry.",
    ]
  },
  {
    id: 3,
    name: "Order Managing App",
    description: "Backend project for order management application",
    html_url: "https://github.com/tetikmustafa/OrdersAppMicroservices",
    homepage: null,
    topics: ["SpringBoot", "MVC", "Microservice", "RESTful API", "Docker", "MySQL"],
    language: "Java",
    additionalDescriptions: [
      "Developed a Spring Boot backend for managing customers, orders, and products in a structured web application.",
      "Designed the system using both monolithic and microservices architectures, leveraging OpenFeign for inter-service communication.",
      "Built the project as a RESTful API, implementing CRUD operations with proper request validation, error handling, and standardized response structures.",
      "Implemented MVC and DTO patterns for clean architecture and efficient data handling.",
      "Integrated MySQL as the relational database for data storage and management.",
      "Used Docker and Docker Compose for containerization and deployment."
    ],
  },
  {
    id: 4,
    name: "Multiplayer Pacman Game",
    description: "A Pacman themed multiplayer game made with unity.",
    html_url: "https://github.com/tetikmustafa/MultiplayerPacmanGame",
    homepage: null,
    topics: ["C#", "Photon"],
    language: "Unity",
    additionalDescriptions: [
      "Developed a multiplayer version of the classic Pac-Man game using C# and Unity.",
      "Implemented real-time player-controlled ghosts with Photon for networking and multiplayer synchronization.",
      "Designed game mechanics to maintain the original Pac-Man experience while enhancing interactivity.",
      "Focused on smooth network communication, responsive controls, and an engaging multiplayer experience."
    ],
  },
  {
    id: 5,
    name: "Assembly Car Game",
    description: "Simple Car Game Coded With Assembly",
    html_url: "https://github.com/tetikmustafa/AssemblyCarGame",
    homepage: null,
    topics: ["Emu8086"],
    language: "Assembly",
    additionalDescriptions: [
      "A simple car game made with assembly codes. Used emu8086 version 4.05. 8086 microprocessor emulator."
    ],
  },
  {
    id: 6,  
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
  },
  {
    id: 7,
    name: "Solar System Model",
    description: "A website for observing a scale model of the solar system ",
    html_url: "https://github.com/tetikmustafa/SolarSystemModel",
    homepage: "https://tetikmustafa.github.io/SolarSystemModel/",
    topics: ["Three.js", "HTML", "CSS"],
    language: "Javascript",
    additionalDescriptions: [
      "Realistic 3D models of all planets in our solar system.",
      "Interactive camera controls for exploring the solar system.",
      "Planet trails showing orbital paths.",
    ],
  },
]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 fade-up">Projects</h1>

        <div className="mb-8 fade-up-delay-1">
          <p className="text-lg text-muted-foreground">
            Here are some of my recent projects.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1">
          {projects.map((project) => (
            <div key={project.id} className="fade-up-delay-2">
              <Card className="h-full transition-shadow duration-300">
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
                        {project.additionalDescriptions.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {project.html_url && (
                      <a
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <Github className="h-4 w-4" />
                        Code
                      </a>
                    )}

                    {project.homepage && (
                      <a
                        href={project.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Demo
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
