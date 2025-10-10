import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, Share2, User, MapPin, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import potteryImg from "@/assets/product-pottery.jpg";

const ProductDetails = () => {
  const { id } = useParams();

  // Sample product data (in real app, fetch based on id)
  const product = {
    id: 1,
    name: "Traditional Clay Pottery Set",
    price: 1200,
    originalPrice: 1500,
    image: potteryImg,
    rating: 4.8,
    reviews: 45,
    seller: {
      name: "Ramesh Pottery Works",
      location: "Gujarat, India",
      rating: 4.9,
      products: 28,
    },
    category: "Handicrafts",
    description:
      "Beautiful handcrafted clay pottery set made by skilled artisans using traditional techniques passed down through generations. Each piece is unique and showcases the authentic craftsmanship of rural India. Perfect for home decor or gifting.",
    features: [
      "100% handmade by local artisans",
      "Eco-friendly natural clay",
      "Traditional firing techniques",
      "Set of 5 pieces",
      "Durable and long-lasting",
      "Supports rural communities",
    ],
    specifications: {
      Material: "Natural Clay",
      Origin: "Gujarat, India",
      Weight: "2.5 kg",
      Dimensions: "Various sizes in set",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/products" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-square glass">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category Badge */}
            <div className="inline-block glass px-4 py-2 rounded-full text-sm font-medium">
              {product.category}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-secondary text-secondary"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">₹{product.price}</span>
              <span className="text-xl text-muted-foreground line-through">
                ₹{product.originalPrice}
              </span>
              <span className="glass px-3 py-1 rounded-full text-sm font-semibold text-secondary">
                20% OFF
              </span>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Features */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-4">Product Features</h3>
              <ul className="grid grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Seller Info */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{product.seller.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {product.seller.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-secondary">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold">{product.seller.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{product.seller.products} products</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Seller Profile
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1 gap-2">
                <ShoppingCart className="h-5 w-5" />
                Buy Now
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold mb-6">Specifications</h2>
          <div className="glass rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="font-medium">{key}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
