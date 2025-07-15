"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Brain, Shield, Users, Zap, Globe } from "lucide-react"

interface AboutPageProps {
  darkMode: boolean
}

export function AboutPage({ darkMode }: AboutPageProps) {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Support",
      description: "Advanced AI technology trained specifically for mental health conversations and emotional support.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your conversations are private and secure. No data is stored or shared without your consent.",
    },
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Designed with empathy and understanding to provide genuine emotional support when you need it.",
    },
    {
      icon: Users,
      title: "24/7 Availability",
      description: "Always here for you, day or night, whenever you need someone to talk to or guidance.",
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "Get immediate support and coping strategies without waiting for appointments or callbacks.",
    },
    {
      icon: Globe,
      title: "Accessible Anywhere",
      description:
        "Available on any device with an internet connection, making mental health support truly accessible.",
    },
  ]

  const stats = [
    { number: "10K+", label: "Users Supported" },
    { number: "50K+", label: "Conversations" },
    { number: "24/7", label: "Availability" },
    { number: "100%", label: "Privacy Protected" },
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl animate-float">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-800"}`}>
            About{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Juno</span>
          </h1>
          <p className={`text-xl leading-relaxed max-w-3xl mx-auto ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Juno is your compassionate AI mental health copilot, designed to provide emotional support, guidance, and
            therapeutic conversation whenever you need it. We believe mental health support should be accessible,
            immediate, and judgment-free.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`text-center p-6 ${
                darkMode
                  ? "bg-white/5 border-white/10 backdrop-blur-lg"
                  : "bg-white/70 border-white/20 backdrop-blur-lg"
              } shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
            >
              <div className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
                {stat.number}
              </div>
              <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <Card
          className={`mb-16 ${
            darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
          } shadow-xl`}
        >
          <CardHeader>
            <CardTitle className={`text-2xl text-center ${darkMode ? "text-white" : "text-slate-800"}`}>
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center max-w-4xl mx-auto">
              <p className={`text-lg leading-relaxed mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Mental health challenges affect millions of people worldwide, yet access to support remains limited by
                cost, availability, and stigma. Juno bridges this gap by providing immediate, compassionate, and
                intelligent mental health support that's available whenever you need it.
              </p>
              <p className={`text-lg leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                We're not here to replace professional therapy, but to complement it by offering a safe space for daily
                emotional support, coping strategies, and mindfulness practices that can help you navigate life's
                challenges with greater resilience and self-awareness.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-slate-800"}`}>
            Why Choose Juno?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`p-6 ${
                  darkMode
                    ? "bg-white/5 border-white/10 backdrop-blur-lg"
                    : "bg-white/70 border-white/20 backdrop-blur-lg"
                } shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group`}
              >
                <div
                  className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {feature.title}
                </h3>
                <p className={`${darkMode ? "text-slate-300" : "text-slate-600"} leading-relaxed`}>
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <Card
          className={`${
            darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
          } shadow-xl`}
        >
          <CardHeader>
            <CardTitle className={`text-2xl text-center ${darkMode ? "text-white" : "text-slate-800"}`}>
              Our Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
                  Privacy & Security
                </h3>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Your mental health journey is personal. We protect your privacy with the highest security standards.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
                  Empathy & Compassion
                </h3>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Every interaction is designed with genuine care and understanding for your emotional wellbeing.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
                  Accessibility
                </h3>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Mental health support should be available to everyone, regardless of location or circumstances.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
