"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MessageCircle,
  Mic,
  Timer,
  Music,
  Smile,
  Sparkles,
  Shield,
  Zap,
  Heart,
  Brain,
  CheckCircle,
  X,
} from "lucide-react"

interface FeaturesPageProps {
  darkMode: boolean
}

export function FeaturesPage({ darkMode }: FeaturesPageProps) {
  const coreFeatures = [
    {
      icon: MessageCircle,
      title: "AI-Powered Conversations",
      description:
        "Engage in meaningful, therapeutic conversations with our advanced AI trained specifically for mental health support.",
      features: [
        "Natural language processing",
        "Contextual understanding",
        "Empathetic responses",
        "24/7 availability",
      ],
    },
    {
      icon: Mic,
      title: "Voice Interaction",
      description: "Speak naturally with Juno using advanced speech recognition and text-to-speech technology.",
      features: [
        "Speech-to-text input",
        "Natural voice responses",
        "Multiple language support",
        "Hands-free interaction",
      ],
    },
    {
      icon: Smile,
      title: "Mood Tracking",
      description:
        "Monitor your emotional wellbeing with our intuitive mood tracking system and gain insights over time.",
      features: [
        "Daily mood check-ins",
        "Emotional pattern analysis",
        "Progress visualization",
        "Personalized insights",
      ],
    },
    {
      icon: Timer,
      title: "Focus Timer",
      description: "Improve productivity and mindfulness with our customizable Pomodoro-style focus timer.",
      features: ["Customizable durations", "Break reminders", "Session tracking", "Productivity insights"],
    },
    {
      icon: Music,
      title: "Mindful Sounds",
      description: "Access a library of binaural beats and calming sounds to enhance your mental state.",
      features: ["Binaural beats", "Nature sounds", "Custom audio upload", "Personalized playlists"],
    },
    {
      icon: Sparkles,
      title: "Daily Affirmations",
      description: "Start each day with personalized affirmations and motivational quotes tailored to your needs.",
      features: ["Personalized content", "Daily rotation", "Mood-based selection", "Custom affirmations"],
    },
  ]

  const comparisonFeatures = [
    { feature: "24/7 Availability", juno: true, others: false },
    { feature: "No Appointment Needed", juno: true, others: false },
    { feature: "Privacy-First Design", juno: true, others: true },
    { feature: "Voice Interaction", juno: true, others: false },
    { feature: "Mood Tracking", juno: true, others: false },
    { feature: "Focus Tools", juno: true, others: false },
    { feature: "Mindful Audio", juno: true, others: false },
    { feature: "Free to Use", juno: true, others: false },
    { feature: "No Login Required", juno: true, others: false },
    { feature: "Offline Capabilities", juno: true, others: false },
    { feature: "Custom Audio Upload", juno: true, others: false },
    { feature: "Data Export", juno: true, others: false },
  ]

  const advantages = [
    {
      icon: Zap,
      title: "Instant Access",
      description: "Get immediate support without waiting for appointments or callbacks. Juno is always ready to help.",
    },
    {
      icon: Shield,
      title: "Complete Privacy",
      description: "Your conversations stay private. No data collection, no tracking, no sharing with third parties.",
    },
    {
      icon: Heart,
      title: "Judgment-Free Zone",
      description:
        "Express yourself freely without fear of judgment. Juno provides a safe space for all your thoughts.",
    },
    {
      icon: Brain,
      title: "Scientifically Informed",
      description:
        "Built on evidence-based therapeutic approaches including CBT, mindfulness, and positive psychology.",
    },
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-800"}`}>
            Powerful{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Features
            </span>
          </h1>
          <p className={`text-xl leading-relaxed max-w-3xl mx-auto ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Discover the comprehensive suite of mental health tools designed to support your emotional wellbeing
          </p>
        </div>

        {/* Core Features */}
        <div className="mb-20">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-slate-800"}`}>
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card
                key={index}
                className={`p-6 ${
                  darkMode
                    ? "bg-white/5 border-white/10 backdrop-blur-lg"
                    : "bg-white/70 border-white/20 backdrop-blur-lg"
                } shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group`}
              >
                <div
                  className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {feature.title}
                </h3>
                <p className={`${darkMode ? "text-slate-300" : "text-slate-600"} leading-relaxed mb-4`}>
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Juno vs Others Comparison */}
        <div className="mb-20">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-slate-800"}`}>
            Why Choose Juno Over Other AI Platforms?
          </h2>

          <Card
            className={`${
              darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
            } shadow-xl overflow-hidden`}
          >
            <CardHeader>
              <CardTitle className={`text-2xl text-center ${darkMode ? "text-white" : "text-slate-800"}`}>
                Feature Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${darkMode ? "border-white/10" : "border-slate-200"}`}>
                      <th className={`text-left py-4 px-4 ${darkMode ? "text-white" : "text-slate-800"}`}>Feature</th>
                      <th className="text-center py-4 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Heart className="w-5 h-5 text-indigo-500" />
                          <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}>Juno</span>
                        </div>
                      </th>
                      <th className={`text-center py-4 px-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                        Other AI Platforms
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((item, index) => (
                      <tr
                        key={index}
                        className={`border-b ${darkMode ? "border-white/5" : "border-slate-100"} hover:bg-white/5 transition-colors`}
                      >
                        <td className={`py-4 px-4 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                          {item.feature}
                        </td>
                        <td className="text-center py-4 px-4">
                          {item.juno ? (
                            <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="text-center py-4 px-4">
                          {item.others ? (
                            <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-red-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unique Advantages */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? "text-white" : "text-slate-800"}`}>
            Unique Advantages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advantages.map((advantage, index) => (
              <Card
                key={index}
                className={`p-8 ${
                  darkMode
                    ? "bg-white/5 border-white/10 backdrop-blur-lg"
                    : "bg-white/70 border-white/20 backdrop-blur-lg"
                } shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                  >
                    <advantage.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-slate-800"}`}>
                      {advantage.title}
                    </h3>
                    <p className={`${darkMode ? "text-slate-300" : "text-slate-600"} leading-relaxed`}>
                      {advantage.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card
          className={`text-center p-12 ${
            darkMode
              ? "bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-white/10 backdrop-blur-lg"
              : "bg-gradient-to-r from-indigo-50 to-purple-50 border-white/20 backdrop-blur-lg"
          } shadow-xl`}
        >
          <h2 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-800"}`}>
            Ready to Experience the Difference?
          </h2>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Join thousands of users who have found support, guidance, and peace of mind with Juno's comprehensive mental
            health platform.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <Heart className="w-5 h-5 mr-2" />
            Start Your Journey Today
          </Button>
        </Card>
      </div>
    </div>
  )
}
