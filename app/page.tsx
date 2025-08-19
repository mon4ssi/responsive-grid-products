"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, X } from "lucide-react"

enum Viewport {
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
}

type Breakpoint = keyof typeof Viewport

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  category: string
  description: string
  features: string[]
  inStock: boolean
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.5,
    reviews: 128,
    image: "/wireless-headphones.png",
    category: "Electronics",
    description:
      "Premium wireless headphones with active noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    features: ["Active Noise Cancellation", "30-hour battery", "Quick charge", "Premium sound quality"],
    inStock: true,
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    rating: 4.8,
    reviews: 89,
    image: "/fitness-smartwatch.png",
    category: "Wearables",
    description:
      "Advanced fitness tracking with heart rate monitoring, GPS, and smartphone integration. Track your health goals effortlessly.",
    features: ["Heart rate monitor", "GPS tracking", "Water resistant", "7-day battery"],
    inStock: true,
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.3,
    reviews: 67,
    image: "/ergonomic-office-chair.png",
    category: "Furniture",
    description:
      "Professional ergonomic chair designed for long work sessions. Adjustable height, lumbar support, and premium materials.",
    features: ["Lumbar support", "Adjustable height", "Breathable mesh", "5-year warranty"],
    inStock: false,
  },
  {
    id: 4,
    name: "Portable Coffee Maker",
    price: 45.99,
    rating: 4.2,
    reviews: 156,
    image: "/placeholder-h236k.png",
    category: "Kitchen",
    description:
      "Compact and portable coffee maker perfect for travel, camping, or small spaces. Brews perfect coffee anywhere.",
    features: ["Portable design", "Easy cleanup", "Multiple brew sizes", "Durable construction"],
    inStock: true,
  },
  {
    id: 5,
    name: "LED Desk Lamp",
    price: 34.99,
    rating: 4.6,
    reviews: 203,
    image: "/led-desk-lamp.png",
    category: "Lighting",
    description:
      "Modern LED desk lamp with adjustable brightness and color temperature. Perfect for work and study environments.",
    features: ["Adjustable brightness", "Color temperature control", "USB charging port", "Touch controls"],
    inStock: true,
  },
  {
    id: 6,
    name: "Wireless Charging Pad",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.1,
    reviews: 94,
    image: "/wireless-charging-pad.png",
    category: "Electronics",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.",
    features: ["Fast charging", "Qi compatible", "LED indicator", "Non-slip surface"],
    inStock: true,
  },
]

export default function ProductGrid() {
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null)
  const expandedDetailRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const handleProductClick = (productId: number) => {
    const newExpandedProduct = expandedProduct === productId ? null : productId
    setExpandedProduct(newExpandedProduct)
  }

  useEffect(() => {
    if (expandedProduct) {
      const timer = setTimeout(() => {
        const breakpoints: Breakpoint[] = ["xl", "lg", "md", "sm"]

        for (const breakpoint of breakpoints) {
          const refKey = `${expandedProduct}-${breakpoint}`
          const element = expandedDetailRefs.current[refKey]

          if (element && element.offsetParent !== null) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            })
            break
          }
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [expandedProduct])

  const shouldShowExpandedDetail = (currentIndex: number, breakpoint: Breakpoint) => {
    if (!expandedProduct) return false

    const expandedIndex = sampleProducts.findIndex((p) => p.id === expandedProduct)
    if (expandedIndex === -1) return false

    const columnsPerRow = {
      sm: 1,
      md: 2,
      lg: 3,
      xl: 4,
    }[breakpoint]

    const expandedRow = Math.floor(expandedIndex / columnsPerRow)
    const currentRow = Math.floor(currentIndex / columnsPerRow)
    const isLastInRow = (currentIndex + 1) % columnsPerRow === 0
    const isLastProduct = currentIndex === sampleProducts.length - 1

    return currentRow === expandedRow && (isLastInRow || isLastProduct)
  }

  const renderProductCard = (product: Product) => (
    <Card
      key={product.id}
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group"
      onClick={() => handleProductClick(product.id)}
    >
      <CardHeader className="pb-2">
        <div className="aspect-square relative overflow-hidden rounded-md bg-muted">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
          />
          {!product.inStock && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
          {product.originalPrice && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Sale
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Badge variant="outline" className="mb-2 text-xs">
          {product.category}
        </Badge>
        <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviews})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          className="w-full"
          disabled={!product.inStock}
          onClick={(e) => {
            e.stopPropagation()
            // Handle add to cart
          }}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  )

  const renderExpandedDetail = (product: Product, breakpoint: Breakpoint) => (
    <div
      ref={(el) => {
        expandedDetailRefs.current[`${product.id}-${breakpoint}`] = el
      }}
      className="col-span-full bg-card border rounded-lg p-6 shadow-lg animate-in slide-in-from-top-2 duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <Button variant="ghost" size="sm" onClick={() => setExpandedProduct(null)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg bg-muted"
          />
        </div>

        <div className="space-y-4">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Key Features</h3>
            <ul className="space-y-1">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" disabled={!product.inStock} size="lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Products</h1>
        <p className="text-muted-foreground">Discover our curated collection of premium products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleProducts.map((product, index) => {
          const expandedProductData = sampleProducts.find((p) => p.id === expandedProduct)

          return (
            <div key={product.id} className="contents">
              {renderProductCard(product)}

              {expandedProductData && (
                <>
                  {/* XL: 4 columns */}
                  <div className="hidden xl:contents">
                    {shouldShowExpandedDetail(index, Viewport.xl) &&
                      renderExpandedDetail(expandedProductData, Viewport.xl)}
                  </div>

                  {/* Desktop: 3 columns */}
                  <div className="hidden lg:contents xl:hidden">
                    {shouldShowExpandedDetail(index, Viewport.lg) &&
                      renderExpandedDetail(expandedProductData, Viewport.lg)}
                  </div>

                  {/* Tablet: 2 columns */}
                  <div className="hidden md:contents lg:hidden">
                    {shouldShowExpandedDetail(index, Viewport.md) &&
                      renderExpandedDetail(expandedProductData, Viewport.md)}
                  </div>

                  {/* Mobile: 1 column */}
                  <div className="contents md:hidden">
                    {shouldShowExpandedDetail(index, Viewport.sm) &&
                      renderExpandedDetail(expandedProductData, Viewport.sm)}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
