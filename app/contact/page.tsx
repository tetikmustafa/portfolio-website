"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Github, Linkedin, Send, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import emailjs from "@emailjs/browser"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsSubmitting(true)

  //   // Simple spam protection - check if form is filled too quickly
  //   await new Promise((resolve) => setTimeout(resolve, 1000))

  //   try {
  //     // Replace these with your actual EmailJS credentials
  //     const templateParams = {
  //       from_name: formData.name,
  //       from_email: formData.email,
  //       subject: formData.subject,
  //       message: formData.message,
  //     }

  //     await emailjs.send(
  //       "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
  //       "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
  //       templateParams,
  //       "YOUR_PUBLIC_KEY" // Replace with your EmailJS public key
  //     )

  //     toast({
  //       title: "Message sent!",
  //       description: "Thank you for your message. I'll get back to you soon.",
  //     })

  //     setFormData({ name: "", email: "", subject: "", message: "" })
  //   } catch (error) {
  //     console.error("Error sending email:", error)
  //     toast({
  //       title: "Error",
  //       description: "Failed to send message. Please try again.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target
  //   setFormData((prev) => ({ ...prev, [name]: value }))
  // }

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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">Get In Touch</h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <p className="text-muted-foreground text-lg">
                  I am looking for internship opportunities. 
                  I'm always interested in hearing about new projects and opportunities. 
                  Whether you have a question or just want to say hi, feel free to reach out through email or social media.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-card rounded-lg border hover:border-primary/50 transition-colors"
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
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
