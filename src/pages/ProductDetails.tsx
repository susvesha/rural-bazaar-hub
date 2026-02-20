import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, Share2, User, MapPin, ArrowLeft, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from("products")
        .select("*, seller:profiles!seller_id(id, full_name, business_name, address, user_id)")
        .eq("id", id)
        .single();
      setProduct(data);
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!user) { toast.error("Please login first"); navigate("/auth"); return; }
    if (profile?.user_type === "seller") { toast.error("Sellers cannot buy products"); return; }
    const { error } = await supabase.from("cart_items").upsert(
      { user_id: user.id, product_id: id!, quantity: 1 },
      { onConflict: "user_id,product_id" }
    );
    if (error) toast.error("Failed to add to cart");
    else toast.success("Added to cart!");
  };

  const buyNow = async () => {
    await addToCart();
    navigate("/cart");
  };

  const contactSeller = () => {
    if (!user) { navigate("/auth"); return; }
    navigate(`/chat?seller=${product?.seller?.user_id}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div><Footer /></div>
  );

  if (!product) return (
    <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-bold">Product not found</h2><Button asChild className="mt-4"><Link to="/products">Browse Products</Link></Button></div><Footer /></div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/products" className="gap-2"><ArrowLeft className="h-4 w-4" />Back to Products</Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative rounded-2xl overflow-hidden aspect-square glass">
              <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="inline-block glass px-4 py-2 rounded-full text-sm font-medium capitalize">{product.category}</div>
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">₹{Number(product.price).toLocaleString()}</span>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
            <p className="text-sm text-muted-foreground">Stock: {product.stock} available</p>

            {/* Seller Info */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{product.seller?.business_name || product.seller?.full_name || "Local Seller"}</h3>
                  {product.seller?.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />{product.seller.address}
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={contactSeller}>
                <MessageCircle className="h-4 w-4" />Contact Seller
              </Button>
            </div>

            <div className="flex gap-3">
              <Button size="lg" className="flex-1 gap-2" onClick={buyNow}>
                <ShoppingCart className="h-5 w-5" />Buy Now
              </Button>
              <Button size="lg" variant="outline" onClick={addToCart}>Add to Cart</Button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
