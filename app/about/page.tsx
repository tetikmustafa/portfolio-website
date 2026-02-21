import { Badge } from "@/components/ui/badge"
import { Download, GraduationCap, Briefcase, Code } from "lucide-react"
import { CvPreviewButton } from "./cv-preview"

const skills = [
  "Java", "Spring Boot", "MVC Architecture", 
  "RESTful APIs", "JWT",
  "JavaScript", "React", "Typescript",
  "Pandas", "TensorFlow", "Model Evaluation",
  "Microservices Architecture", "Docker", "Git",
   "Python", "C", "SQL", "Power BI"
]

const education = [
  {
    degree: "Bachelor of Science in Computer Engineering",
    school: "Marmara University",
    year: "2022-Present",
    description: "GPA: 3.23/4.00",
  },
]

const experience = [
  {
    title: "Part-time Data Engineer",
    company: "Brisa Bridgestone Sabancı",
    period: "September 2025 – Present",
    descriptions: [
      "Gaining practical experience in Agile project management methodologies, actively participating in sprint planning and daily workflows",
      "Working within the Business Intelligence domain to develop interactive reports using Power BI.",
      "Processing complex datasets using Python and implementing mathematical models via Gurobi for a vehicle capacity and routing optimization project.",
    ],
  },
  {
    title: "IT Intern",
    company: "Brisa Bridgestone Sabancı",
    period: "July 2025 – September 2025",
    descriptions: [
      "Gained experience in software lifecycle within the IT department of a corporate environment.",
      "Utilized platforms like Jira and Bugzilla for issue tracking, project management, and task coordination.",
      "Contributed to documentation and test activities related to service-based architectures.",
      "Used tools like Postman and SoapUI to inspect and test API requests and responses."
    ],
  },
  {
    title: "Software Engineering Intern",
    company: "Smartera Software Solutions",
    period: "July 2024 - September 2024",
    descriptions: [
      "Gained hands-on experience in backend software development using Java and Spring Boot.",
      "Applied Test-Driven Development (TDD) principles to write test-driven and maintainable code.",
      "Focused on building scalable backend services while following best practices in software development.",
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
                As a software engineer, my aim is to build complete full stack applications. 
                I used Java and Spring Boot to create secure RESTful APIs. 
                I have experience designing both traditional MVC applications and scalable microservice architectures. 
                To connect these backends to the users, I create dynamic frontends with React and Next.js. 
                Finally, I use Docker to containerize my applications, ensuring my code is easy to deploy and works everywhere.                
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                I also enjoy exploring other fields of computer engineering, like Artificial Intelligence and Cybersecurity. 
                I have trained deep learning models using TensorFlow and conducted malware analysis in secure environments. 
                I also work with data engineering, using Python to process large datasets and build optimization models.
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
              <div className="flex gap-3">
                <a
                  href="/cv.pdf"
                  download="CV.pdf"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group"
                >
                  <Download className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Download CV
                </a>
                <CvPreviewButton />
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
                    <p className="text-xs text-primary/70 font-medium mt-0.5">
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
                <p className="text-xs text-primary/70 font-medium mt-0.5">{edu.school}</p>
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
