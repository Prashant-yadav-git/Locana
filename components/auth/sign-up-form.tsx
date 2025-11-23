"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, User, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SignUpFormProps {
  onBackToLogin: () => void
}

export function SignUpForm({ onBackToLogin }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("customer")

  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (!formData.phoneNumber.trim()) {
      setError("Phone number is required")
      return false
    }
    return true
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            user_type: activeTab === 'owner' ? 'shop_owner' : 'customer'
          }
        },
      })

      if (error) {
        setError(error.message)
        console.error("Sign up error:", error.message)
        return
      }

      if (data.user) {
        // Wait a bit for trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Update user profile with additional data
        await supabase.from("profiles").update({
          full_name: formData.fullName,
          phone: formData.phoneNumber,
          user_type: activeTab === 'owner' ? 'shop_owner' : 'customer'
        }).eq('id', data.user.id)

        window.location.href = "/auth/sign-up-success"
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setError(errorMessage)
      console.error("Sign up error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      activeTab === 'owner' 
        ? 'bg-[#FCEDEF]' 
        : 'bg-gradient-to-br from-white to-gray-50'
    }`}>
      <Card className={`w-full max-w-md ${
        activeTab === 'owner'
          ? 'bg-red-700 border-red-800 text-white'
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToLogin}
              className={`p-2 ${
                activeTab === 'owner' ? 'text-red-100 hover:text-white hover:bg-red-600' : ''
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="mx-auto w-16 h-16 rounded-2xl overflow-hidden">
              <img src="/locana-logo.svg" alt="Locana" className="w-full h-full" />
            </div>
            <div className="w-8" />
          </div>
          <CardTitle className={`text-2xl font-bold ${
            activeTab === 'owner' ? 'text-white' : 'text-gray-900'
          }`}>Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className={`grid w-full grid-cols-2 ${
              activeTab === 'owner' ? 'bg-red-600' : ''
            }`}>
              <TabsTrigger 
                value="customer" 
                className={`flex items-center gap-2 ${
                  activeTab === 'owner' ? 'data-[state=active]:bg-red-700 data-[state=active]:text-white text-red-100' : ''
                }`}
              >
                <User className="w-4 h-4" />
                Customer
              </TabsTrigger>
              <TabsTrigger 
                value="owner" 
                className={`flex items-center gap-2 ${
                  activeTab === 'owner' ? 'data-[state=active]:bg-red-700 data-[state=active]:text-white text-red-100' : ''
                }`}
              >
                <Store className="w-4 h-4" />
                Shop Owner
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customer">
              <p className="text-sm text-gray-600 text-center mb-4">Join to shop local and discover amazing products</p>
            </TabsContent>

            <TabsContent value="owner">
              <p className="text-sm text-red-100 text-center mb-4">Create your shop and connect with customers</p>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className={activeTab === 'owner' ? 'text-red-100' : ''}>
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                className={activeTab === 'owner' ? 'bg-red-600 border-red-700 text-white placeholder:text-red-200' : ''}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={activeTab === 'owner' ? 'text-red-100' : ''}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                className={activeTab === 'owner' ? 'bg-red-600 border-red-700 text-white placeholder:text-red-200' : ''}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className={activeTab === 'owner' ? 'text-red-100' : ''}>
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="Enter your phone number"
                className={activeTab === 'owner' ? 'bg-red-600 border-red-700 text-white placeholder:text-red-200' : ''}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={activeTab === 'owner' ? 'text-red-100' : ''}>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Create a password"
                  className={activeTab === 'owner' ? 'bg-red-600 border-red-700 text-white placeholder:text-red-200' : ''}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent ${
                    activeTab === 'owner' ? 'text-red-100 hover:text-white' : ''
                  }`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={activeTab === 'owner' ? 'text-red-100' : ''}>
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  className={activeTab === 'owner' ? 'bg-red-600 border-red-700 text-white placeholder:text-red-200' : ''}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent ${
                    activeTab === 'owner' ? 'text-red-100 hover:text-white' : ''
                  }`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-[#E23744] text-sm text-center p-2 bg-red-50 rounded">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className={`w-full ${
                activeTab === 'owner'
                  ? 'bg-white text-[#E23744] hover:bg-white/90'
                  : 'bg-[#E23744] text-white hover:bg-[#E23744]/90'
              }`} 
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}