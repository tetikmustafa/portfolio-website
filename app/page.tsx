import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

const featuredProjects = [
  {
    name: "Order Managing App",
    description: "An order management application with Spring Boot backend.",
  },
  {
    name: "Deep Learning Models Research Paper",
    description: "AI-driven data analysis & prediction model.",
  },
];

const experience = [
  {
    title: "Part-time Data Engineer",
    company: "Brisa Bridgestone Sabancı",
    period: "Sep 2025 – Present",
  },
  {
    title: "IT Intern",
    company: "Brisa Bridgestone Sabancı",
    period: "Jul 2025 – Sep 2025",
  },
  {
    title: "Software Engineering Intern",
    company: "Smartera Software Solutions",
    period: "Jul 2024 – Sep 2024",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center p-6 pt-20 md:p-10">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* ── Left Column ── */}
          <div className="lg:col-span-3 space-y-8">
            {/* Name */}
            <div className="fade-up">
              <h1 className="text-5xl md:text-7xl font-bold homepage-name mb-2">
                <Link href="/about">MUSTAFA TETIK</Link>
              </h1>
            </div>

            {/* Intro */}
            <div className="fade-up-delay-1">
              <Link
                href="/about"
                className="block text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl hover:text-foreground transition-colors"
              >
                Welcome! I am Mustafa, a final grade Computer Engineering
                Student with curiosity for how different technologies connect. I
                enjoy designing complete systems, from the user interfaces down
                to the data and security layers. Click to learn more about me.
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 fade-up-delay-2">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 h-11 px-8 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group"
              >
                View My Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="/cv.pdf"
                download="CV.pdf"
                className="inline-flex items-center gap-2 h-11 px-8 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors group"
              >
                <Download className="h-4 w-4 transition-transform group-hover:scale-110" />
                Download CV
              </a>
            </div>

            {/* Featured Projects */}
            <div className="space-y-3 fade-up-delay-3">
              {featuredProjects.map((project) => (
                <div
                  key={project.name}
                  className="bg-card/50 border border-border rounded-xl px-5 py-4 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <h3 className="font-semibold text-foreground text-base mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Column — Experience Timeline ── */}
          <div className="lg:col-span-2 fade-up-delay-2">
            <div className="timeline-zigzag">
              <div className="timeline-line" />
              {experience.map((exp, index) => (
                <Link
                  href="/about#experience"
                  key={index}
                  className={`timeline-zigzag-item group cursor-pointer ${index % 2 === 0 ? 'timeline-right' : 'timeline-left'}`}
                >
                  <div className="timeline-zigzag-dot transition-transform duration-300 group-hover:scale-125" />
                  <div className="timeline-zigzag-content transition-transform duration-300 group-hover:-translate-y-1">
                    <h3 className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {exp.company}
                    </p>
                    <p className="text-xs text-primary/90 mt-1">{exp.period}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
