"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, GraduationCap, Briefcase, Code } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const skills = [
  "Java",
  "Spring Boot",
  "MVC Architecture",
  "RESTful APIs",
  "JavaScript",
  "React",
  "Python",
  "C",
  "MySQL",
  "Docker",
  "Git",
  "Python (Pandas, NumPy, TensorFlow)",
  "model evaluation",
  "data preprocessing",
  "REMnux",
  "Wireshark",
  "tcpdump",
]

const education = [
  {
    degree: "Bachelor of Science in Computer Engineering - GPA: 3.12",
    school: "Marmara University",
    year: "2022-Present",
    description: "",
  },
]

const experience = [
  {
    title: "Sofware Engineering Intern",
    company: "Smartera Software Solutions",
    period: "July 2024 - September 2024",
    description:
      "Gained hands-on experience in backend software development using Java and Spring Boot. ",
    description2:
      "Applied Test-Driven Development (TDD) principles to write test-driven, maintainable, and reliable code.",
    description3:
      "Focused on building scalable and efficient backend services while following best practices in software development.",
  },
  {
    title: "IT Intern",
    company: "Brisa Bridgestone Sabancı",
    period: "July 2025 – September 2025",
    description:
      "Gaining experience in software lifecycle within the IT department of a corporate environment.",
    description2:
      "Utilizing platforms like Jira and Bugzilla for issue tracking, project management, and task coordination.",
    description3:
      "Contributing to documentation and test activities related to service-based architectures.",
  },
]

export default function AboutPage() {
  const [cvDialogOpen, setCvDialogOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">About Me</h1>

          <div className="grid gap-8">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  I'm a Computer Engineering student with a strong foundation in backend development, 
                  particularly using Java, Spring Boot, MVC architecture, and Docker. 
                  I'm passionate about building scalable, maintainable systems and 
                  enjoy solving complex problems through clean architecture and analytical thinking. 
                  In addition to backend technologies, I'm actively exploring the fields of artificial intelligence and cybersecurity.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                  I make a consistent effort to evaluate new opportunities, 
                  expand my technical skill set, and adapt quickly to new tools and frameworks. 
                  I value teamwork, continuous learning, and writing reliable, production-ready code.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* CV Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
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
                    <Button asChild className="group">
                      <a href="/cv.pdf" download="CV.pdf">
                        <Download className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        Download CV
                      </a>
                    </Button>
                    <Dialog open={cvDialogOpen} onOpenChange={setCvDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="group">
                          <Eye className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                          Preview CV
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>CV Preview</DialogTitle>
                        </DialogHeader>
                        <div className="w-full h-[70vh]">
                          <iframe
                            src="/cv.pdf"
                            className="w-full h-full border-0"
                            title="CV Preview"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Skills & Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      >
                        <Badge variant="secondary" className="text-sm py-1 px-3">
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
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
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
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
                          <li className="text-sm text-muted-foreground mt-2">{exp.description}</li>
                          <li className="text-sm text-muted-foreground mt-2">{exp.description2}</li>
                          <li className="text-sm text-muted-foreground mt-2">{exp.description3}</li>
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
