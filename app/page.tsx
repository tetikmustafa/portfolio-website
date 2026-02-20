import Link from "next/link"
import { ArrowRight, Download } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 fade-up">
          Mustafa Tetik
        </h1>

        <div className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed fade-up-delay-1">
          I&apos;m a computer engineering student who enjoys building clean and scalable backend systems. 
          I&apos;m curious about AI and deep learning, and I&apos;m also exploring opportunities in cybersecurity.
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-up-delay-2">
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

        <div className="mt-16 fade-up-delay-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
            <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 max-w-2xl mx-auto">
              <p className="text-muted-foreground leading-relaxed">
              I&apos;m currently looking for an internship where I can keep learning new things, grow my skills, 
              and be part of a team where I can really get involved in real projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
