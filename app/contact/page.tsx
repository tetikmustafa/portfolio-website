import { Mail, Github, Linkedin, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <div className="min-h-screen p-6 pt-20 md:p-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10 fade-up">
          <h1 className="text-4xl md:text-5xl font-bold homepage-name mb-3">Get In Touch</h1>
          <p className="text-lg text-muted-foreground">
            I am always available for new opportunities and collaborations.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contactInfo.map((item, idx) => {
            const isLink = !!item.href
            const Wrapper = isLink ? "a" : "div"
            const wrapperProps = isLink
              ? {
                  href: item.href,
                  target: item.href?.startsWith("http") ? "_blank" : undefined,
                  rel: item.href?.startsWith("http") ? "noopener noreferrer" : undefined,
                }
              : {}

            return (
              <Wrapper
                key={item.label}
                {...wrapperProps}
                className={cn(
                  `contact-card fade-up-delay-${Math.min(idx + 1, 5)}`,
                  isLink ? "cursor-pointer group" : ""
                )}
              >
                <div className="contact-icon-wrapper group-hover:border-primary/30 group-hover:shadow-[0_0_12px_hsl(var(--primary)/0.15)]">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className={cn(
                    "text-sm transition-colors",
                    isLink ? "text-muted-foreground group-hover:text-primary" : "text-muted-foreground"
                  )}>
                    {item.value}
                  </p>
                </div>
              </Wrapper>
            )
          })}
        </div>
      </div>
    </div>
  )
}
