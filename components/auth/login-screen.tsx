"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, User, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SignUpForm } from "./sign-up-form"

export function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("customer")
  const [showSignUp, setShowSignUp] = useState(false)

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        console.error("Login error:", error.message)
        return
      }

      if (data.user) {
        window.location.href = "/"
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setError(errorMessage)
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowSignUp = () => {
    setShowSignUp(true)
  }

  const handleBackToLogin = () => {
    setShowSignUp(false)
  }

  if (showSignUp) {
    return <SignUpForm onBackToLogin={handleBackToLogin} />
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
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl overflow-hidden">
            <img src="/locana-logo.svg" alt="Locana" className="w-full h-full" />
          </div>
          <CardTitle className={`text-2xl font-bold ${
            activeTab === 'owner' ? 'text-white' : 'text-gray-900'
          }`}>Welcome to Locana</CardTitle>
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
              <p className="text-sm text-gray-600 text-center mb-4">Shop local and discover amazing products</p>
            </TabsContent>

            <TabsContent value="owner">
              <p className="text-sm text-red-100 text-center mb-4">Manage your shop and connect with customers</p>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className={activeTab === 'owner' ? 'text-red-100' : ''}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={activeTab === 'owner' ? 'bg-white border-white text-gray-900 placeholder:text-gray-400' : ''}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={activeTab === 'owner' ? 'bg-white border-white text-gray-900 placeholder:text-gray-400' : ''}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent ${
                    activeTab === 'owner' ? 'text-gray-600 hover:text-gray-900' : ''
                  }`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-[#E23744] text-sm text-center p-2 bg-red-50 rounded">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Button 
                type="submit" 
                className={`w-full ${
                  activeTab === 'owner'
                    ? 'bg-white text-[#E23744] hover:bg-white/90'
                    : 'bg-[#E23744] text-white hover:bg-[#E23744]/90'
                }`} 
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <Button
                type="button"
                className={`w-full ${
                  activeTab === 'owner'
                    ? 'bg-white text-[#E23744] hover:bg-white/90'
                    : 'bg-[#E23744] text-white hover:bg-[#E23744]/90'
                }`}
                onClick={handleShowSignUp}
                disabled={isLoading}
              >
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
