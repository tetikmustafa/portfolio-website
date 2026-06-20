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
    name: "Generative AI Product Photography System",
    description: "End-to-end full-stack Generative AI system, built as a university course term project, running entirely on local GPU hardware to transform raw product photos into professional studio visuals with zero cloud dependency.",
    html_url: null,
    homepage: null,
    topics: ["Stable Diffusion", "ControlNet", "Qwen Image Edit", "ComfyUI", "LoRA", "React", "Vite", "WebSocket", "Prompt Engineering"],
    language: "Python",
    additionalDescriptions: [
      "Integrated four coordinated model components — a quantized FP8 UNET diffusion core, a 7B-parameter vision-language CLIP text encoder, a VAE, and a Lightning LoRA adapter — applying Prompt Engineering to preserve product identity across multiple camera angles.",
      "Designed three distinct camera-angle prompt pipelines (hero shot, three-quarter profile, isometric view) with tailored positive/negative prompting to eliminate studio equipment, human hands, and artifacts from generated output.",
      "Architected a React and Vite frontend utilizing WebSockets for bidirectional, real-time progress  logging.",
    ],
  },
  {
    id: 2,
    name: "Game Analysis with Image Processing",
    description: "Computer Engineering graduation project: an AI analysis system that detects game tiles on a physical rack, classifies them, and mathematically models game rules to recommend optimal moves.",
    html_url: null,
    homepage: null,
    topics: ["YOLOv8", "ResNet-18", "Computer Vision", "Flask", "Next.js", "DFS", "Roboflow"],
    language: "Python",
    additionalDescriptions: [
      "Engineered a custom dataset from scratch — 4,432 tiles labeled across 219 rack photographs via Roboflow for localization, plus a custom keyboard-driven rapid annotation tool to classify tiles into 55 distinct classes for the classification stage.",
      "Implemented a Two-Stage Hybrid Pipeline utilizing YOLOv8-Nano (99.4% mAP50, 41ms inference) for localization and ResNet-18 (97.26% accuracy, 2.88ms inference) for classification, selected after benchmarking against EfficientNet-B0, ViT-B/16, and LightGBM.",
      "Modeled complex combinatorial problems utilizing Depth-First Search (DFS) and Memoization to solve game strategies, executing in under 10ms in-browser.",
      "Architected a Client-Direct structure using an isolated Flask backend, eliminating serverless cold-start latency and achieving a 150-250ms end-to-end real-time response via a Next.js interface.",
      "Built an interactive correction UI allowing users to relabel misclassified tiles in real time, feeding corrected samples back into the dataset as a continuous-improvement loop.",
    ],
  },
  {
    id: 3,
    name: "Order Managing App",
    description: "Fully containerized distributed backend system for managing customers, orders, and products built with Java, Spring Boot, and Spring Cloud.",
    html_url: "https://github.com/tetikmustafa/OrdersAppMicroservices",
    homepage: null,
    topics: ["SpringBoot", "Spring Cloud", "Eureka", "API Gateway", "Microservice", "RESTful API", "OpenFeign", "Docker", "MySQL"],
    language: "Java",
    additionalDescriptions: [
      "Developed a Spring Boot backend for managing customers, orders, and products in a structured web application.",
      "Architected a fully containerized distributed system utilizing Java, Spring Boot, and Spring Cloud.",
      "Designed the system using both monolithic and microservices architectures, leveraging OpenFeign for inter-service communication.",
      "Implemented dynamic service discovery via Eureka Server and centralized routing utilizing an API Gateway.",
      "Built the project as a RESTful API, implementing CRUD operations with proper request validation, error handling, and standardized response structures.",
      "Implemented MVC and DTO patterns for clean architecture and efficient data handling.",
      "Integrated MySQL as the relational database for data storage and management.",
      "Used Docker and Docker Compose for containerization and deployment."
    ],
  },
  {
    id: 4,
    name: "Research Paper: Analysis of Suicide Content in Social Media Posts with Deep Learning Models and Comparison of Models",
    description: "Co-authored research paper (Marmara University, Dept. of Computer Engineering) on detecting suicide-related content in social media posts using deep learning and NLP, with comparative results across two transformer architectures.",
    html_url: null,
    homepage: null,
    topics: ["Deep Learning", "NLP", "T5", "ALBERT", "Transformers"],
    language: "Python",
    additionalDescriptions: [
      "Authored a research paper on detecting suicidal intent in social media posts using deep learning models.",
      "Implemented and compared two unused models in literature, achieving 97% accuracy in both models.",
      "Conducted data preprocessing, feature extraction, and model evaluation to improve classification performance."
    ],
  },
  {
    id: 5,
    name: "Ransomware Simulation & Analysis",
    description: "A fully isolated cybersecurity lab simulating a WannaCry attack to analyze ransomware behavior and defense strategies.",
    html_url: null,
    homepage: "/ransomware.pdf",
    topics: ["WannaCry", "Malware Analysis", "REMnux", "INetSim", "Wireshark", "PeStudio", "Static Analysis", "Dynamic Analysis", "Virtualization"],
    language: "CyberSecurity",
    additionalDescriptions: [
      "Simulated a WannaCry ransomware attack in a fully isolated virtual environment to study infection patterns and defense strategies.",
      "Configured Windows 10 and REMnux virtual machines on a host-only network to ensure total isolation from production systems.",
      "Deployed INetSim to safely emulate internet services, enabling observation of malware's outbound communication attempts.",
      "Monitored system and network activity using Wireshark, tcpdump, Procmon, Process Explorer, and Regshot to capture behavioral indicators.",
      "Performed static analysis with PeStudio to examine malware binaries, structure, and imported libraries.",
      "Analyzed file encryption processes, registry modifications, and lateral movement techniques commonly used by WannaCry.",
    ],
  },
  {
    id: 6,
    name: "Dynamic Logistics Routing & Optimization Modeling",
    description: "Optimization modeling project simulating constraint-based decision support for real-world logistics bottlenecks and dynamic vehicle capacity constraints.",
    html_url: null,
    homepage: null,
    topics: ["MILP", "Pyomo", "Gurobi", "Optimization"],
    language: "Python",
    additionalDescriptions: [
      "Modeled real-world logistics bottlenecks and dynamic vehicle capacity constraints utilizing Mixed Integer Linear Programming (MILP).",
      "Processed large-scale operational datasets and executed algorithmic optimization leveraging Python, Pyomo, and Gurobi solvers to simulate constraint-based decision support.",
    ],
  },
  {
    id: 7,
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
      "Focused on smooth network communication, responsive controls, and an engaging multiplayer experience.",
    ],
  },
  {
    id: 8,
    name: "Assembly Car Game",
    description: "Simple Car Game Coded With Assembly",
    html_url: "https://github.com/tetikmustafa/AssemblyCarGame",
    homepage: null,
    topics: ["Emu8086", "Assembly"],
    language: "Assembly",
    additionalDescriptions: [
      "Programmed a hardware-near logic control simulation utilizing 8086 Assembly and Emu8086, demonstrating computational fundamentals and register-level programming.",
    ],
  },
  {
    id: 9,
    name: "Syllabus Creator App",
    description: "An application that helps you manage your weekly courses.",
    html_url: "https://github.com/tetikmustafa/Syllabus-Creator-App",
    homepage: null,
    topics: ["Javafx"],
    language: "Java",
    additionalDescriptions: [
      "Developed a GUI-based scheduling system utilizing Java and JavaFX featuring multi-user configuration logic.",
      "Easy to use, user friendly interface.",
      "8 Course time slots for 7 days of the week.",
      "Choose your course type.",
      "Different syllabi for different accounts.",
    ],
  },
  {
    id: 10,
    name: "Solar System Model",
    description: "A website for observing a scale model of the solar system.",
    html_url: "https://github.com/tetikmustafa/SolarSystemModel",
    homepage: "https://tetikmustafa.github.io/SolarSystemModel/",
    topics: ["Three.js", "HTML", "CSS"],
    language: "Javascript",
    additionalDescriptions: [
      "Modeled a 3D simulation utilizing JavaScript and Three.js, implementing 3D rendering, interactive camera controls, and animation loop modeling.",
      "Realistic 3D models of all planets in our solar system.",
      "Interactive camera controls for exploring the solar system.",
      "Planet trails showing orbital paths.",
    ],
  },
]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen p-6 pt-20 md:p-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10 fade-up">
          <h1 className="text-4xl md:text-5xl font-bold homepage-name mb-4 pb-1">Projects</h1>
        </div>

        {/* Project List */}
        <div className="space-y-6">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className={`fade-up-delay-${Math.min(idx + 1, 5)}`}
            >
              <div className="project-card group">
                {/* Header: title + links */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    {project.language && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {project.language}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0 mt-1">
                    {project.html_url && (
                      <a
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-icon"
                        aria-label="Source code"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.homepage && (
                      <a
                        href={project.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-icon project-link-primary"
                        aria-label="Live demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {project.description || "No description available"}
                </p>

                {/* Additional details */}
                {project.additionalDescriptions && project.additionalDescriptions.length > 0 && (
                  <ul className="mb-4 space-y-1.5">
                    {project.additionalDescriptions.map((desc, i) => (
                      <li key={i} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary/40 mt-0.5 shrink-0">•</span>
                        {desc}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Topic tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                  {project.topics.map((topic) => (
                    <span key={topic} className="project-tag whitespace-nowrap">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}