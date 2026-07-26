import { Badge } from "@/components/ui/badge"
import { Download, GraduationCap, Briefcase, Code } from "lucide-react"
import { CvPreviewButton } from "./cv-preview"

const skills = [
  "Java", "Python", "TypeScript", "JavaScript", "C#", "SQL", "DAX", "M (Power Query)", "C", "Assembly (8086)",
  "Spring Boot", "Spring Cloud (Gateway, Eureka)", "OpenFeign", "RESTful APIs", "Flask", "FastAPI", "Spring Data JPA", "Hibernate", "JWT", "DTO", "MVC",
  "React", "Next.js (App Router)", "Tailwind CSS", "Vite", "WebSockets", "Shadcn UI", "Three.js", "WebGL",
  "Microsoft Fabric", "Power BI", "SAP BW", "SQL Server", "ETL Pipelines", "Gurobi", "Pyomo", "MILP",
  "PyTorch", "TensorFlow", "LLMs (T5, ALBERT, RoBERTa)", "YOLOv8", "ResNet", "Generative AI (Stable Diffusion, Qwen, ComfyUI, LoRA)", "NLP (NLTK)", "OpenCV",
  "Malware Analysis", "REMnux", "Wireshark", "INetSim", "Sysinternals (Procmon, Regshot)", "PEStudio", "Linux", "DNS/Mail Security (SPF, DKIM, DMARC)",
  "Docker", "Docker Compose", "Git", "GitHub", "MySQL", "PostgreSQL", "Swagger (OpenAPI)", "Postman", "SoapUI", "Jira", "Bugzilla", "Unity", "Roboflow"
]

const education = [
  {
    degree: "Computer Engineering",
    school: "Marmara University",
    year: "2022 - 2026",
    description: "GPA: 3.21",
  },
]

const experience = [
  {
    title: "Part-time Data Engineer",
    company: "Brisa Bridgestone Sabancı, Istanbul",
    period: "September 2025 – Present",
    descriptions: [
      "Engineered Python and Microsoft Fabric ETL pipelines to process and centralize over 300,000 rows of unstructured operational data into a secure Lakehouse.",
      "Developed a dynamic ingestion pipeline via Power Query (M) to extract conversational metrics from an external API, using automated credential rotation across multiple instances.",
      "Designed and deployed 5+ interactive Power BI dashboards with advanced DAX measures.",
      "Formulated MILP mathematical models utilizing Gurobi for dynamic vehicle routing.",
      "Integrated structured enterprise data utilizing SQL Server queries and modeled business reporting logic interacting with SAP Business Warehouse (BW).",
      "Working with Agile project management methodologies, participating in sprint planning and daily workflows.",
    ],
  },
  {
    title: "Digital Transformation Intern",
    company: "Brisa Bridgestone Sabancı, Izmit/Kocaeli",
    period: "July 2025 – September 2025",
    descriptions: [
      "Streamlined software workflows and change management, coordinating task resolution via Jira and Bugzilla.",
      "Validated systems by executing integration testing for REST and SOAP services using Postman and SoapUI.",
      "Authored comprehensive technical documentation for 35+ APIs and established standardized testing protocols.",
    ],
  },
  {
    title: "Software Engineering Intern",
    company: "Smartera Software Solutions, Istanbul",
    period: "July 2024 - September 2024",
    descriptions: [
      "Developed backend services utilizing Java and Spring Boot within a distributed, high-availability architecture.",
      "Built responsive frontend interfaces utilizing React and JavaScript, consuming backend RESTful APIs.",
      "Modeled databases via MySQL and Spring Data JPA, applying the DTO pattern for secure data transfer.",
      "Applied Test-Driven Development (TDD) principles to write maintainable, bug-resistant, and reliable code.",
      "Collaborated via Git workflows and standardized API endpoint definitions utilizing Swagger OpenAPI.",
      "Integrated Docker containerization into the SDLC to standardize local development and testing environments.",
    ],
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen p-6 pt-20 md:p-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-12 fade-up">
          <h1 className="text-4xl md:text-5xl font-bold homepage-name mb-3">About Me</h1>
        </div>

        <div className="space-y-10">

          {/* Bio */}
          <div className="fade-up-delay-1">
            <div className="about-section-card">
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                I am a multidisciplinary Computer Engineering graduate with hands-on expertise across Backend Architecture, Data Engineering, AI, and Cybersecurity. I genuinely enjoy learning new things, and I thrive on mastering new technologies and concepts quickly. Approaching complex problems with system-level architectural thinking feels natural to me, seamlessly bridging the gap between low-level hardware performance and enterprise-scale deployments.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                My main focus is full stack software development and data engineering. I architect scalable microservices with Java, Spring Boot, and Spring Cloud, connect them to dynamic frontends with React and Next.js, and containerize everything with Docker. In the data space, I engineer centralized ETL pipelines in Microsoft Fabric processing hundreds of thousands of rows, and I design interactive Power BI dashboards to transform unstructured datasets into actionable business insights.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Outside of traditional backend development, I actively advance my knowledge in Generative AI, Computer Vision, and NLP. I have co-authored published research on Transformer LLMs achieving state-of-the-art accuracy, optimized diffusion pipelines for massive inference speedups, and conducted malware analysis in isolated cybersecurity lab environments. These diverse areas keep me curious and feed back into how I think about building secure, intelligent, and well-architected systems.
              </p>
            </div>
          </div>

          {/* CV Download */}
          <div className="fade-up-delay-2">
            <div className="about-section-card">
              <div className="flex items-center gap-2 mb-3">
                <Download className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Curriculum Vitae</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Download my complete CV or preview it right here.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/cv.pdf"
                  download="CV.pdf"
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group w-full sm:w-auto whitespace-nowrap"
                >
                  <Download className="h-4 w-4 transition-transform group-hover:scale-110 shrink-0" />
                  <span>Download CV</span>
                </a>
                <div className="w-full sm:w-auto">
                  <CvPreviewButton />
                </div>
              </div>
            </div>
          </div>

          {/* Experience — vertical timeline */}
          <div className="fade-up-delay-3 flex-1" id="experience">
            <div className="flex items-center gap-2 mb-5">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Work Experience</h2>
            </div>

            <div className="about-timeline">
              {experience.map((exp, index) => (
                <div key={index} className="about-timeline-item">
                  <div className="about-timeline-dot" />
                  <div className="about-timeline-content">
                    <h3 className="font-semibold text-foreground text-sm">{exp.title}</h3>
                    <p className="text-xs text-primary/90 font-medium mt-0.5">
                      {exp.company}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{exp.period}</p>
                    <ul className="mt-2 space-y-1.5">
                      {exp.descriptions.map((desc, i) => (
                        <li key={i} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                          <span className="text-primary/40 mt-0.5 shrink-0">•</span>
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="fade-up-delay-4">
            <div className="flex items-center gap-2 mb-5">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Education</h2>
            </div>

            {education.map((edu, index) => (
              <div key={index} className="about-section-card">
                <h3 className="font-semibold text-foreground text-sm">{edu.degree}</h3>
                <p className="text-xs text-primary/90 font-medium mt-0.5">{edu.school}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{edu.year}</p>
                <p className="text-xs text-muted-foreground mt-2">{edu.description}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="fade-up-delay-5">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Skills & Technologies</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm py-1 px-3 hover:bg-primary/10 hover:border-primary/20 transition-colors">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}