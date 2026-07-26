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
    name: "AI-Powered ATS Resume Tailoring Platform",
    description: "Architected a full-stack AI resume tailoring platform automating job-specific resume customization end-to-end.",
    html_url: null,
    homepage: "/tools/cv-builder",
    topics: ["Next.js 15", "TypeScript", "Cloudflare Workers", "OpenNext", "AI", "LLM", "unpdf", "Mammoth", "Turnstile", "Upstash Redis"],
    language: "TypeScript",
    additionalDescriptions: [
      "Architected a full-stack AI resume tailoring platform using Next.js 15, TypeScript, and Cloudflare Workers (OpenNext), automating job-specific resume customization end-to-end.",
      "Engineered a multi-provider LLM abstraction layer spanning 5 AI providers (Gemini, OpenAI, Claude, DeepSeek, OpenRouter) with a config-driven fallback chain ensuring zero-downtime failover.",
      "Designed a deterministic compile-verify-retry pipeline measuring real compiled PDF line density against a 54-line capacity model to guarantee exact one-page ATS output.",
      "Built an AI-driven CV format converter ingesting LaTeX, PDF, and DOCX resumes via unpdf and Mammoth, remapping any input into a structured template with zero data fabrication.",
      "Secured public-facing API routes with Cloudflare Turnstile verification and Upstash Redis rate limiting, preventing abuse across serverless compile and inference endpoints.",
    ],
  },
  {
    id: 2,
    name: "Generative AI Virtual Photography System",
    description: "End-to-end full-stack Generative AI system to transform raw product photos into professional studio visuals with zero cloud dependency.",
    html_url: null,
    homepage: null,
    topics: ["Stable Diffusion", "ControlNet", "Qwen Image Edit", "ComfyUI", "LoRA", "React", "WebSocket", "Prompt Engineering"],
    language: "Python",
    additionalDescriptions: [
      "Engineered a full-stack Generative AI virtual photography system utilizing Stable Diffusion, ControlNet, and Qwen Image Edit (Qwen 2.5 VL) to transform raw product photos into studio-grade visuals.",
      "Orchestrated a 4-component pipeline (FP8 UNET, 7B-parameter CLIP, VAE, Lightning LoRA), quantizing weights to cut memory footprint by 4x and enable local execution on 6GB-VRAM consumer GPUs.",
      "Designed automated AI workflows using ComfyUI and AuraFlow/Euler schedules, reducing diffusion sampling from 20+ to 4 steps and achieving a 5-8x inference speedup without quality loss.",
      "Applied advanced Prompt Engineering across 3 distinct camera-angle pipelines, formulating rigorous positive/negative prompt strategies to eliminate artifacts and strictly preserve product identity.",
      "Architected a React frontend utilizing WebSockets for logging 12-step generation cycle.",
    ],
  },
  {
    id: 3,
    name: "Game Analysis with Image Processing",
    description: "Computer Vision system that detects physical game tiles and mathematically models game rules to recommend optimal moves.",
    html_url: null,
    homepage: null,
    topics: ["YOLOv8", "ResNet-18", "Computer Vision", "Flask", "Next.js", "DFS", "Roboflow"],
    language: "Python",
    additionalDescriptions: [
      "Architected an end-to-end Computer Vision system to detect physical game tiles and recommend optimal moves, utilizing a Client-Direct architecture with Next.js and an isolated Flask API to bypass serverless cold starts.",
      "Implemented a Two-Stage Hybrid AI pipeline utilizing YOLOv8-Nano for localization (99.4% mAP50, 41ms) and ResNet-18 for classification (97.26% accuracy, 2.88ms).",
      "Formulated complex combinatorial game rules utilizing Depth-First Search (DFS) and Memoization (Hash Caching), calculating optimal 101-point and pair-opening strategies in under 10 milliseconds in-browser.",
      "Engineered a custom dataset of 4,432 labeled tiles across 55 classes, developing a hybrid annotation pipeline via OpenCV and Python scripts that accelerated manual labeling from 50+ hours to approximately 1 hour.",
      "Built an interactive React frontend allowing real-time manual correction of misclassified tiles, triggering instantaneous algorithm recalculations and achieving an end-to-end system latency of 150-250ms.",
    ],
  },
  {
    id: 4,
    name: "Order Management System",
    description: "Architected a scalable backend system transitioning from monolithic to microservices architecture.",
    html_url: "https://github.com/tetikmustafa/OrdersAppMicroservices",
    homepage: null,
    topics: ["Java 21", "SpringBoot 3.3", "Spring Cloud", "Eureka", "API Gateway", "Microservice", "RESTful API", "OpenFeign", "Docker", "MySQL"],
    language: "Java",
    additionalDescriptions: [
      "Architected a scalable backend system transitioning from monolithic to microservices architecture utilizing Java 21, Spring Boot 3.3, and Spring Cloud, decomposing business logic into 4 RESTful services.",
      "Designed RESTful APIs following MVC architecture to perform CRUD operations, implementing strict request validation, global error handling, and standardized JSON response structures.",
      "Implemented Spring Cloud Gateway as the centralized entry point, configuring global CORS management, load-balanced routing, and aggregating independent endpoints into a unified OpenAPI documentation portal.",
      "Configured a Netflix Eureka Server for dynamic service discovery and registration, enabling seamless, decoupled synchronous inter-service communication via OpenFeign clients.",
      "Applied the Database-per-service pattern utilizing MySQL 8 for isolated data storage. Used Spring Data JPA, Hibernate, and Lombok to model entities, strictly enforcing the DTO pattern.",
      "Containerized the infrastructure into a 5-container deployment utilizing Docker and Docker Compose. Engineered custom network bridges and automated health-checks to ensure fail-safe background deployments."
    ],
  },
  {
    id: 5,
    name: "Research Paper: Social Media Suicide Risk Detection via Deep Learning",
    description: "Co-authored an NLP research paper benchmarking Transformer architectures to detect suicide-related content.",
    html_url: null,
    homepage: null,
    topics: ["Deep Learning", "NLP", "T5", "ALBERT", "Transformers", "NLTK"],
    language: "Python",
    additionalDescriptions: [
      "Co-authored an NLP research paper benchmarking Transformer architectures to detect suicide-related content, achieving state-of-the-art results for early psychological intervention systems.",
      "Engineered a perfectly balanced dataset by merging two public Reddit repositories into 246,228 labeled posts, utilizing NLTK for comprehensive text normalization (tokenization, stopword/URL removal).",
      "Fine-tuned and benchmarked T5-small (60M parameters) and ALBERT (12M parameters) transformer models utilizing a 70/30 train-test split, batch size of 32, and a 2e-5 learning rate.",
      "Achieved a peak classification accuracy of 97.27% with ALBERT, outperforming T5-small (97.00%) and significantly exceeding traditional baseline models (CNN, LSTM, BiGRU) reported in literature.",
      "Demonstrated architectural efficiency by proving that ALBERT's parameter-sharing design achieved superior accuracy while utilizing an 80% smaller memory footprint than T5-small."
    ],
  },
  {
    id: 6,
    name: "Ransomware Simulation & Analysis",
    description: "Architected a fully isolated malware sandbox to safely detonate and analyze the WannaCry ransomware.",
    html_url: null,
    homepage: "/ransomware.pdf",
    topics: ["WannaCry", "Malware Analysis", "REMnux", "INetSim", "Wireshark", "PeStudio", "Static Analysis", "Dynamic Analysis", "Virtualization"],
    language: "CyberSecurity",
    additionalDescriptions: [
      "Architected a fully isolated malware sandbox via VirtualBox (Host-Only network), utilizing Windows 10 and REMnux v7 VMs to safely detonate the WannaCry ransomware (MS17-010).",
      "Configured INetSim to emulate DNS and HTTP(S) services to bypass sandbox evasion tactics, capturing live network packets and lateral movement attempts utilizing Wireshark and tcpdump.",
      "Performed static binary analysis utilizing PEStudio and Sysinternals Strings, extracting SHA-256 hashes (67/71 detection rate) and identifying embedded cryptographic APIs (AES/RSA).",
      "Executed dynamic host forensics utilizing Procmon, Process Explorer, and Regshot to trace hierarchical process injection and system-file spoofing (diskpart.exe).",
      "Mapped the complete attack lifecycle by analyzing .WNCRY file encryption behaviors and specific registry modifications used to establish system persistence.",
    ],
  },
  {
    id: 7,
    name: "Personal Portfolio Web Application",
    description: "Architected a responsive web application utilizing Next.js 15, React 19, and TypeScript.",
    html_url: null,
    homepage: "https://mustafatetik.com",
    topics: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Shadcn UI", "SSG"],
    language: "TypeScript",
    additionalDescriptions: [
      "Architected a responsive web application utilizing the Next.js 15 App Router, React 19, and TypeScript, configuring strict Static Site Generation (SSG) protocols for zero-dependency cloud-edge deployments.",
      "Engineered a custom dark/light theme toggle mechanism via inline script injection, completely preventing Flash of Unstyled Content (FOUC) and hydration mismatches during client-side rendering.",
      "Designed a modern UI/UX with Tailwind CSS and reusable Shadcn UI components, leveraging GPU-accelerated pure CSS keyframes to ensure 60fps rendering for complex micro-interactions.",
      "Structured type-safe data models to dynamically map 10+ diverse engineering projects and interactive timelines into a responsive grid layout.",
      "Implemented technical SEO best practices (Next.js Metadata API, OpenGraph) and semantic a11y standards, managing continuous deployment workflows via Git and GitHub.",
    ],
  },
  {
    id: 8,
    name: "Dynamic Logistics Routing & Optimization Modeling",
    description: "Optimization modeling project resolving dynamic vehicle capacity constraints and complex logistics bottlenecks.",
    html_url: null,
    homepage: null,
    topics: ["MILP", "Pyomo", "Gurobi", "Optimization"],
    language: "Python",
    additionalDescriptions: [
      "Formulated MILP models to resolve dynamic vehicle capacity constraints and complex logistics bottlenecks.",
      "Processed 3000+ rows of operational datasets utilizing Python and Pyomo, deploying Gurobi solvers.",
      "Optimized fleet utilization and route planning algorithms, significantly reducing simulated computation times.",
    ],
  },
  {
    id: 9,
    name: "Multiplayer Pacman Game",
    description: "A Pacman themed multiplayer game made with Unity and Photon Networking.",
    html_url: "https://github.com/tetikmustafa/MultiplayerPacmanGame",
    homepage: null,
    topics: ["C#", "Photon", "RPC", "Unity"],
    language: "Unity",
    additionalDescriptions: [
      "Developed an event-driven, 5-player multiplayer arcade game utilizing Unity and C#.",
      "Implemented Photon Unity Networking (PUN) to orchestrate client-server state synchronization, utilizing RPCs (Remote Procedure Calls) for precise player movement tracking.",
    ],
  },
  {
    id: 10,
    name: "Assembly Car Game (Low-Level Programming)",
    description: "Simple Car Game Coded With 8086 Assembly",
    html_url: "https://github.com/tetikmustafa/AssemblyCarGame",
    homepage: null,
    topics: ["Emu8086", "Assembly", "BIOS Interrupts", "VGA Graphics"],
    language: "Assembly",
    additionalDescriptions: [
      "Engineered a logic control simulation utilizing 8086 Assembly, executed on the Emu8086 emulator.",
      "Manipulated BIOS interrupts and managed register-level memory for direct VGA graphics rendering.",
    ],
  },
  {
    id: 11,
    name: "Solar System 3D Web Model",
    description: "An interactive 3D simulation of the Solar System utilizing WebGL and Three.js.",
    html_url: "https://github.com/tetikmustafa/SolarSystemModel",
    homepage: "https://tetikmustafa.github.io/SolarSystemModel/",
    topics: ["Three.js", "WebGL", "HTML", "JavaScript"],
    language: "Javascript",
    additionalDescriptions: [
      "Architected an interactive 3D simulation of the Solar System utilizing JavaScript, WebGL, and Three.js.",
      "Implemented complex orbital mechanics to accurately model planetary motion.",
    ],
  },
  {
    id: 12,
    name: "DNS & Mail Server Administration",
    description: "Deployed secure network services on a Linux server environment with full mail security.",
    html_url: null,
    homepage: null,
    topics: ["Linux", "DNS", "SPF", "DKIM", "DMARC", "System Admin"],
    language: "Linux",
    additionalDescriptions: [
      "Deployed secure network services on a Linux server environment, configuring firewall and routing rules.",
      "Managed DNS infrastructure by establishing precise zone files and routing records (A, MX, CNAME, TXT).",
      "Configured a mail server ecosystem, implementing SPF, DKIM, and DMARC authentication protocols.",
    ],
  },
  {
    id: 13,
    name: "Syllabus Creator App",
    description: "A robust desktop scheduling application utilizing Java and JavaFX.",
    html_url: "https://github.com/tetikmustafa/Syllabus-Creator-App",
    homepage: null,
    topics: ["Javafx", "OOP", "MVC"],
    language: "Java",
    additionalDescriptions: [
      "Engineered a robust desktop scheduling application utilizing Java and JavaFX, enforcing strict Object-Oriented Programming (OOP) principles and the MVC design pattern.",
      "Implemented a custom algorithm to prevent overlapping courses across multi-user configuration profiles.",
      "Designed an intuitive GUI featuring dynamic data binding and robust local data persistence methodologies.",
    ],
  },
  {
    id: 14,
    name: "Research Paper: Healthcare Sentiment Analysis via Advanced NLP",
    description: "Co-authored an NLP research paper published in 'Yapay Zekâ Tabanlı Sistemler' utilizing NHS and RateMDs APIs.",
    html_url: null,
    homepage: null,
    topics: ["NLP", "Machine Learning", "Deep Learning", "Transformers", "RoBERTa", "Imbalanced Data"],
    language: "Python",
    additionalDescriptions: [
      "Co-authored an NLP research paper published in 'Yapay Zekâ Tabanlı Sistemler: Teori, Uygulama ve Gelecek Perspektifleri-2' (BİDGE Yayınları), processing 12,600+ patient reviews via NHS and RateMDs APIs.",
      "Mitigated model bias and resolved imbalanced data challenges by implementing rigorous undersampling techniques to generate a perfectly balanced training corpus.",
      "Architected a comprehensive benchmark comparing Machine Learning (SVM, XGBoost, CatBoost), Deep Learning (1D CNN, textRNN, textGCN), and Transformer LLMs (RoBERTa, DistilBERT).",
      "Evaluated architectural scalability across dynamic train-test splits (70/30 and 80/20), tracking Accuracy, F1-Score, Precision, and Recall metrics.",
      "Achieved a peak classification accuracy of 76% and 75% F1-Score utilizing RoBERTa, while diagnosing and documenting critical overfitting tendencies in conventional CNN/RNN models.",
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