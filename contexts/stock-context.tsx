"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface StockItem {
  id: string
  name: string
  quantity: number
  image?: string
  updatedAt: Date
}

interface StockContextType {
  stockItems: StockItem[]
  addStockItem: (name: string, quantity: number, image?: string) => void
  isLoaded: boolean
}

const StockContext = createContext<StockContextType>({
  stockItems: [],
  addStockItem: () => {},
  isLoaded: false
})

export function StockProvider({ children }: { children: ReactNode }) {
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('locana-stock')
    if (saved) {
      const items = JSON.parse(saved).map((item: any) => ({
        ...item,
        updatedAt: new Date(item.updatedAt)
      }))
      setStockItems(items)
    }
    setIsLoaded(true)
  }, [])

  const addStockItem = (name: string, quantity: number, image?: string) => {
    console.log('addStockItem called with:', name, quantity, 'current items:', stockItems.length)
    const existingItem = stockItems.find(item => item.name.toLowerCase() === name.toLowerCase())
    
    let newItems: StockItem[]
    if (existingItem) {
      console.log('Updating existing item:', existingItem.name)
      newItems = stockItems.map(item => 
        item.id === existingItem.id 
          ? { ...item, quantity: item.quantity + quantity, updatedAt: new Date() }
          : item
      )
    } else {
      console.log('Adding new item:', name)
      const newItem: StockItem = {
        id: Date.now().toString(),
        name,
        quantity,
        image: image || '/placeholder.jpg',
        updatedAt: new Date()
      }
      newItems = [...stockItems, newItem]
    }
    
    console.log('New items array:', newItems)
    setStockItems(newItems)
    if (typeof window !== 'undefined') {
      localStorage.setItem('locana-stock', JSON.stringify(newItems))
      console.log('Saved to localStorage')
    }
  }

  return (
    <StockContext.Provider value={{ stockItems, addStockItem, isLoaded }}>
      {children}
    </StockContext.Provider>
  )
}

export function useStock() {
  return useContext(StockContext)
}