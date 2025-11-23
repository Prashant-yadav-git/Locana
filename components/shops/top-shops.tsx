"use client"

import { useState, useEffect } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Star, MapPin, Phone } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface TopShop {
  id: string
  name: string
  category: string
  distance: string
  isOpen: boolean
  owner: string
  phone: string
}

export function TopShops() {
  const [topShops, setTopShops] = useState<TopShop[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadTopShops()
  }, [])

  const loadTopShops = async () => {
    try {
      // Sample popular shops near you
      const sampleShops: TopShop[] = [
        {
          id: '1',
          name: 'Apollo Pharmacy',
          category: 'Pharmacy',
          distance: '0.3 km',
          isOpen: true,
          owner: 'Rajesh Kumar',
          phone: '+91 98765 43210'
        },
        {
          id: '2',
          name: 'Reliance Fresh',
          category: 'Grocery',
          distance: '0.6 km',
          isOpen: true,
          owner: 'Amit Sharma',
          phone: '+91 98765 43211'
        },
        {
          id: '3',
          name: 'Big Bazaar',
          category: 'Supermarket',
          distance: '1.1 km',
          isOpen: true,
          owner: 'Priya Singh',
          phone: '+91 98765 43212'
        },
        {
          id: '4',
          name: 'Local Kirana Store',
          category: 'Kirana',
          distance: '0.4 km',
          isOpen: true,
          owner: 'Suresh Patel',
          phone: '+91 98765 43213'
        },
        {
          id: '5',
          name: 'MedPlus',
          category: 'Pharmacy',
          distance: '0.9 km',
          isOpen: false,
          owner: 'Neha Gupta',
          phone: '+91 98765 43214'
        },
        {
          id: '6',
          name: 'More Supermarket',
          category: 'Supermarket',
          distance: '1.5 km',
          isOpen: true,
          owner: 'Vikram Reddy',
          phone: '+91 98765 43215'
        }
      ]

      setTopShops(sampleShops)
    } catch (error) {
      console.error('Error loading shops:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContactOwner = (shop: TopShop) => {
    alert(`Contacting ${shop.owner} at ${shop.phone}`)
  }

  const handleRequestItem = (shop: TopShop) => {
    alert(`Request item from ${shop.name}`)
  }

  const maxViews = Math.max(...topShops.map(s => s.views), 1)

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader>
        <div className="text-xl font-bold text-primary-foreground">Top Shops Nearby</div>
      </MobileHeader>

      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Popular near you</h3>
        </div>
        
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : topShops.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No shops found</div>
        ) : (
          <div className="space-y-4">
            {topShops.map((shop) => (
              <Card key={shop.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg">{shop.name}</h4>
                    <p className="text-sm text-gray-600">{shop.category} • {shop.distance}</p>
                  </div>
                  {shop.isOpen ? (
                    <Badge className="bg-green-600">Open</Badge>
                  ) : (
                    <Badge variant="destructive">Closed</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleContactOwner(shop)}>
                    <Phone className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRequestItem(shop)}>
                    Request
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
