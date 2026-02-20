import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, GraduationCap, Briefcase, Code } from "lucide-react"
import { CvPreviewButton } from "./cv-preview"

const skills = [
  "Java", "Spring Boot", "MVC Architecture", "RESTful APIs",
  "JavaScript", "React", "Python", "C", "MySQL", "Docker", "Git",
  "Python (Pandas, NumPy, TensorFlow)", "model evaluation",
  "data preprocessing", "REMnux", "Wireshark", "tcpdump",
]

const education = [
  {
    degree: "Bachelor of Science in Computer Engineering",
    school: "Marmara University",
    year: "2022-Present",
    description: "GPA: 3.12",
  },
]

const experience = [
  {
    title: "Sofware Engineering Intern",
    company: "Smartera Software Solutions",
    period: "July 2024 - September 2024",
    descriptions: [
      "Gained hands-on experience in backend software development using Java and Spring Boot.",
      "Applied Test-Driven Development (TDD) principles to write test-driven, maintainable, and reliable code.",
      "Focused on building scalable and efficient backend services while following best practices in software development.",
    ],
  },
  {
    title: "IT Intern",
    company: "Brisa Bridgestone Sabancı",
    period: "July 2025 – September 2025",
    descriptions: [
      "Gaining experience in software lifecycle within the IT department of a corporate environment.",
      "Utilizing platforms like Jira and Bugzilla for issue tracking, project management, and task coordination.",
      "Contributing to documentation and test activities related to service-based architectures.",
    ],
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 fade-up">About Me</h1>

        <div className="grid gap-8">
          <div className="fade-up-delay-1">
            <Card>
              <CardContent className="p-6">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                I&apos;m a Computer Engineering student with a strong foundation in backend development, 
                particularly using Java, Spring Boot, MVC architecture, and Docker. 
                I&apos;m passionate about building scalable, maintainable systems and 
                enjoy solving complex problems through clean architecture and analytical thinking. 
                In addition to backend technologies, I&apos;m actively exploring the fields of artificial intelligence and cybersecurity.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                I make a consistent effort to evaluate new opportunities, 
                expand my technical skill set, and adapt quickly to new tools and frameworks. 
                I value teamwork, continuous learning, and writing reliable, production-ready code.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="fade-up-delay-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Curriculum Vitae
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Download my complete CV or preview it online to learn more about my experience and qualifications.
                </p>
                <div className="flex gap-4">
                  <a
                    href="/cv.pdf"
                    download="CV.pdf"
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group"
                  >
                    <Download className="h-4 w-4 transition-transform group-hover:scale-110" />
                    Download CV
                  </a>
                  <CvPreviewButton />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="fade-up-delay-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Skills & Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="fade-up-delay-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground">
                        {edu.school} | {edu.year}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="fade-up-delay-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h3 className="font-semibold text-foreground">{exp.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} | {exp.period}
                      </p>
                      <ul className="list-disc list-inside">
                        {exp.descriptions.map((desc, i) => (
                          <li key={i} className="text-sm text-muted-foreground mt-2">{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
