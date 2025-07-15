"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageCircle, Github, Linkedin, Send, Heart } from "lucide-react"

interface ContactPageProps {
  darkMode: boolean
}

export function ContactPage({ darkMode }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({ name: "", email: "", subject: "", message: "" })

    setTimeout(() => setSubmitted(false), 5000)
  }

  const developers = [
    {
      name: "Alex Chen",
      role: "Lead AI Engineer",
      bio: "Specializes in natural language processing and therapeutic AI systems. Passionate about making mental health support accessible to everyone.",
      email: "workrusith@gmail.com",
      github: "alexchen",
      linkedin: "alexchen-ai",
    },
    {
      name: "Sarah Johnson",
      role: "UX/UI Designer",
      bio: "Focuses on creating empathetic and intuitive user experiences. Believes design can heal and empower people.",
      email: "workrusith@gmail.com",
      github: "sarahj-design",
      linkedin: "sarah-johnson-ux",
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Clinical Advisor",
      bio: "Licensed therapist and mental health advocate. Ensures Juno follows best practices in therapeutic communication.",
      email: "workrusith@gmail.com",
      linkedin: "dr-michael-rodriguez",
    },
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-800"}`}>
            Contact{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Our Team
            </span>
          </h1>
          <p className={`text-xl leading-relaxed max-w-3xl mx-auto ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Have questions, feedback, or suggestions? We'd love to hear from you. Our team is dedicated to making Juno
            the best mental health companion possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card
            className={`${
              darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
            } shadow-xl`}
          >
            <CardHeader>
              <CardTitle className={`text-2xl ${darkMode ? "text-white" : "text-slate-800"}`}>
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
                    Thank You!
                  </h3>
                  <p className={`${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                    Your message has been sent. We'll get back to you soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className={darkMode ? "text-slate-300" : "text-slate-700"}>
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`mt-1 ${
                          darkMode
                            ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                            : "bg-white/50 border-slate-200"
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className={darkMode ? "text-slate-300" : "text-slate-700"}>
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`mt-1 ${
                          darkMode
                            ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                            : "bg-white/50 border-slate-200"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className={darkMode ? "text-slate-300" : "text-slate-700"}>
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`mt-1 ${
                        darkMode
                          ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                          : "bg-white/50 border-slate-200"
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className={darkMode ? "text-slate-300" : "text-slate-700"}>
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`mt-1 ${
                        darkMode
                          ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                          : "bg-white/50 border-slate-200"
                      }`}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card
              className={`p-6 ${
                darkMode
                  ? "bg-white/5 border-white/10 backdrop-blur-lg"
                  : "bg-white/70 border-white/20 backdrop-blur-lg"
              } shadow-xl`}
            >
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-800"}`}>
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-indigo-500" />
                  <span className={darkMode ? "text-slate-300" : "text-slate-600"}>workrusith@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-indigo-500" />
                  <span className={darkMode ? "text-slate-300" : "text-slate-600"}>Live chat available 24/7</span>
                </div>
              </div>
            </Card>

            <Card
              className={`p-6 ${
                darkMode
                  ? "bg-white/5 border-white/10 backdrop-blur-lg"
                  : "bg-white/70 border-white/20 backdrop-blur-lg"
              } shadow-xl`}
            >
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-800"}`}>
                Response Time
              </h3>
              <p className={`${darkMode ? "text-slate-300" : "text-slate-600"} leading-relaxed`}>
                We typically respond to all inquiries within 24 hours. For urgent matters related to mental health
                crises, please contact your local emergency services or a crisis hotline.
              </p>
            </Card>

            <Card
              className={`p-6 ${
                darkMode
                  ? "bg-white/5 border-white/10 backdrop-blur-lg"
                  : "bg-white/70 border-white/20 backdrop-blur-lg"
              } shadow-xl`}
            >
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-800"}`}>
                Open Source
              </h3>
              <p className={`${darkMode ? "text-slate-300" : "text-slate-600"} leading-relaxed mb-4`}>
                Juno is built with transparency in mind. Check out our code, contribute, or report issues on GitHub.
              </p>
              <Button
                variant="outline"
                className={`${
                  darkMode
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </Card>
          </div>
        </div>

        {/* Meet the Team */}
        <div>
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-slate-800"}`}>
            Meet the Developers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((dev, index) => (
              <Card
                key={index}
                className={`p-6 ${
                  darkMode
                    ? "bg-white/5 border-white/10 backdrop-blur-lg"
                    : "bg-white/70 border-white/20 backdrop-blur-lg"
                } shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
              >
                <div className="text-center mb-4">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {dev.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>{dev.name}</h3>
                  <p className="text-indigo-500 font-medium">{dev.role}</p>
                </div>

                <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"} leading-relaxed mb-6`}>
                  {dev.bio}
                </p>

                <div className="flex justify-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${
                      darkMode
                        ? "border-white/20 text-white hover:bg-white/10"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={() => window.open(`mailto:${dev.email}`, "_blank")}
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                  {dev.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${
                        darkMode
                          ? "border-white/20 text-white hover:bg-white/10"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Github className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${
                      darkMode
                        ? "border-white/20 text-white hover:bg-white/10"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
