"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, Minus, CheckCircle } from "lucide-react"
import { useStock } from "@/contexts/stock-context"


interface ManualUpdateModalProps {
  onClose: () => void
}

export function ManualUpdateModal({ onClose }: ManualUpdateModalProps) {
  const { addStockItem } = useStock()
  const [productName, setProductName] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)


  const handleSubmit = async () => {
    if (!productName.trim()) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/openai/stock-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productName.trim(),
          quantity,
          method: 'manual'
        })
      })
      const result = await response.json()

      if (response.ok && result.success) {
        setResult(result.message)
      } else {
        setResult(result.error || "Failed to update stock")
      }
      
      // Update both context and localStorage for immediate display
      addStockItem(productName.trim(), quantity)
      
      // Also update localStorage directly for compatibility
      const stockItem = {
        id: Date.now().toString(),
        name: productName.trim(),
        quantity,
        updatedAt: new Date().toISOString()
      }
      
      const existing = JSON.parse(localStorage.getItem('locana-stock') || '[]')
      const existingIndex = existing.findIndex((item: any) => item.name.toLowerCase() === stockItem.name.toLowerCase())
      
      if (existingIndex >= 0) {
        existing[existingIndex].quantity += quantity
        existing[existingIndex].updatedAt = stockItem.updatedAt
      } else {
        existing.push(stockItem)
      }
      
      localStorage.setItem('locana-stock', JSON.stringify(existing))
      
      // Dispatch multiple events for maximum compatibility
      window.dispatchEvent(new Event('stockUpdated'))
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'locana-stock',
        newValue: JSON.stringify(existing)
      }))
      
      setIsSuccess(true)
      setTimeout(() => {
        setProductName("")
        setQuantity(1)
        setIsSuccess(false)
      }, 1500)
    } catch (error) {
      setResult("Error updating stock")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Manual Update</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product Name</Label>
                <Input
                  id="product"
                  placeholder="e.g., Maggie, Bread, Milk"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {result && (
              <div className={`p-3 rounded-lg ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isSuccess && <CheckCircle className="w-4 h-4 text-green-600" />}
                  <p className="text-sm font-medium">Update Result:</p>
                </div>
                <p className="text-sm">{result}</p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isProcessing || !productName.trim()}
              className="w-full"
              size="lg"
            >
              {isProcessing ? "Updating..." : "Update Stock"}
            </Button>

            <div className="text-xs text-muted-foreground">
              <p>AI will check if the product exists in our database and update accordingly.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}