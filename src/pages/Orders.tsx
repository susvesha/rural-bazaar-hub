import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
  confirmed: { color: "bg-blue-100 text-blue-800", icon: Package, label: "Confirmed" },
  shipped: { color: "bg-purple-100 text-purple-800", icon: Truck, label: "Shipped" },
  out_for_delivery: { color: "bg-orange-100 text-orange-800", icon: Truck, label: "Out for Delivery" },
  delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Delivered" },
  cancelled: { color: "bg-red-100 text-red-800", icon: Clock, label: "Cancelled" },
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items:order_items(*, product:products(name, image_url))")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });
      setOrders(data || []);
    };
    fetchOrders();
  }, [user]);

  const getStatusInfo = (status: string) => statusConfig[status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold mb-8">My Orders</motion.h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const info = getStatusInfo(order.order_status);
              const StatusIcon = info.icon;
              return (
                <Card key={order.id} className="glass border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <Badge className={info.color}><StatusIcon className="h-3 w-3 mr-1" />{info.label}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4">
                          {item.product?.image_url && (
                            <img src={item.product.image_url} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.product?.name || "Product"}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-medium">₹{(Number(item.price) * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Payment: {order.payment_mode === "cod" ? "Cash on Delivery" : "Online"}</p>
                        <p className="text-sm text-muted-foreground">Address: {order.shipping_address}</p>
                      </div>
                      <p className="text-xl font-bold">₹{Number(order.total_amount).toLocaleString()}</p>
                    </div>

                    {/* Order Tracking */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold mb-3">Order Tracking</h4>
                      <div className="flex items-center gap-2">
                        {["pending", "confirmed", "shipped", "out_for_delivery", "delivered"].map((step, i) => {
                          const steps = ["pending", "confirmed", "shipped", "out_for_delivery", "delivered"];
                          const currentIdx = steps.indexOf(order.order_status);
                          const isActive = i <= currentIdx;
                          return (
                            <div key={step} className="flex items-center gap-2 flex-1">
                              <div className={`w-3 h-3 rounded-full ${isActive ? "bg-primary" : "bg-muted"}`} />
                              {i < 4 && <div className={`h-0.5 flex-1 ${isActive && i < currentIdx ? "bg-primary" : "bg-muted"}`} />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Placed</span><span>Confirmed</span><span>Shipped</span><span>Out</span><span>Delivered</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
