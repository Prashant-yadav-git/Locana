"use client"

import React, { memo } from "react"
import { Home, Map, User, Store, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: "home" | "map" | "profile" | "dashboard" | "top-shops"
  userRole: "customer" | "owner"
  onTabChange: (tab: "home" | "map" | "profile" | "dashboard" | "top-shops") => void
  cartItemCount?: number
}

export const BottomNav = memo(function BottomNav({ activeTab, userRole, onTabChange, cartItemCount = 0 }: BottomNavProps) {
  const customerTabs = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "map" as const, label: "Map", icon: Map },
    { id: "top-shops" as const, label: "Top Shops", icon: TrendingUp },
    { id: "profile" as const, label: "Profile", icon: User },
  ]

  const ownerTabs = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "profile" as const, label: "Profile", icon: User },
  ]

  const tabs = userRole === "customer" ? customerTabs : ownerTabs

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl rounded-t-3xl z-50">
      <div className="flex items-center justify-around py-4 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-2 px-3 py-3 rounded-2xl transition-all duration-200 min-w-[60px]",
                isActive
                  ? "text-primary bg-primary/10 scale-105 shadow-lg"
                  : "text-gray-500 hover:text-primary hover:bg-primary/5 hover:scale-105",
              )}
            >
              <div className="relative">
                <Icon className={cn("transition-all duration-200", isActive ? "w-6 h-6" : "w-5 h-5")} />

              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive ? "font-bold" : "font-medium",
                )}
              >
                {tab.label}
              </span>
              {isActive && <div className="w-1 h-1 bg-primary rounded-full"></div>}
            </button>
          )
        })}
      </div>
    </nav>
  )
})
