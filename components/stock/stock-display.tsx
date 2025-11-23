"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useStock } from "@/contexts/stock-context"

interface StockItem {
  id: string
  name: string
  quantity: number
  updatedAt: string
}

export function StockDisplay() {
  const { stockItems: contextItems, isLoaded } = useStock()
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshStock = () => {
    setIsRefreshing(true)
    const saved = localStorage.getItem('locana-stock')
    if (saved) {
      setStockItems(JSON.parse(saved))
    }
    setTimeout(() => setIsRefreshing(false), 500)
  }

  useEffect(() => {
    // Load from localStorage on client side only
    const saved = localStorage.getItem('locana-stock')
    if (saved) {
      setStockItems(JSON.parse(saved))
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const updated = localStorage.getItem('locana-stock')
      if (updated) {
        setStockItems(JSON.parse(updated))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('stockUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('stockUpdated', handleStorageChange)
    }
  }, [])

  // Sync with context when available
  useEffect(() => {
    if (isLoaded && contextItems.length > 0) {
      const formattedItems = contextItems.map(item => ({
        ...item,
        updatedAt: item.updatedAt.toISOString()
      }))
      setStockItems(formattedItems)
    }
  }, [contextItems, isLoaded])

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Total Stock ({stockItems.length})
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshStock}
            disabled={isRefreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {stockItems.length === 0 ? (
          <div className="text-center py-6">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-muted-foreground">No stock items added yet</p>
            <p className="text-sm text-gray-500">Use AI Stock Update to add products</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stockItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src="/placeholder.jpg"
                    alt={item.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}