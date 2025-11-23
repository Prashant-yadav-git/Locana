export const searchableProducts = [
  // Store 1: Raj Medical & General Store
  { id: "p1", name: "Maggi 2-min Noodles", shopId: "1", shopName: "Raj Medical & General Store", price: 12, category: "Grocery", image: "/noodles-packet.jpg", stock: 150 },
  { id: "p2", name: "Dolo 650", shopId: "1", shopName: "Raj Medical & General Store", price: 28, category: "Medicine", image: "/medicine-tablet.png", stock: 80 },
  { id: "p3", name: "Paracetamol", shopId: "1", shopName: "Raj Medical & General Store", price: 25, category: "Medicine", image: "/paracetamol-tablets.png", stock: 100 },
  { id: "p4", name: "Hand Sanitizer", shopId: "1", shopName: "Raj Medical & General Store", price: 120, category: "Healthcare", image: "/hand-sanitizer-bottle.jpg", stock: 50 },
  { id: "p5", name: "Face Masks", shopId: "1", shopName: "Raj Medical & General Store", price: 50, category: "Healthcare", image: "/medical-face-masks.jpg", stock: 60 },
  { id: "p6", name: "Vicks VapoRub", shopId: "1", shopName: "Raj Medical & General Store", price: 85, category: "Medicine", image: "/vicks-vaporub-bottle.jpg", stock: 45 },
  { id: "p7", name: "Crocin Tablets", shopId: "1", shopName: "Raj Medical & General Store", price: 25, category: "Medicine", image: "/crocin-tablets.jpg", stock: 90 },
  
  // Store 2: Fresh Grocery Corner
  { id: "p8", name: "Maggi Noodles", shopId: "2", shopName: "Fresh Grocery Corner", price: 12, category: "Grocery", image: "/noodles-packet.jpg", stock: 200 },
  { id: "p9", name: "Aashirvaad Atta 5kg", shopId: "2", shopName: "Fresh Grocery Corner", price: 259, category: "Grocery", image: "/flour-bag.png", stock: 30 },
  { id: "p10", name: "Mother Dairy Milk 1L", shopId: "2", shopName: "Fresh Grocery Corner", price: 56, category: "Dairy", image: "/milk-packet.jpg", stock: 100 },
  { id: "p11", name: "Chocolate Bar", shopId: "2", shopName: "Fresh Grocery Corner", price: 45, category: "Snacks", image: "/placeholder.jpg", stock: 80 },
  { id: "p12", name: "Biscuits Pack", shopId: "2", shopName: "Fresh Grocery Corner", price: 30, category: "Snacks", image: "/placeholder.jpg", stock: 120 },
  { id: "p13", name: "Tea Powder 500g", shopId: "2", shopName: "Fresh Grocery Corner", price: 180, category: "Grocery", image: "/placeholder.jpg", stock: 50 },
  { id: "p14", name: "Sugar 1kg", shopId: "2", shopName: "Fresh Grocery Corner", price: 45, category: "Grocery", image: "/placeholder.jpg", stock: 70 },
  
  // Store 3: City Bakery
  { id: "p15", name: "Chocolate Cake", shopId: "3", shopName: "City Bakery", price: 350, category: "Bakery", image: "/placeholder.jpg", stock: 10 },
  { id: "p16", name: "Bread Loaf", shopId: "3", shopName: "City Bakery", price: 40, category: "Bakery", image: "/placeholder.jpg", stock: 50 },
  
  // Store 4: HealthPlus Pharmacy
  { id: "p17", name: "Paracetamol 500mg", shopId: "5", shopName: "HealthPlus Pharmacy", price: 20, category: "Medicine", image: "/paracetamol-tablets.png", stock: 150 },
  { id: "p18", name: "Dolo 650", shopId: "5", shopName: "HealthPlus Pharmacy", price: 30, category: "Medicine", image: "/medicine-tablet.png", stock: 100 },
  { id: "p19", name: "Hand Sanitizer", shopId: "5", shopName: "HealthPlus Pharmacy", price: 110, category: "Healthcare", image: "/hand-sanitizer-bottle.jpg", stock: 70 },
  
  // Store 5: Daily Needs Store
  { id: "p20", name: "Maggi Masala Noodles", shopId: "6", shopName: "Daily Needs Store", price: 14, category: "Grocery", image: "/noodles-packet.jpg", stock: 180 },
  { id: "p21", name: "Chocolate", shopId: "6", shopName: "Daily Needs Store", price: 50, category: "Snacks", image: "/placeholder.jpg", stock: 90 },
  { id: "p22", name: "Milk 1L", shopId: "6", shopName: "Daily Needs Store", price: 58, category: "Dairy", image: "/milk-packet.jpg", stock: 85 },
  { id: "p23", name: "Bread", shopId: "6", shopName: "Daily Needs Store", price: 35, category: "Bakery", image: "/placeholder.jpg", stock: 60 },
]

export function searchProducts(query: string) {
  if (!query) return []
  
  const lowerQuery = query.toLowerCase()
  return searchableProducts.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery)
  )
}
