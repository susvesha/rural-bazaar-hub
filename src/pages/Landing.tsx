import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Package, Users, TrendingUp, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-marketplace.jpg";
import potteryImg from "@/assets/product-pottery.jpg";
import textilesImg from "@/assets/product-textiles.jpg";
import vegetablesImg from "@/assets/product-vegetables.jpg";

const Landing = () => {
  const features = [
    {
      icon: Package,
      title: "Quality Products",
      description: "Authentic handmade and organic products directly from local artisans and farmers",
    },
    {
      icon: Users,
      title: "Support Local",
      description: "Every purchase directly empowers rural entrepreneurs and their families",
    },
    {
      icon: TrendingUp,
      title: "Fair Pricing",
      description: "Transparent pricing that ensures fair compensation for creators",
    },
  ];

  const categories = [
    { name: "Handicrafts", image: potteryImg, count: "150+" },
    { name: "Textiles", image: textilesImg, count: "200+" },
    { name: "Organic Produce", image: vegetablesImg, count: "300+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40 z-10" />
          <img
            src={heroImage}
            alt="Rural Marketplace"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-block glass px-4 py-2 rounded-full mb-6">
                <span className="text-sm font-medium text-primary">Empowering Rural India</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Promote Local,{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Empower Rural
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Connect with authentic artisans, farmers, and rural entrepreneurs. Discover unique
              handmade products while supporting local communities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Button asChild size="lg" variant="hero">
                <Link to="/products" className="gap-2">
                  Explore Products <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/auth" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Start Selling
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose LocalBazaar?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A platform built to celebrate and empower rural craftsmanship
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass rounded-2xl p-8 hover-lift"
              >
                <div className="gradient-primary w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Explore Categories</h2>
            <p className="text-xl text-muted-foreground">
              Browse through our curated collection of authentic products
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                <Link to="/products">
                  <div className="relative h-80">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                      <p className="text-white/80">{category.count} Products</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button asChild size="lg">
              <Link to="/products">View All Products</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 md:p-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of artisans and entrepreneurs who are transforming their local
              businesses through our platform
            </p>
            <Button asChild size="lg" variant="hero">
              <Link to="/auth" className="gap-2">
                Get Started Today <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
