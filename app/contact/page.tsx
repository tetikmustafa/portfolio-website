import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 fade-up">Get In Touch</h1>

        <div className="fade-up-delay-1">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="text-muted-foreground text-lg">
              I am always available for new opportunities and collaborations.  
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((item) => {
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
                        "flex items-center gap-4 p-4 bg-card rounded-lg border transition-all duration-300",
                        isLink ? "hover:border-primary/50 hover:bg-accent/50 hover:-translate-y-1 cursor-pointer group" : ""
                      )}
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <item.icon className="h-6 w-6 text-primary" />
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
