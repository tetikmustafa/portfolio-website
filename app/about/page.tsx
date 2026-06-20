import { Badge } from "@/components/ui/badge"
import { Download, GraduationCap, Briefcase, Code } from "lucide-react"
import { CvPreviewButton } from "./cv-preview"

const skills = [
  "Java", "Spring Boot", "Spring Cloud", "RESTful APIs", "JWT",
  "JavaScript", "React", "Next.js",
  "Python", "Pandas", "NumPy", "PyTorch", "TensorFlow",
  "NLP", "ComfyUI",
  "Scikit-learn",
  "Power BI", "Power Query (M)", "DAX", "SQL Server", "SQL", "MySQL",
  "Microservices Architecture", "MVC", "DTO", "Docker", "Docker Compose",
  "Git", "GitHub", "Jira", "Postman", "Swagger", "SoapUI", "Bugzilla",
  "Linux", "C#", "Unity",
]

const education = [
  {
    degree: "Bachelor of Science in Computer Engineering",
    school: "Marmara University",
    year: "2022-2026",
    description: "GPA: 3.23/4.00",
  },
]

const experience = [
  {
    title: "Part-time Data Engineer",
    company: "Brisa Bridgestone Sabancı, Istanbul",
    period: "September 2025 – Present",
    descriptions: [
      "Designed and managed data pipelines and ETL processes utilizing Microsoft Fabric centralize operational data into a Lakehouse architecture.",
      "Structured raw enterprise data using Power Query (M) and built advanced DAX measure calculations, transforming complex business rules into interactive Power BI dashboards.",
      "Integrated structured enterprise data utilizing SQL Server queries and modeled business reporting logic interacting with SAP Business Warehouse (BW).",
      "Processed high-volume datasets using Python (Pandas, NumPy) and implemented mathematical models via Gurobi solvers for vehicle capacity and routing optimization.",
      "Applied Agile methodologies, participating in sprint planning and daily meetings to align technical development with business metrics modeling.",
    ],
  },
  {
    title: "IT Intern",
    company: "Brisa Bridgestone Sabancı, Izmit/Kocaeli",
    period: "July 2025 – September 2025",
    descriptions: [
      "Managed issue tracking, structured change management, and task coordination utilizing Jira and Bugzilla within a corporate enterprise governance process.",
      "Executed comprehensive end-to-end integration testing for REST and SOAP web services utilizing Postman and SoapUI.",
      "Contributed to documentation and test activities related to service-based architectures.",
    ],
  },
  {
    title: "Software Engineering Intern",
    company: "Smartera Software Solutions, Istanbul",
    period: "July 2024 - September 2024",
    descriptions: [
      "Developed scalable backend architectures utilizing Java and Spring Boot within an isolated microservices architecture.",
      "Built responsive and dynamic frontend interfaces utilizing React, HTML, CSS, and JavaScript to seamlessly interact with RESTful APIs.",
      "Integrated DevOps practices and Docker containerization into the Software Development Life Cycle (SDLC).",
      "Applied Test-Driven Development (TDD) principles to write test-driven and maintainable code.",
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
                I'm always chasing opportunities to grow. I genuinely enjoy learning new things, I pick up new
                technologies and concepts quickly, and I thrive in team environments where I can both contribute and learn from
                others. I'm comfortable working within Agile methodologies — sprint planning, daily stand-ups, and iterative
                delivery feel natural to me, whether I'm in a startup or a large corporate setting.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                My main focus is full stack software development. I build secure RESTful APIs and distributed microservice
                architectures with Java and Spring Boot, connect them to dynamic frontends with React and Next.js, and
                containerize everything with Docker for easy, reproducible deployment. I'm also comfortable with DevOps practices
                and CI/CD-style workflows that keep applications easy to deploy and maintain. I've gained hands-on experience building microservice-based backends, integrating REST and SOAP APIs, and
                working with enterprise data infrastructure — and I want to keep developing my career in this direction.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Outside of software engineering, I enjoy exploring artificial intelligence, data engineering, and cybersecurity.
                I've trained deep learning and computer vision models, built generative AI pipelines, processed large-scale
                datasets to build optimization models, and conducted malware analysis in isolated lab environments. These areas
                keep me curious and often feed back into how I think about building secure, intelligent, and well-architected
                systems.
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