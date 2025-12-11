"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Search,
  ShoppingCart,
  Package,
  CheckCircle,
  Clock,
  ArrowRight,
  Filter,
  X,
  Minus,
  Plus
} from "lucide-react"

// Sample parts catalog data
const partsCatalog = [
  {
    id: "P001",
    sku: "ADEC-500-SEAT",
    name: "A-Dec 500 Seat Cushion",
    category: "Upholstery",
    manufacturer: "A-Dec",
    model: "500",
    price: 245.00,
    inStock: true,
    stockLevel: 12,
    description: "Premium vinyl seat cushion for A-Dec 500 series",
    image: "placeholder"
  },
  {
    id: "P002",
    sku: "PLN-XRAY-TUBE",
    name: "Planmeca X-Ray Tube",
    category: "X-Ray Parts",
    manufacturer: "Planmeca",
    model: "ProMax",
    price: 1850.00,
    inStock: true,
    stockLevel: 3,
    description: "Replacement X-ray tube for ProMax series",
    image: "placeholder"
  },
  {
    id: "P003",
    sku: "DENT-HP-BEARING",
    name: "Dentsply Handpiece Bearing Set",
    category: "Handpiece Parts",
    manufacturer: "Dentsply",
    model: "Midwest",
    price: 85.00,
    inStock: true,
    stockLevel: 25,
    description: "High-speed bearing set for Midwest handpieces",
    image: "placeholder"
  },
  {
    id: "P004",
    sku: "ADEC-500-MOTOR",
    name: "A-Dec 500 Chair Motor",
    category: "Motors",
    manufacturer: "A-Dec",
    model: "500",
    price: 425.00,
    inStock: false,
    stockLevel: 0,
    description: "Replacement motor for A-Dec 500 chair base",
    image: "placeholder"
  },
  {
    id: "P005",
    sku: "BEL-SUCT-FILTER",
    name: "Belmont Suction Filter",
    category: "Suction Parts",
    manufacturer: "Belmont",
    model: "Clesta",
    price: 45.00,
    inStock: true,
    stockLevel: 50,
    description: "Replacement filter for Belmont suction systems",
    image: "placeholder"
  },
  {
    id: "P006",
    sku: "ADEC-LIGHT-LED",
    name: "A-Dec LED Light Module",
    category: "Lighting",
    manufacturer: "A-Dec",
    model: "LED",
    price: 320.00,
    inStock: true,
    stockLevel: 8,
    description: "LED module for A-Dec overhead lights",
    image: "placeholder"
  }
]

// Sample orders data
const initialOrders = [
  {
    id: "ORD-001",
    orderDate: "2023-08-15",
    items: [
      { ...partsCatalog[0], quantity: 2 },
      { ...partsCatalog[2], quantity: 5 }
    ],
    status: "received",
    totalAmount: 915.00,
    receivedDate: "2023-08-18"
  },
  {
    id: "ORD-002",
    orderDate: "2023-08-20",
    items: [
      { ...partsCatalog[1], quantity: 1 }
    ],
    status: "pending",
    totalAmount: 1850.00,
    expectedDate: "2023-08-28"
  }
]

const categories = ["All", "Upholstery", "X-Ray Parts", "Handpiece Parts", "Motors", "Suction Parts", "Lighting"]
const manufacturers = ["All", "A-Dec", "Planmeca", "Dentsply", "Belmont", "Sirona", "KaVo"]

type Part = typeof partsCatalog[0]
type CartItem = Part & { quantity: number }

export default function PartsCatalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedManufacturer, setSelectedManufacturer] = useState("All")
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState(initialOrders)
  const [cartOpen, setCartOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("catalog")

  // Filter parts
  const filteredParts = partsCatalog.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         part.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         part.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || part.category === selectedCategory
    const matchesManufacturer = selectedManufacturer === "All" || part.manufacturer === selectedManufacturer

    return matchesSearch && matchesCategory && matchesManufacturer
  })

  // Cart functions
  const addToCart = (part: Part) => {
    const existingItem = cart.find(item => item.id === part.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === part.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...part, quantity: 1 }])
    }
  }

  const updateQuantity = (partId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === partId) {
        const newQuantity = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const removeFromCart = (partId: string) => {
    setCart(cart.filter(item => item.id !== partId))
  }

  const placeOrder = () => {
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      orderDate: new Date().toISOString().split('T')[0],
      items: cart,
      status: "pending",
      totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
    setOrders([...orders, newOrder])
    setCart([])
    setCartOpen(false)
    setActiveTab("orders")
  }

  const markAsReceived = (orderId: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const { expectedDate, ...rest } = order
        return { ...rest, status: "received", receivedDate: new Date().toISOString().split('T')[0] }
      }
      return order
    }))
  }

  const transferToInventory = (orderId: string) => {
    // In production, this would transfer items to the inventory database
    console.log("Transferring order to inventory:", orderId)
    setOrders(orders.filter(order => order.id !== orderId))
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <MainLayout
      title="Parts Catalog"
      subtitle="Search and order equipment parts"
    >
      <div className="space-y-6">
        {/* Header with Cart */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Parts Directory</h2>
            <p className="text-gray-600 mt-1">
              {filteredParts.length} part{filteredParts.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <Dialog open={cartOpen} onOpenChange={setCartOpen}>
            <DialogTrigger asChild>
              <Button className="bg-dental-blue hover:bg-dental-blue/90 relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-dental-yellow text-gray-900 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Shopping Cart ({cartCount} items)</DialogTitle>
                <DialogDescription>
                  Review your order before placing it
                </DialogDescription>
              </DialogHeader>

              {cart.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="max-h-[300px] overflow-y-auto space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.sku}</p>
                          <p className="text-sm font-semibold text-dental-blue mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-lg">Total:</span>
                      <span className="font-bold text-2xl text-dental-blue">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      className="w-full bg-dental-blue hover:bg-dental-blue/90"
                      onClick={placeOrder}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Place Order
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="catalog">
              <Search className="h-4 w-4 mr-2" />
              Catalog
            </TabsTrigger>
            <TabsTrigger value="orders" className="relative">
              <Package className="h-4 w-4 mr-2" />
              My Orders
              {orders.some(o => o.status === "received") && (
                <Badge className="ml-2 bg-green-500 text-white h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {orders.filter(o => o.status === "received").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* CATALOG TAB */}
          <TabsContent value="catalog" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-dental-blue" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <Label htmlFor="search">Search Parts</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="SKU, name, or manufacturer..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
                      <SelectTrigger id="manufacturer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {manufacturers.map(mfr => (
                          <SelectItem key={mfr} value={mfr}>{mfr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parts Grid */}
            {filteredParts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No parts found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredParts.map((part) => (
                  <Card key={part.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{part.name}</CardTitle>
                          <p className="text-sm text-gray-500">SKU: {part.sku}</p>
                        </div>
                        {part.inStock ? (
                          <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                        ) : (
                          <Badge variant="secondary">Out of Stock</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600">
                          <p><span className="font-medium">Category:</span> {part.category}</p>
                          <p><span className="font-medium">Manufacturer:</span> {part.manufacturer}</p>
                          <p><span className="font-medium">Model:</span> {part.model}</p>
                          <p><span className="font-medium">Stock:</span> {part.stockLevel} units</p>
                        </div>

                        <p className="text-sm text-gray-600">{part.description}</p>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-2xl font-bold text-dental-blue">
                            ${part.price.toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            className="bg-dental-blue hover:bg-dental-blue/90"
                            onClick={() => addToCart(part)}
                            disabled={!part.inStock}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders" className="space-y-6">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-4">Start shopping in the catalog to place your first order</p>
                  <Button onClick={() => setActiveTab("catalog")} className="bg-dental-blue hover:bg-dental-blue/90">
                    Browse Catalog
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order {order.id}</CardTitle>
                          <p className="text-sm text-gray-500">Placed on {order.orderDate}</p>
                        </div>
                        {order.status === "received" ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Received
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Order Items */}
                        <div className="border rounded-lg p-4 space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-gray-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Order Total */}
                        <div className="flex justify-between items-center border-t pt-4">
                          <span className="font-semibold">Total Amount:</span>
                          <span className="text-xl font-bold text-dental-blue">${order.totalAmount.toFixed(2)}</span>
                        </div>

                        {/* Expected/Received Date */}
                        {order.status === "received" ? (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Received on:</span> {order.receivedDate}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Expected by:</span> {order.expectedDate}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-2 pt-2">
                          {order.status === "pending" ? (
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => markAsReceived(order.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Received
                            </Button>
                          ) : (
                            <Button
                              className="flex-1 bg-dental-blue hover:bg-dental-blue/90"
                              onClick={() => transferToInventory(order.id)}
                            >
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Transfer to Personal Inventory
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
