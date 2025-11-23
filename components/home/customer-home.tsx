"use client"

import React, { useState, useEffect, useCallback, memo } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { CategoryChip } from "@/components/ui/category-chip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Mic, Camera } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { getShopsByLocation } from "@/lib/location-shops"
import { RealTimeSearch } from "@/components/search/real-time-search"
import { InstagramStyleShop } from "@/components/shops/instagram-style-shop"
import { mockProducts, mockShops } from "@/lib/mock-data"
import Image from "next/image"

export const CustomerHome = memo(function CustomerHome() {
  const { addToCart } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedShop, setSelectedShop] = useState<any>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [currentLocation, setCurrentLocation] = useState("Getting location...")
  const [popularShops, setPopularShops] = useState<any[]>([])
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null)
  const [viewAllSection, setViewAllSection] = useState<string | null>(null)
  const [showViewAll, setShowViewAll] = useState<{type: 'products' | 'shops' | 'open', title: string} | null>(null)

  useEffect(() => {
    setCurrentLocation("Detecting location...")
    setPopularShops([]) // Clear shops until location is detected
    getCurrentLocation()
  }, [])

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setCurrentLocation("Location not supported")
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setUserCoords({ lat: latitude, lng: longitude })
        
        console.log('📍 User Location Detected:', latitude, longitude)
        
        // Get location-based shops using actual user location
        const shops = getShopsByLocation(latitude, longitude)
        console.log('🏪 Shops to display:', shops.map(s => s.name).join(', '))
        console.log('🏪 Total shops:', shops.length)
        setPopularShops(shops)
        
        // Simple location display
        setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        
        // Try geocoding in background
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'User-Agent': 'Locana-App' } }
          )
          const data = await response.json()
          if (data?.display_name) {
            const parts = data.display_name.split(',')
            setCurrentLocation(parts.slice(0, 3).join(','))
          }
        } catch (e) {
          console.log('Geocoding failed:', e)
        }
      },
      (error) => {
        console.error('❌ Location error:', error.message)
        setCurrentLocation("Location access denied")
        // Show default shops only on error
        setPopularShops(getShopsByLocation(0, 0))
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  const categories = [
    { id: "grocery", label: "Grocery" },
    { id: "pharmacy", label: "Pharmacy" },
    { id: "bakery", label: "Bakery" },
    { id: "stationery", label: "Stationery" },
    { id: "electronics", label: "Electronics" },
    { id: "dairy", label: "Dairy" },
    { id: "vegetables", label: "Vegetables" },
  ]



  const trendingProducts = mockProducts

  const quickActions = [
    { label: "Open Now", icon: "🕐", count: 28 },
  ]

  const handleShopClick = useCallback((shop: any) => {
    console.log("[v0] Shop clicked:", shop.name)
    setSelectedShop(shop)
  }, [])

  const handleContactOwner = useCallback((shop: any) => {
    alert(`Contacting ${shop.owner} at ${shop.phone}`)
  }, [])

  const handleRequestItem = useCallback((shop: any) => {
    alert(`Request item from ${shop.name}`)
  }, [])

  if (selectedShop) {
    return (
      <InstagramStyleShop
        shop={selectedShop}
        onBack={() => setSelectedShop(null)}
        onContact={() => handleContactOwner(selectedShop)}
        onRequestItem={() => handleRequestItem(selectedShop)}
        onAddToCart={addToCart}
      />
    )
  }

  if (showViewAll) {
    const items = showViewAll.type === 'products' ? mockProducts : 
                  showViewAll.type === 'open' ? mockShops.filter(s => s.isOpen) : mockShops
    
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader showNotifications>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowViewAll(null)} className="text-primary-foreground">
              ← Back
            </Button>
            <div className="text-xl font-bold text-primary-foreground">{showViewAll.title}</div>
          </div>
        </MobileHeader>

        <div className="p-4 pb-40 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {showViewAll.type === 'products' ? items.map((product: any) => (
              <Card key={product.id} className="overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4 bg-white">
                  <h4 className="font-bold text-sm mb-2 line-clamp-2">{product.name}</h4>
                  <p className="text-red-600 font-bold text-lg mb-1">₹{product.price}</p>
                  <p className="text-xs text-gray-500">{product.shopCount} shops nearby</p>
                </CardContent>
              </Card>
            )) : items.map((shop: any) => (
              <Card key={shop.id} className="overflow-hidden cursor-pointer rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" onClick={() => handleShopClick(shop)}>
                <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100">
                  <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                  {shop.isOpen && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {showViewAll.type === 'open' ? 'Open Now' : 'Open'}
                    </div>
                  )}
                </div>
                <CardContent className="p-4 bg-white">
                  <h4 className="font-bold text-sm mb-1 line-clamp-1">{shop.name}</h4>
                  <p className="text-xs text-gray-600 mb-1">{shop.category}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>📍</span>{shop.distance}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (showSearch) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader showNotifications>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowSearch(false)} className="text-primary-foreground">
              ← Back
            </Button>
            <div className="text-xl font-bold text-primary-foreground">Search Nearby</div>
          </div>
        </MobileHeader>

        <div className="p-4 pb-20">
          <RealTimeSearch />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* <ThreeDFloatingElements /> */}

      <MobileHeader showNotifications>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Image src="/locana-logo.svg" alt="Locana" width={32} height={32} className="rounded-lg" />
            <div className="text-xl font-bold text-primary-foreground">Locana</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground/10 flex items-center gap-1 px-2"
            onClick={() => setShowSearch(true)}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-xs max-w-[100px] truncate">{currentLocation}</span>
          </Button>
        </div>
      </MobileHeader>

      <div className="p-4 space-y-6 pb-40 relative z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search products, shops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearch(true)}
            className="pl-12 pr-24 h-14 rounded-2xl border-2 border-gray-100 bg-white/90 backdrop-blur-sm shadow-sm text-base"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
            <Button size="sm" variant="ghost" className="p-2 rounded-xl">
              <Mic className="w-5 h-5 text-primary" />
            </Button>
            <Button size="sm" variant="ghost" className="p-2 rounded-xl">
              <Camera className="w-5 h-5 text-primary" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Categories</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                label={category.label}
                isSelected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Trending products</h3>
            <Button variant="ghost" size="sm" className="text-primary font-semibold" onClick={() => setShowViewAll({type: 'products', title: 'Trending Products'})}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {trendingProducts.slice(0, 4).map((product) => (
              <Card key={product.id} className="overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4 bg-white">
                  <h4 className="font-bold text-sm mb-2 line-clamp-2">{product.name}</h4>
                  <p className="text-red-600 font-bold text-lg mb-1">₹{product.price}</p>
                  <p className="text-xs text-gray-500">{product.shopCount} shops nearby</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Popular near you</h3>
            <Button variant="ghost" size="sm" className="text-primary font-semibold" onClick={() => setShowViewAll({type: 'shops', title: 'Popular Near You'})}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {mockShops.slice(0, 4).map((shop) => (
              <Card key={shop.id} className="overflow-hidden cursor-pointer rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" onClick={() => handleShopClick(shop)}>
                <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100">
                  <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                  {shop.isOpen && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Open</div>
                  )}
                </div>
                <CardContent className="p-4 bg-white">
                  <h4 className="font-bold text-sm mb-1 line-clamp-1">{shop.name}</h4>
                  <p className="text-xs text-gray-600 mb-1">{shop.category}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>📍</span>{shop.distance}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Open Now</h3>
            <Button variant="ghost" size="sm" className="text-primary font-semibold" onClick={() => setShowViewAll({type: 'open', title: 'Open Now'})}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {mockShops.filter(shop => shop.isOpen).slice(0, 4).map((shop) => (
              <Card key={shop.id} className="overflow-hidden cursor-pointer rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" onClick={() => handleShopClick(shop)}>
                <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100">
                  <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Open Now</div>
                </div>
                <CardContent className="p-4 bg-white">
                  <h4 className="font-bold text-sm mb-1 line-clamp-1">{shop.name}</h4>
                  <p className="text-xs text-gray-600 mb-1">{shop.category}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>📍</span>{shop.distance}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Recent Searches</h3>
          <div className="flex flex-wrap gap-3">
            {["Paracetamol", "Bread", "Milk", "Vegetables"].map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="rounded-full border-2 h-10 px-4 font-medium bg-transparent"
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})
