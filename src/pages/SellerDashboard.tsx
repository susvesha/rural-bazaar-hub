import { useState, useEffect, useRef, useCallback } from "react";
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
import { Plus, Package, TrendingUp, DollarSign, Edit, Trash2, Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  status: string;
  description: string;
  image_url: string;
  stock: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  status: string;
  created_at: string;
  order_id: string;
  product_id: string;
}

const SellerDashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productStock, setProductStock] = useState("10");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!loading && (!user || profile?.user_type !== "seller")) {
      navigate("/auth");
    }
  }, [user, profile, loading, navigate]);

  const fetchProducts = useCallback(async () => {
    if (!profile) return;
    const { data } = await supabase.from("products").select("*").eq("seller_id", profile.id).order("created_at", { ascending: false });
    if (data) setProducts(data as Product[]);
  }, [profile]);

  const fetchOrders = useCallback(async () => {
    if (!profile) return;
    const { data } = await supabase.from("order_items").select("*").eq("seller_id", profile.id).order("created_at", { ascending: false });
    if (data) setOrders(data as OrderItem[]);
  }, [profile]);

  useEffect(() => {
    if (profile) { fetchProducts(); fetchOrders(); }
  }, [profile, fetchProducts, fetchOrders]);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch {
      toast.error("Unable to access camera");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        closeCamera();
      }
    }, "image/jpeg", 0.9);
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);
    try {
      let imageUrl = "";
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const { error } = await supabase.from("products").insert({
        seller_id: profile.id,
        name: productName,
        price: parseFloat(productPrice),
        category: productCategory,
        description: productDescription,
        image_url: imageUrl,
        stock: parseInt(productStock) || 10,
      });
      if (error) throw error;
      toast.success("Product added successfully!");
      setProductName(""); setProductPrice(""); setProductCategory(""); setProductDescription(""); setProductStock("10");
      setImageFile(null); setImagePreview("");
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Product deleted");
    fetchProducts();
  };

  const handleUpdateStatus = async (itemId: string, status: string) => {
    await supabase.from("order_items").update({ status: status as any }).eq("id", itemId);
    toast.success("Order status updated");
    fetchOrders();
  };

  const totalSales = orders.reduce((s, o) => s + Number(o.price) * o.quantity, 0);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {profile?.full_name || "Seller"}</p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Products", value: String(products.length), icon: Package, color: "text-primary" },
            { label: "Total Sales", value: `₹${totalSales.toLocaleString()}`, icon: DollarSign, color: "text-secondary" },
            { label: "Orders", value: String(orders.length), icon: TrendingUp, color: "text-accent" },
          ].map((stat) => (
            <Card key={stat.label} className="glass border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent><div className="text-3xl font-bold">{stat.value}</div></CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="add">Add Product</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card className="glass border-border/50">
              <CardHeader><CardTitle>Your Products</CardTitle><CardDescription>{products.length} products listed</CardDescription></CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No products yet. Add your first product!</p>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          {product.image_url && <img src={product.image_url} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />}
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-muted-foreground">{product.category}</span>
                              <span className="text-sm font-medium text-primary">₹{product.price}</span>
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Stock: {product.stock}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="icon" variant="outline" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card className="glass border-border/50">
              <CardHeader><CardTitle>Add New Product</CardTitle><CardDescription>List a new product for sale</CardDescription></CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input placeholder="Traditional Clay Pottery" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Price (₹)</Label>
                      <Input type="number" placeholder="1200" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock</Label>
                      <Input type="number" placeholder="10" value={productStock} onChange={(e) => setProductStock(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={productCategory} onValueChange={setProductCategory}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
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
                    <Label>Description</Label>
                    <Textarea placeholder="Describe your product..." rows={4} value={productDescription} onChange={(e) => setProductDescription(e.target.value)} required />
                  </div>

                  {/* Image capture */}
                  <div className="space-y-2">
                    <Label>Product Image</Label>
                    {isCameraOpen ? (
                      <div className="relative rounded-xl overflow-hidden border border-border">
                        <video ref={videoRef} autoPlay playsInline className="w-full max-h-64 object-cover" />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                          <Button type="button" onClick={capturePhoto} className="gap-2"><Camera className="h-4 w-4" />Capture</Button>
                          <Button type="button" variant="outline" onClick={closeCamera}><X className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ) : imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl border border-border" />
                        <Button type="button" size="icon" variant="destructive" className="absolute top-2 right-2" onClick={() => { setImageFile(null); setImagePreview(""); }}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <Button type="button" variant="outline" className="gap-2 flex-1" onClick={openCamera}>
                          <Camera className="h-4 w-4" />Take Photo
                        </Button>
                        <label className="flex-1">
                          <Button type="button" variant="outline" className="gap-2 w-full" asChild>
                            <span><Upload className="h-4 w-4" />Upload Image</span>
                          </Button>
                          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                      </div>
                    )}
                  </div>

                  <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
                    <Plus className="h-5 w-5" />{submitting ? "Adding..." : "Add Product"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="glass border-border/50">
              <CardHeader><CardTitle>Received Orders</CardTitle><CardDescription>Manage orders for your products</CardDescription></CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No orders received yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div>
                          <p className="font-medium">Order #{item.order_id?.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity} · ₹{Number(item.price) * item.quantity}</p>
                        </div>
                        <Select defaultValue={item.status} onValueChange={(val) => handleUpdateStatus(item.id, val)}>
                          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default SellerDashboard;
