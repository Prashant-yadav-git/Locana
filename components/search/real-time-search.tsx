"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Loader2, Navigation, Star, Filter, ArrowUpDown } from "lucide-react"
import { useLocation } from "@/hooks/use-location"
import { searchNearby } from "@/lib/location-service"
import { useDebounce } from "@/hooks/use-debounce"
import { searchProducts } from "@/lib/search-data"
import { mockShops } from "@/lib/mock-data"
import Image from "next/image"

interface SearchResult {
  shops: Array<{
    id: string
    name: string
    address: string
    distance: number
    category: string
    rating?: number
    isOpen?: boolean
  }>
  products: Array<{
    id: string
    name: string
    shopName: string
    price: string
    availability: string
    distance: number
  }>
}

export function RealTimeSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult>({ shops: [], products: [] })
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const { location, error: locationError, loading: locationLoading, refetch } = useLocation()
  const debouncedQuery = useDebounce(query, 300)

  const categories = ["All", "Medical", "Grocery", "Electronics", "Bakery", "Pharmacy"]

  const performSearch = useCallback(() => {
    setIsSearching(true)
    try {
      const products = searchProducts(debouncedQuery)
      const productResults = products.map(p => ({
        id: p.id,
        name: p.name,
        shopName: p.shopName,
        price: `₹${p.price}`,
        availability: p.stock > 0 ? "In Stock" : "Out of Stock",
        distance: 0.5,
        image: p.image
      }))

      const shops = debouncedQuery ? [] : (selectedCategory && selectedCategory !== "All" 
        ? mockShops.filter(s => s.category === selectedCategory)
        : mockShops)

      setResults({ shops, products: productResults })
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }, [debouncedQuery, selectedCategory])

  useEffect(() => {
    performSearch()
  }, [performSearch])

  const handleLocationRefresh = () => {
    refetch()
  }



  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Search products, shops nearby..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-12 h-14 rounded-2xl border-2 border-gray-100 bg-white/90 backdrop-blur-sm shadow-sm text-base"
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-primary" />
        )}
      </div>

      {/* Filter and Sort Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Sort
        </Button>
      </div>

      {/* Search Results */}
      <div className="space-y-6">
        {/* Shops Results */}
        {results.shops.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Nearby Shops ({results.shops.length})</h3>
            <div className="space-y-3">
              {results.shops.map((shop) => (
                <Card key={shop.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-gray-900">{shop.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{shop.address}</p>

                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {shop.category}
                          </Badge>

                          {shop.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{shop.rating}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-600">{shop.distance}km away</span>
                          </div>

                          {shop.isOpen !== undefined && (
                            <Badge
                              variant={shop.isOpen ? "default" : "secondary"}
                              className={`text-xs ${shop.isOpen ? "bg-green-500" : "bg-gray-500"}`}
                            >
                              {shop.isOpen ? "Open" : "Closed"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products Results */}
        {results.products.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Products Found ({results.products.length})</h3>
            <div className="space-y-3">
              {results.products.map((product: any) => (
                <Card key={product.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 p-4">
                      <div className="relative w-24 h-24 flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-md">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h4>
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {product.shopName}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-2xl font-bold text-red-600">{product.price}</span>

                          <Badge
                            variant={product.availability === "In Stock" ? "default" : "secondary"}
                            className={`text-xs px-2 py-1 ${product.availability === "In Stock" ? "bg-green-500 hover:bg-green-600" : ""}`}
                          >
                            {product.availability}
                          </Badge>

                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{product.distance}km</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!isSearching && results.shops.length === 0 && results.products.length === 0 && debouncedQuery && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-600 mb-1">No results found</h3>
            <p className="text-sm text-gray-500">Try searching for different products or shops nearby</p>
          </div>
        )}
      </div>
    </div>
  )
}
