import Link from "next/link"
import { ArrowRight, Download } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-20 md:p-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 fade-up">
          <Link href="/about">Mustafa Tetik</Link>
        </h1>

        <div className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed fade-up-delay-1">
          <Link href="/about">Welcome! I am Mustafa, a final grade Computer Engineering Student with curiosity for how different technologies connect. <br /> 
          I enjoy designing complete systems, from the user interfaces down to the data and security layers.
          Click to learn more about me.</Link>
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
          <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
            <p className="text-muted-foreground leading-relaxed transition-colors hover:text-foreground">
            I&apos;m always seeking opportunities to learn new things and expand my view. <br />
            I am happy to be a part of a team where I can grow with it.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
