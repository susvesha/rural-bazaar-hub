import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: { id: string; name: string; price: number; image_url: string; seller_id: string };
}

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("cart_items")
      .select("*, product:products(id, name, price, image_url, seller_id)")
      .eq("user_id", user.id);
    setItems((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, [user]);

  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) return removeItem(id);
    await supabase.from("cart_items").update({ quantity: qty }).eq("id", id);
    fetchCart();
  };

  const removeItem = async (id: string) => {
    await supabase.from("cart_items").delete().eq("id", id);
    toast.success("Removed from cart");
    fetchCart();
  };

  const total = items.reduce((s, i) => s + Number(i.product?.price || 0) * i.quantity, 0);

  if (!user) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Please login to view your cart</h2>
        <Button asChild><Link to="/auth">Login</Link></Button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold mb-8">Shopping Cart</motion.h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <Button asChild className="mt-4"><Link to="/products">Browse Products</Link></Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="glass border-border/50">
                  <CardContent className="flex items-center gap-4 py-4">
                    {item.product?.image_url && (
                      <img src={item.product.image_url} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product?.name}</h3>
                      <p className="text-primary font-bold">₹{item.product?.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => updateQty(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button size="icon" variant="outline" onClick={() => updateQty(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="glass border-border/50 h-fit sticky top-24">
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span className="text-primary">Free</span></div>
                <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span><span>₹{total.toLocaleString()}</span>
                </div>
                <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>Proceed to Checkout</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
