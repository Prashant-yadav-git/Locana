export const locationShops = {
  // PSIT Kanpur coordinates: 26.4499, 80.3319
  psit: {
    center: { lat: 26.4499, lng: 80.3319 },
    radius: 5, // km
    shops: [
      {
        id: "psit-shop",
        name: "PSIT Shop",
        category: "Stationery & Essentials",
        rating: 4.6,
        distance: "0.2 km",
        status: "Open till 10 PM",
        inStockItems: 35,
        image: "/placeholder.svg",
        isOpen: true,
        deliveryTime: "10 min",
        address: "PSIT Campus, Kanpur - 209217",
        phone: "+91 98765 43213",
        owner: "Campus Store",
        description: "Student essentials and stationery at campus",
        services: ["Campus Delivery", "Student Discounts", "Bulk Orders"],
        timings: "8:00 AM - 10:00 PM",
        items: [
          {
            id: "notebook-a4",
            name: "A4 Notebook",
            description: "200 pages ruled",
            price: 45,
            mrp: 50,
            availability: "available",
            category: "Stationery",
            image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
            likes: 28,
            isLiked: false,
          },
          {
            id: "pen-set",
            name: "Blue Pen Set",
            description: "Pack of 10 ballpoint pens",
            price: 80,
            mrp: 100,
            availability: "available",
            category: "Stationery",
            image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
            likes: 15,
            isLiked: true,
          },
          {
            id: "maggi-noodles",
            name: "Maggi Noodles",
            description: "Pack of 12",
            price: 144,
            mrp: 160,
            availability: "available",
            category: "Food",
            image: "/noodles-packet.jpg",
            likes: 42,
            isLiked: false,
          },
          {
            id: "energy-drink",
            name: "Red Bull",
            description: "250ml energy drink",
            price: 125,
            mrp: 140,
            availability: "low-stock",
            category: "Beverages",
            image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&h=400&fit=crop",
            likes: 31,
            isLiked: true,
          },
          {
            id: "calculator",
            name: "Scientific Calculator",
            description: "Casio FX-991EX",
            price: 1200,
            mrp: 1400,
            availability: "available",
            category: "Electronics",
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop",
            likes: 18,
            isLiked: false,
          },
          {
            id: "coffee-sachet",
            name: "Nescafe Coffee",
            description: "Pack of 25 sachets",
            price: 250,
            mrp: 280,
            availability: "available",
            category: "Beverages",
            image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
            likes: 24,
            isLiked: false,
          }
        ]
      }
    ]
  },
  
  // Default shops for other locations (Bangalore example)
  default: {
    shops: [
      {
        id: "raj-medical",
        name: "Raj Medical & General",
        category: "Pharmacy",
        rating: 4.5,
        distance: "0.6 km",
        status: "Open till 11 PM",
        inStockItems: 27,
        image: "/pharmacy-storefront.png",
        isOpen: true,
        deliveryTime: "15 min",
        address: "Shop 12, MG Road, Koramangala 5th Block, Bangalore - 560095",
        phone: "+91 98765 43210",
        owner: "Rajesh Kumar",
        description: "Your trusted neighborhood pharmacy with 24/7 emergency service",
        services: ["Home Delivery", "Online Consultation", "Medicine Reminder"],
        timings: "6:00 AM - 11:00 PM",
        items: [
          { id: "dolo-650", name: "Dolo 650", price: 28, availability: "available", category: "Medicine", image: "/medicine-tablet.png" },
          { id: "crocin", name: "Crocin Advance", price: 35, availability: "available", category: "Medicine", image: "/crocin-tablets.jpg" },
          { id: "vicks", name: "Vicks VapoRub", price: 89, availability: "low-stock", category: "Medicine", image: "/vicks-vaporub-bottle.jpg" },
        ],
      },
      {
        id: "mahalaxmi-kirana",
        name: "Mahalaxmi Kirana",
        category: "Grocery",
        rating: 4.2,
        distance: "1.2 km",
        status: "Open till 10 PM",
        inStockItems: 45,
        image: "/grocery-store-front.jpg",
        isOpen: true,
        deliveryTime: "20 min",
        address: "Plot 45, 1st Cross, BTM Layout, Bangalore - 560068",
        phone: "+91 87654 32109",
        owner: "Mahalaxmi Devi",
        description: "Fresh groceries and daily essentials at best prices",
        services: ["Home Delivery", "Bulk Orders", "Credit Facility"],
        timings: "7:00 AM - 10:00 PM",
        items: [
          { id: "rice-5kg", name: "Basmati Rice 5kg", price: 450, availability: "available", category: "Grocery", image: "/flour-bag.png" },
          { id: "dal-1kg", name: "Toor Dal 1kg", price: 120, availability: "available", category: "Grocery", image: "/flour-bag.png" },
          { id: "oil-1l", name: "Cooking Oil 1L", price: 180, availability: "available", category: "Grocery", image: "/flour-bag.png" },
        ],
      }
    ]
  }
}

export function getShopsByLocation(userLat: number, userLng: number) {
  console.log('🔍 Location Check:', { lat: userLat, lng: userLng })
  
  // Distance-based check FIRST (more accurate)
  const psitDistance = calculateDistance(userLat, userLng, locationShops.psit.center.lat, locationShops.psit.center.lng)
  console.log('📏 Distance from PSIT center:', psitDistance.toFixed(2), 'km')
  
  if (psitDistance <= locationShops.psit.radius) {
    console.log('✅ WITHIN PSIT RADIUS - Returning PSIT Shop')
    return locationShops.psit.shops
  }
  
  // Coordinate range check as backup
  const isPSITArea = userLat >= 26.44 && userLat <= 26.46 && userLng >= 80.32 && userLng <= 80.34
  
  if (isPSITArea) {
    console.log('✅ PSIT COORDINATE RANGE - Returning PSIT Shop')
    return locationShops.psit.shops
  }
  
  console.log('❌ OUTSIDE PSIT - Returning default shops (Raj Medical, etc.)')
  return locationShops.default.shops
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}