import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Github, Linkedin, MapPin } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "tetikmustafa03@gmail.com",
    href: "mailto:tetikmustafa03@gmail.com",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/tetikmustafa",
    href: "https://github.com/tetikmustafa",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/mustafa-tetik",
    href: "https://linkedin.com/in/mustafa-tetik",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Istanbul, Turkey",
    href: null,
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 fade-up">Get In Touch</h1>

        <div className="fade-up-delay-1">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="text-muted-foreground text-lg">
                I am looking for internship opportunities. 
                I&apos;m always interested in hearing about new projects and opportunities. 
                Whether you have a question or just want to say hi, feel free to reach out through email or social media.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-4 bg-card rounded-lg border hover:border-primary/50 transition-colors hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
