import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, TrendingUp, DollarSign, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const SellerDashboard = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Product added successfully!");
    // Reset form
    setProductName("");
    setProductPrice("");
    setProductCategory("");
    setProductDescription("");
  };

  // Sample products
  const myProducts = [
    { id: 1, name: "Clay Pottery Set", price: 1200, category: "Handicrafts", status: "Active" },
    { id: 2, name: "Cotton Saree", price: 2500, category: "Textiles", status: "Active" },
    { id: 3, name: "Organic Vegetables", price: 350, category: "Produce", status: "Inactive" },
  ];

  const stats = [
    { label: "Total Products", value: "3", icon: Package, color: "text-primary" },
    { label: "Total Sales", value: "₹45,670", icon: DollarSign, color: "text-secondary" },
    { label: "This Month", value: "₹12,340", icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your products and track your sales</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat) => (
            <Card key={stat.label} className="glass border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="glass">
              <TabsTrigger value="products">My Products</TabsTrigger>
              <TabsTrigger value="add">Add Product</TabsTrigger>
            </TabsList>

            {/* My Products Tab */}
            <TabsContent value="products">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Your Products</CardTitle>
                  <CardDescription>Manage and edit your listed products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-muted-foreground">{product.category}</span>
                            <span className="text-sm font-medium text-primary">₹{product.price}</span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                product.status === "Active"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {product.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Add Product Tab */}
            <TabsContent value="add">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                  <CardDescription>List a new product for sale</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProduct} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input
                        id="product-name"
                        placeholder="Traditional Clay Pottery"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="product-price">Price (₹)</Label>
                        <Input
                          id="product-price"
                          type="number"
                          placeholder="1200"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product-category">Category</Label>
                        <Select value={productCategory} onValueChange={setProductCategory} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="handicrafts">Handicrafts</SelectItem>
                            <SelectItem value="textiles">Textiles</SelectItem>
                            <SelectItem value="produce">Produce</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-description">Description</Label>
                      <Textarea
                        id="product-description"
                        placeholder="Describe your product..."
                        rows={4}
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-image">Product Image</Label>
                      <Input id="product-image" type="file" accept="image/*" />
                    </div>

                    <Button type="submit" size="lg" className="w-full gap-2">
                      <Plus className="h-5 w-5" />
                      Add Product
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default SellerDashboard;
