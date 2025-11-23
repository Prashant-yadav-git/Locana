"use client"

import { SignUpForm } from "@/components/auth/sign-up-form"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  
  const handleBackToLogin = () => {
    router.push("/auth/login")
  }

  return <SignUpForm onBackToLogin={handleBackToLogin} />
}