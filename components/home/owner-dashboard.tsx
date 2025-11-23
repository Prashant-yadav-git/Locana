"use client"

import { useState, useEffect } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Package, TrendingUp, ShoppingBag, Plus, Edit, Trash2, Store, BarChart3, Clock, CheckCircle, XCircle, Camera, Search, AlertCircle, Users, Eye, MapPin, Settings, LogOut, User, Receipt } from "lucide-react"
import { GenerateBill } from "@/components/billing/generate-bill"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { StockDisplay } from "@/components/stock/stock-display"

function OwnerDashboardContent() {
  const [activeView, setActiveView] = useState<'dashboard' | 'products' | 'stock-update' | 'add-product' | 'analytics' | 'stock-analysis' | 'out-of-stock' | 'low-stock' | 'profile' | 'account-settings' | 'generate-bill'>('dashboard')
  const [products, setProducts] = useState<any[]>([])
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '', stock: 'available' })
  const [shopName, setShopName] = useState('My Shop')
  const [shopOpen, setShopOpen] = useState(true)
  const [currentDate, setCurrentDate] = useState('')
  const [searchAnalytics, setSearchAnalytics] = useState<any[]>([])
  const [shopProfile, setShopProfile] = useState({ name: 'My Shop', category: '', phone: '', address: '', openTime: '', closeTime: '', image: '', latitude: 0, longitude: 0 })
  const [detectingLocation, setDetectingLocation] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }))
    loadShopProfile()
    setProducts([
      { id: 1, name: 'Dolo 650', price: 28, stock: 'available', category: 'Medicine', lastUpdated: '2 hours ago', searches: 15 },
      { id: 2, name: 'Hand Sanitizer', price: 120, stock: 'low', category: 'Hygiene', lastUpdated: '5 hours ago', searches: 8 },
      { id: 3, name: 'Face Mask Pack', price: 250, stock: 'out', category: 'Hygiene', lastUpdated: '1 day ago', searches: 12 },
      { id: 4, name: 'Paracetamol', price: 15, stock: 'available', category: 'Medicine', lastUpdated: '1 hour ago', searches: 22 },
    ])
    setSearchAnalytics([
      { product: 'Dolo 650', searches: 15, inStock: true },
      { product: 'Vicks Vaporub', searches: 12, inStock: false },
      { product: 'Colgate Toothpaste', searches: 10, inStock: true },
      { product: 'Maggi Noodles', searches: 8, inStock: false },
    ])
  }, [])

  const loadShopProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: shop } = await supabase.from('shops').select('*').eq('owner_id', user.id).single()
      if (shop) {
        setShopProfile({
          name: shop.name || 'My Shop',
          category: shop.category || '',
          phone: shop.phone || '',
          address: shop.address || '',
          openTime: '',
          closeTime: '',
          image: shop.image_url || '',
          latitude: shop.latitude || 0,
          longitude: shop.longitude || 0
        })
        setShopName(shop.name || 'My Shop')
      }
    }
  }

  const detectLocation = () => {
    setDetectingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            const data = await response.json()
            const address = data.display_name || `${lat}, ${lng}`
            
            setShopProfile(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng,
              address: address
            }))
            alert('Location detected successfully!')
          } catch (error) {
            setShopProfile(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng
            }))
            alert('Location detected!')
          }
          setDetectingLocation(false)
        },
        (error) => {
          alert('Unable to detect location. Please enable location access.')
          setDetectingLocation(false)
        }
      )
    } else {
      alert('Geolocation is not supported by your browser')
      setDetectingLocation(false)
    }
  }

  const handleSaveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: existingShop } = await supabase.from('shops').select('id').eq('owner_id', user.id).single()

    if (existingShop) {
      const { error } = await supabase.from('shops').update({
        name: shopProfile.name,
        category: shopProfile.category,
        phone: shopProfile.phone,
        address: shopProfile.address,
        image_url: shopProfile.image,
        latitude: shopProfile.latitude,
        longitude: shopProfile.longitude
      }).eq('owner_id', user.id)

      if (error) {
        alert('Error saving: ' + error.message)
      } else {
        setShopName(shopProfile.name)
        alert('Shop settings saved successfully!')
      }
    } else {
      const { error } = await supabase.from('shops').insert({
        owner_id: user.id,
        name: shopProfile.name,
        category: shopProfile.category,
        phone: shopProfile.phone,
        address: shopProfile.address,
        image_url: shopProfile.image,
        latitude: shopProfile.latitude,
        longitude: shopProfile.longitude
      })

      if (error) {
        alert('Error creating shop: ' + error.message)
      } else {
        setShopName(shopProfile.name)
        alert('Shop created successfully!')
      }
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Please fill required fields')
      return
    }
    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: newProduct.stock,
      category: newProduct.category,
      lastUpdated: 'Just now',
      searches: 0
    }
    setProducts([...products, product])
    setNewProduct({ name: '', price: '', description: '', category: '', stock: 'available' })
    setActiveView('stock-update')
    alert('Product added successfully!')
  }

  const handleStockUpdate = (id: number, status: 'available' | 'low' | 'out') => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: status, lastUpdated: 'Just now' } : p))
  }

  const handleDeleteProduct = (id: number) => {
    if (confirm('Delete this product?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await supabase.auth.signOut()
      window.location.href = '/'
    }
  }

  if (activeView === 'dashboard') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader>
          <div className="flex items-center justify-between w-full px-1">
            <div className="flex-1">
              <div className="text-xl font-bold text-primary-foreground">{shopName}</div>
              <div className="text-xs text-primary-foreground/80">{currentDate}</div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={shopOpen} onCheckedChange={setShopOpen} />
              <span className="text-xs text-primary-foreground">{shopOpen ? 'Open' : 'Closed'}</span>
            </div>
          </div>
        </MobileHeader>

        <div className="p-4 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-24 flex-col gap-2 bg-[#E23744] hover:bg-[#E23744]/90" onClick={() => window.location.href = '/ai-stock'}>
                  <Package className="w-6 h-6" />
                  <span>Update Stock</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 bg-transparent" onClick={() => setActiveView('generate-bill')}>
                  <Receipt className="w-6 h-6" />
                  <span>Generate Bill</span>
                </Button>
              </div>
            </CardContent>
          </Card>



          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Out of Stock (3)
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveView('out-of-stock')}>
                  Show All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium">Face Mask Pack</span>
                  <Badge variant="destructive" className="text-xs">Out</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium">Antiseptic Liquid</span>
                  <Badge variant="destructive" className="text-xs">Out</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Low Stock (3)
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveView('low-stock')}>
                  Show All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium">Hand Sanitizer</span>
                  <Badge className="bg-orange-600 text-xs">3 left</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium">Thermometer</span>
                  <Badge className="bg-orange-600 text-xs">2 left</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <StockDisplay />

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Today's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Search className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">15 customers searched for Dolo 650</p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Your shop views increased by 23%</p>
                    <p className="text-xs text-gray-600">Keep your stock updated!</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors" onClick={() => setActiveView('analytics')}>
                  <BarChart3 className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">View Performance Analytics</p>
                    <p className="text-xs text-gray-600">Check sales trends and insights</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }



  if (activeView === 'stock-update') {
    // Redirect to AI Stock Update page
    if (typeof window !== 'undefined') {
      window.location.href = '/ai-stock'
    }
    return null
  }

  if (activeView === 'add-product') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader showBack onBack={() => setActiveView('dashboard')}>
          <div className="text-xl font-bold text-primary-foreground">Add Product</div>
        </MobileHeader>

        <div className="p-4 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <Button variant="outline" className="w-full h-32 flex-col gap-2 bg-transparent border-dashed border-2">
                <Camera className="w-8 h-8 text-gray-400" />
                <span className="text-sm">Take Photo of Product</span>
                <span className="text-xs text-gray-500">AI will extract details</span>
              </Button>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">OR</div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="Enter product name" />
              </div>

              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input id="price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="0" />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} placeholder="e.g., Medicine, Grocery" />
              </div>

              <div>
                <Label>Stock Status *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button 
                    type="button"
                    size="sm" 
                    variant={newProduct.stock === 'available' ? 'default' : 'outline'}
                    className={newProduct.stock === 'available' ? 'bg-green-600' : 'bg-transparent'}
                    onClick={() => setNewProduct({...newProduct, stock: 'available'})}
                  >
                    Available
                  </Button>
                  <Button 
                    type="button"
                    size="sm" 
                    variant={newProduct.stock === 'low' ? 'default' : 'outline'}
                    className={newProduct.stock === 'low' ? 'bg-orange-600' : 'bg-transparent'}
                    onClick={() => setNewProduct({...newProduct, stock: 'low'})}
                  >
                    Low
                  </Button>
                  <Button 
                    type="button"
                    size="sm" 
                    variant={newProduct.stock === 'out' ? 'default' : 'outline'}
                    className={newProduct.stock === 'out' ? 'bg-red-600' : 'bg-transparent'}
                    onClick={() => setNewProduct({...newProduct, stock: 'out'})}
                  >
                    Out
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="Product description" rows={3} />
              </div>

              <Button className="w-full bg-[#E23744] hover:bg-[#E23744]/90" onClick={handleAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeView === 'out-of-stock') {
    const outOfStockProducts = [
      { name: 'Face Mask Pack', lastSold: '2 days ago', demand: 'High' },
      { name: 'Antiseptic Liquid', lastSold: '1 day ago', demand: 'Medium' },
      { name: 'Cotton Bandage', lastSold: '3 days ago', demand: 'Low' }
    ]

    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader showBack onBack={() => setActiveView('dashboard')}>
          <div className="text-xl font-bold text-primary-foreground">Out of Stock</div>
        </MobileHeader>

        <div className="p-4 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              {outOfStockProducts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">All products are in stock!</p>
              ) : (
                <div className="space-y-3">
                  {outOfStockProducts.map((item, idx) => (
                    <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-red-900">{item.name}</p>
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last sold: {item.lastSold}</span>
                        <span className="text-red-600 font-medium">Demand: {item.demand}</span>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => window.location.href = '/ai-stock'}>
                    <Package className="w-4 h-4 mr-2" />
                    Restock Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeView === 'low-stock') {
    const lowStockProducts = [
      { name: 'Hand Sanitizer', stock: 3, reorderLevel: 10, demand: 'High' },
      { name: 'Thermometer', stock: 2, reorderLevel: 5, demand: 'Medium' },
      { name: 'Glucose Powder', stock: 4, reorderLevel: 8, demand: 'Medium' }
    ]

    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader showBack onBack={() => setActiveView('dashboard')}>
          <div className="text-xl font-bold text-primary-foreground">Low Stock</div>
        </MobileHeader>

        <div className="p-4 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No low stock items</p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((item, idx) => (
                    <div key={idx} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{item.name}</p>
                        <Badge className="bg-orange-600">Low Stock</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current: {item.stock} units</span>
                        <span className="text-orange-600">Reorder at: {item.reorderLevel}</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full" 
                            style={{ width: `${(item.stock / item.reorderLevel) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => window.location.href = '/ai-stock'}>
                    <Package className="w-4 h-4 mr-2" />
                    Update Stock
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeView === 'stock-analysis') {
    const outOfStockProducts = [
      { name: 'Face Mask Pack', lastSold: '2 days ago', demand: 'High' },
      { name: 'Antiseptic Liquid', lastSold: '1 day ago', demand: 'Medium' },
      { name: 'Cotton Bandage', lastSold: '3 days ago', demand: 'Low' }
    ]

    const lowStockProducts = [
      { name: 'Hand Sanitizer', stock: 3, reorderLevel: 10, demand: 'High' },
      { name: 'Thermometer', stock: 2, reorderLevel: 5, demand: 'Medium' },
      { name: 'Glucose Powder', stock: 4, reorderLevel: 8, demand: 'Medium' }
    ]

    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader showBack onBack={() => setActiveView('dashboard')}>
          <div className="text-xl font-bold text-primary-foreground">Stock Analysis</div>
        </MobileHeader>

        <div className="p-4 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Out of Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              {outOfStockProducts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">All products are in stock!</p>
              ) : (
                <div className="space-y-3">
                  {outOfStockProducts.map((item, idx) => (
                    <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-red-900">{item.name}</p>
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last sold: {item.lastSold}</span>
                        <span className="text-red-600 font-medium">Demand: {item.demand}</span>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => window.location.href = '/ai-stock'}>
                    <Package className="w-4 h-4 mr-2" />
                    Restock Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No low stock items</p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((item, idx) => (
                    <div key={idx} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{item.name}</p>
                        <Badge className="bg-orange-600">Low Stock</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current: {item.stock} units</span>
                        <span className="text-orange-600">Reorder at: {item.reorderLevel}</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full" 
                            style={{ width: `${(item.stock / item.reorderLevel) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => window.location.href = '/ai-stock'}>
                    <Package className="w-4 h-4 mr-2" />
                    Update Stock
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeView === 'analytics') {
    const topSellingProducts = [
      { name: 'Dolo 650', sold: 45, revenue: 1260, trend: '+12%' },
      { name: 'Hand Sanitizer', sold: 32, revenue: 3840, trend: '+8%' },
      { name: 'Paracetamol', sold: 28, revenue: 420, trend: '+15%' },
      { name: 'Face Mask', sold: 22, revenue: 550, trend: '+5%' }
    ]

    const slowMovingProducts = [
      { name: 'Vitamin C Tablets', daysOnShelf: 45, stock: 25, lastSold: '15 days ago' },
      { name: 'Cough Syrup', daysOnShelf: 30, stock: 12, lastSold: '10 days ago' },
      { name: 'Pain Relief Gel', daysOnShelf: 25, stock: 8, lastSold: '8 days ago' }
    ]

    const outOfStockProducts = [
      { name: 'Face Mask Pack', lastSold: '2 days ago', demand: 'High' },
      { name: 'Antiseptic Liquid', lastSold: '1 day ago', demand: 'Medium' },
      { name: 'Cotton Bandage', lastSold: '3 days ago', demand: 'Low' }
    ]

    const lowStockProducts = [
      { name: 'Hand Sanitizer', stock: 3, reorderLevel: 10, demand: 'High' },
      { name: 'Thermometer', stock: 2, reorderLevel: 5, demand: 'Medium' },
      { name: 'Glucose Powder', stock: 4, reorderLevel: 8, demand: 'Medium' }
    ]

    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader showBack onBack={() => setActiveView('dashboard')}>
          <div className="text-xl font-bold text-primary-foreground">Sales Analytics</div>
        </MobileHeader>

        <div className="p-4 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Top Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topSellingProducts.map((item, idx) => (
                  <div key={idx} className="p-3 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          #{idx + 1}
                        </div>
                        <p className="font-semibold">{item.name}</p>
                      </div>
                      <Badge className="bg-green-600">{item.trend}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sold: {item.sold} units</span>
                      <span className="font-semibold text-green-600">₹{item.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Slow Moving Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {slowMovingProducts.map((item, idx) => (
                  <div key={idx} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{item.name}</p>
                      <Badge variant="destructive">{item.daysOnShelf} days</Badge>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Stock: {item.stock} units</span>
                      <span>Last sold: {item.lastSold}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 Consider offering discounts on slow-moving items to clear inventory
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Customer Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {searchAnalytics.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{item.product}</p>
                      <p className="text-sm text-gray-600">{item.searches} searches</p>
                    </div>
                    {item.inStock ? (
                      <Badge className="bg-green-600">In Stock</Badge>
                    ) : (
                      <Badge variant="destructive">Not Available</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Revenue Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Add Vicks Vaporub</p>
                      <p className="text-xs text-gray-600">12 customers searched for this today</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Add Maggi Noodles</p>
                      <p className="text-xs text-gray-600">8 customers searched for this today</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeView === 'account-settings') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader showBack onBack={() => setActiveView('dashboard')}>
          <div className="text-xl font-bold text-primary-foreground">Account Settings</div>
        </MobileHeader>

        <div className="p-4 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input id="ownerName" placeholder="Enter your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" disabled />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Enter phone number" />
              </div>
              <Button className="w-full bg-[#E23744] hover:bg-[#E23744]/90">
                Save Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-xs text-gray-500">Receive order updates</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Alerts</p>
                  <p className="text-xs text-gray-500">Daily summary emails</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg border-red-200">
            <CardContent className="p-6">
              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeView === 'generate-bill') {
    return <GenerateBill onBack={() => setActiveView('dashboard')} />
  }

  if (activeView === 'profile') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader showBack onBack={() => setActiveView('dashboard')}>
          <div className="text-xl font-bold text-primary-foreground">Shop Settings</div>
        </MobileHeader>

        <div className="p-4 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label>Shop Image</Label>
                <div className="mt-2">
                  {shopProfile.image ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <img src={shopProfile.image} alt="Shop" className="w-full h-full object-cover" />
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="absolute top-2 right-2"
                        onClick={() => setShopProfile({...shopProfile, image: ''})}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 bg-gray-50">
                      <Camera className="w-8 h-8 text-gray-400" />
                      <Input 
                        type="text" 
                        placeholder="Paste image URL" 
                        className="max-w-xs"
                        onBlur={(e) => setShopProfile({...shopProfile, image: e.target.value})}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="shopName">Shop Name</Label>
                <Input id="shopName" value={shopProfile.name} onChange={(e) => setShopProfile({...shopProfile, name: e.target.value})} placeholder="Enter shop name" />
              </div>

              <div>
                <Label htmlFor="category">Shop Category</Label>
                <Input id="category" value={shopProfile.category} onChange={(e) => setShopProfile({...shopProfile, category: e.target.value})} placeholder="e.g., Kirana Store, Medical Shop" />
              </div>

              <div>
                <Label htmlFor="phone">Contact Number</Label>
                <Input id="phone" type="tel" value={shopProfile.phone} onChange={(e) => setShopProfile({...shopProfile, phone: e.target.value})} placeholder="Enter phone number" />
              </div>

              <div>
                <Label htmlFor="address">Shop Address</Label>
                <Textarea id="address" value={shopProfile.address} onChange={(e) => setShopProfile({...shopProfile, address: e.target.value})} placeholder="Enter complete address" rows={3} />
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full mt-2 bg-transparent" 
                  onClick={detectLocation}
                  disabled={detectingLocation}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {detectingLocation ? 'Detecting...' : 'Detect My Location'}
                </Button>
                {shopProfile.latitude !== 0 && shopProfile.longitude !== 0 && (
                  <p className="text-xs text-green-600 mt-1">✓ Location: {shopProfile.latitude.toFixed(4)}, {shopProfile.longitude.toFixed(4)}</p>
                )}
              </div>

              <div>
                <Label>Operating Hours</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input type="time" value={shopProfile.openTime} onChange={(e) => setShopProfile({...shopProfile, openTime: e.target.value})} placeholder="Opening" />
                  <Input type="time" value={shopProfile.closeTime} onChange={(e) => setShopProfile({...shopProfile, closeTime: e.target.value})} placeholder="Closing" />
                </div>
              </div>

              <Button className="w-full bg-[#E23744] hover:bg-[#E23744]/90" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Basic Information</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Shop Photos</span>
                  <XCircle className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verification Documents</span>
                  <XCircle className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}

export function OwnerDashboard() {
  return <OwnerDashboardContent />
}
