import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreditCard, Truck } from "lucide-react";

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState<"cod" | "online">("cod");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    supabase.from("cart_items").select("*, product:products(id, name, price, image_url, seller_id)").eq("user_id", user.id)
      .then(({ data }) => setCartItems(data || []));
  }, [user, navigate]);

  const total = cartItems.reduce((s, i) => s + Number(i.product?.price || 0) * i.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || cartItems.length === 0) return;
    setPlacing(true);
    try {
      // Create order
      const { data: order, error: orderErr } = await supabase.from("orders").insert({
        buyer_id: user.id,
        total_amount: total,
        shipping_address: address,
        payment_mode: paymentMode,
        payment_status: paymentMode === "cod" ? "pending" : "paid",
      }).select().single();
      if (orderErr) throw orderErr;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product?.id,
        seller_id: item.product?.seller_id,
        quantity: item.quantity,
        price: item.product?.price,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      // Clear cart
      await supabase.from("cart_items").delete().eq("user_id", user.id);

      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold mb-8">Checkout</motion.h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass border-border/50">
                <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Address</Label>
                    <Input placeholder="House No, Street, City, State, PIN" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input placeholder="+91 XXXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setPaymentMode("cod")}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMode === "cod" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                      <Truck className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">Cash on Delivery</span>
                    </button>
                    <button type="button" onClick={() => setPaymentMode("online")}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMode === "online" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                      <CreditCard className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">Online Payment</span>
                    </button>
                  </div>
                  {paymentMode === "online" && (
                    <p className="text-sm text-muted-foreground mt-4">Online payment will be simulated for this prototype.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="glass border-border/50 h-fit sticky top-24">
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product?.name} x{item.quantity}</span>
                    <span>₹{(Number(item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span><span>₹{total.toLocaleString()}</span>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={placing}>
                  {placing ? "Placing Order..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
