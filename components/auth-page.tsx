"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react"
import { SupabaseUserService } from "@/lib/supabase-user-service"

interface AuthPageProps {
  darkMode: boolean
  onAuthSuccess: () => void
}

export function AuthPage({ darkMode, onAuthSuccess }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (isSignUp: boolean) => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (isSignUp) {
      if (!formData.name) {
        newErrors.name = "Name is required"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignIn = async () => {
    if (!validateForm(false)) return

    setIsLoading(true)
    try {
      const result = await SupabaseUserService.signIn(formData.email, formData.password)
      if (result.success) {
        onAuthSuccess()
      } else {
        setErrors({ general: result.error || "Sign in failed" })
      }
    } catch (error) {
      setErrors({ general: "Sign in failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async () => {
    if (!validateForm(true)) return

    setIsLoading(true)
    try {
      const result = await SupabaseUserService.signUp(formData.name, formData.email, formData.password)
      if (result.success) {
        setErrors({ general: "Account created! Please check your email to verify your account." })
        // Don't auto-sign in, wait for email verification
      } else {
        setErrors({ general: result.error || "Sign up failed" })
      }
    } catch (error) {
      setErrors({ general: "Sign up failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card
        className={`w-full max-w-md ${
          darkMode ? "bg-white/5 border-white/10 backdrop-blur-lg" : "bg-white/70 border-white/20 backdrop-blur-lg"
        } shadow-2xl`}
      >
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
            Welcome to Juno
          </CardTitle>
          <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Your AI Mental Health Companion</p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {errors.general && (
              <div
                className={`mb-4 p-3 rounded-lg border text-sm ${
                  errors.general.includes("check your email")
                    ? "bg-green-500/10 border-green-500/20 text-green-500"
                    : "bg-red-500/10 border-red-500/20 text-red-500"
                }`}
              >
                {errors.general}
              </div>
            )}

            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className={darkMode ? "text-slate-300" : "text-slate-700"}>
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${
                      darkMode
                        ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        : "bg-white/50 border-slate-200"
                    } ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className={darkMode ? "text-slate-300" : "text-slate-700"}>
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${
                      darkMode
                        ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        : "bg-white/50 border-slate-200"
                    } ${errors.password ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>

              <Button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className={darkMode ? "text-slate-300" : "text-slate-700"}>
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`pl-10 ${
                      darkMode
                        ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        : "bg-white/50 border-slate-200"
                    } ${errors.name ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className={darkMode ? "text-slate-300" : "text-slate-700"}>
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${
                      darkMode
                        ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        : "bg-white/50 border-slate-200"
                    } ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className={darkMode ? "text-slate-300" : "text-slate-700"}>
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${
                      darkMode
                        ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        : "bg-white/50 border-slate-200"
                    } ${errors.password ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className={darkMode ? "text-slate-300" : "text-slate-700"}>
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`pl-10 ${
                      darkMode
                        ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        : "bg-white/50 border-slate-200"
                    } ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
              </div>

              <Button
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
