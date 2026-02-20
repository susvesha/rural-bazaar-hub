import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, Package, ShoppingBag, TrendingUp, CheckCircle, XCircle } from "lucide-react";

const Admin = () => {
  const stats = [
    { label: "Total Users", value: "1,234", change: "+12%", icon: Users, color: "text-primary" },
    { label: "Total Products", value: "456", change: "+8%", icon: Package, color: "text-secondary" },
    { label: "Total Sales", value: "₹2,34,567", change: "+23%", icon: ShoppingBag, color: "text-accent" },
    { label: "Active Sellers", value: "89", change: "+5%", icon: TrendingUp, color: "text-primary" },
  ];

  const recentUsers = [
    { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com", type: "Seller", status: "Active" },
    { id: 2, name: "Priya Sharma", email: "priya@example.com", type: "Buyer", status: "Active" },
    { id: 3, name: "Amit Patel", email: "amit@example.com", type: "Seller", status: "Pending" },
  ];

  const recentProducts = [
    { id: 1, name: "Clay Pottery", seller: "Ramesh Works", status: "Approved", price: "₹1,200" },
    { id: 2, name: "Cotton Saree", seller: "Weavers Collective", status: "Approved", price: "₹2,500" },
    { id: 3, name: "Brass Artifacts", seller: "Traditional Arts", status: "Pending", price: "₹1,800" },
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
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, sellers, and product listings</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
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
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary font-medium">{stat.change}</span> from last month
                </p>
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
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="glass">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="sellers">Sellers</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted">
                              {user.type}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                user.status === "Active"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-secondary/10 text-secondary"
                              }`}
                            >
                              {user.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            {user.status === "Active" ? "Suspend" : "Approve"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Review and manage product listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-muted-foreground">By {product.seller}</span>
                            <span className="text-sm font-medium text-primary">{product.price}</span>
                            <span
                              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                product.status === "Approved"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-secondary/10 text-secondary"
                              }`}
                            >
                              {product.status === "Approved" ? (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  Approved
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3" />
                                  Pending
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          {product.status === "Pending" && (
                            <>
                              <Button size="sm">
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive">
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sellers Tab */}
            <TabsContent value="sellers">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Seller Management</CardTitle>
                  <CardDescription>Monitor and manage seller accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Seller management features coming soon...</p>
                  </div>
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

export default Admin;
