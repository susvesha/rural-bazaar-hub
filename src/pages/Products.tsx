import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import potteryImg from "@/assets/product-pottery.jpg";
import textilesImg from "@/assets/product-textiles.jpg";
import vegetablesImg from "@/assets/product-vegetables.jpg";
import handicraftsImg from "@/assets/product-handicrafts.jpg";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Traditional Clay Pottery Set",
      price: 1200,
      image: potteryImg,
      rating: 4.8,
      seller: "Ramesh Pottery Works",
      category: "Handicrafts",
    },
    {
      id: 2,
      name: "Handwoven Cotton Saree",
      price: 2500,
      image: textilesImg,
      rating: 4.9,
      seller: "Village Weavers Collective",
      category: "Textiles",
    },
    {
      id: 3,
      name: "Organic Farm Fresh Vegetables",
      price: 350,
      image: vegetablesImg,
      rating: 4.7,
      seller: "Green Valley Farms",
      category: "Produce",
    },
    {
      id: 4,
      name: "Brass Handicraft Collection",
      price: 1800,
      image: handicraftsImg,
      rating: 4.6,
      seller: "Traditional Artisans Hub",
      category: "Handicrafts",
    },
    {
      id: 5,
      name: "Decorative Clay Pots",
      price: 800,
      image: potteryImg,
      rating: 4.5,
      seller: "Kumbhar Arts",
      category: "Handicrafts",
    },
    {
      id: 6,
      name: "Silk Blend Fabrics",
      price: 3200,
      image: textilesImg,
      rating: 4.9,
      seller: "Heritage Looms",
      category: "Textiles",
    },
    {
      id: 7,
      name: "Fresh Seasonal Produce Box",
      price: 450,
      image: vegetablesImg,
      rating: 4.8,
      seller: "Organic Harvest Co-op",
      category: "Produce",
    },
    {
      id: 8,
      name: "Wooden Carved Artifacts",
      price: 2200,
      image: handicraftsImg,
      rating: 4.7,
      seller: "Lakshmi Wood Craft",
      category: "Handicrafts",
    },
  ];

  const categories = ["all", "Handicrafts", "Textiles", "Produce"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    let matchesPrice = true;

    if (priceRange === "0-1000") {
      matchesPrice = product.price <= 1000;
    } else if (priceRange === "1000-2000") {
      matchesPrice = product.price > 1000 && product.price <= 2000;
    } else if (priceRange === "2000+") {
      matchesPrice = product.price > 2000;
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">Discover Local Products</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Browse authentic products from rural artisans, farmers, and entrepreneurs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-1000">Under ₹1,000</SelectItem>
                <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                <SelectItem value="2000+">Above ₹2,000</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span>{" "}
              products
            </p>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No products found matching your criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceRange("all");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
