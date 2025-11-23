"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MobileHeader } from "@/components/ui/mobile-header"
import { ArrowLeft, Plus, Minus, Trash2, Receipt } from "lucide-react"

interface BillItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface GenerateBillProps {
  onBack: () => void
}

export function GenerateBill({ onBack }: GenerateBillProps) {
  const [stockItems, setStockItems] = useState<any[]>([])
  const [billItems, setBillItems] = useState<BillItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [selectedItem, setSelectedItem] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [itemQuantity, setItemQuantity] = useState(1)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('locana-stock')
    if (saved) {
      setStockItems(JSON.parse(saved))
    }
  }, [])

  const addItemToBill = () => {
    if (!selectedItem || !itemPrice) return

    const newItem: BillItem = {
      id: Date.now().toString(),
      name: selectedItem,
      quantity: itemQuantity,
      price: parseFloat(itemPrice)
    }

    setBillItems([...billItems, newItem])
    setSelectedItem("")
    setItemPrice("")
    setItemQuantity(1)
  }

  const removeItem = (id: string) => {
    setBillItems(billItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, delta: number) => {
    setBillItems(billItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ))
  }

  const calculateTotal = () => {
    return billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const generateBill = async () => {
    if (!customerPhone) {
      alert('Please enter customer phone number')
      return
    }

    setIsSending(true)

    const bill = {
      customerName: customerName || "Customer",
      customerPhone,
      items: billItems,
      total: calculateTotal(),
      date: new Date().toLocaleString()
    }

    // Create SMS message
    const itemsList = bill.items.map(item => 
      `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')
    
    const smsMessage = `Invoice from Locana\nCustomer: ${bill.customerName}\nDate: ${bill.date}\n\nItems:\n${itemsList}\n\nTotal: ₹${bill.total.toFixed(2)}\n\nThank you for shopping with us!`

    // Use Web Share API or SMS link
    if (navigator.share) {
      try {
        await navigator.share({
          text: smsMessage
        })
        alert('Bill sent successfully!')
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback to SMS link
      const smsLink = `sms:${customerPhone}?body=${encodeURIComponent(smsMessage)}`
      window.location.href = smsLink
      alert('Opening SMS app...')
    }

    setBillItems([])
    setCustomerName("")
    setCustomerPhone("")
    setIsSending(false)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader showBack onBack={onBack}>
        <div className="text-xl font-bold text-primary-foreground">Generate Bill</div>
      </MobileHeader>

      <div className="p-4 space-y-4">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Customer Phone Number *</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Add Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                placeholder="Enter item name"
              />
            </div>

            <div>
              <Label htmlFor="itemPrice">Price (₹)</Label>
              <Input
                id="itemPrice"
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <Label>Quantity</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center w-20"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setItemQuantity(itemQuantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={addItemToBill}
              disabled={!selectedItem || !itemPrice}
              className="w-full bg-[#E23744] hover:bg-[#E23744]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Bill
            </Button>
          </CardContent>
        </Card>

        {billItems.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Bill Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {billItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={generateBill}
                disabled={isSending || !customerPhone}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Receipt className="w-5 h-5 mr-2" />
                {isSending ? 'Sending...' : 'Send Bill via SMS'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}