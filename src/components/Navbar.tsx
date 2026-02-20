import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ShoppingBag, Menu, X, ShoppingCart, User, LogOut, MessageCircle, Package, Store } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (!user) { setCartCount(0); return; }
    const fetchCartCount = async () => {
      const { count } = await supabase.from("cart_items").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      setCartCount(count || 0);
    };
    fetchCartCount();

    const channel = supabase.channel("cart-count")
      .on("postgres_changes", { event: "*", schema: "public", table: "cart_items", filter: `user_id=eq.${user.id}` }, fetchCartCount)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Fetch and subscribe to unread messages
  useEffect(() => {
    if (!user) { setUnreadMessages(0); return; }
    
    const fetchUnreadMessages = async () => {
      const { data: conversations } = await supabase.from("conversations").select("id")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
      
      if (!conversations || conversations.length === 0) {
        setUnreadMessages(0);
        return;
      }

      let totalUnread = 0;
      for (const conv of conversations) {
        const { count } = await supabase.from("messages").select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("read", false)
          .neq("sender_id", user.id);
        totalUnread += count || 0;
      }
      setUnreadMessages(totalUnread);
    };

    fetchUnreadMessages();

    // Subscribe to new messages
    const channel = supabase.channel("messages-notifications")
      .on("postgres_changes", { 
        event: "INSERT", 
        schema: "public", 
        table: "messages" 
      }, async (payload) => {
        const newMessage = payload.new as any;
        // Only count if message is not from current user
        if (newMessage.sender_id !== user.id) {
          setUnreadMessages((prev) => prev + 1);
          
          // Fetch sender name for the toast
          const { data: conv } = await supabase.from("conversations").select("buyer_id, seller_id").eq("id", newMessage.conversation_id).single();
          if (conv) {
            const otherUserId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id;
            const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", otherUserId).single();
            const senderName = profile?.full_name || "Someone";
            
            toast.success(`New message from ${senderName}`, {
              description: newMessage.content.slice(0, 50) + (newMessage.content.length > 50 ? "..." : ""),
              duration: 4000,
            });
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="gradient-primary p-2 rounded-lg group-hover:shadow-glow transition-all duration-300">
              <ShoppingBag className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              LocalBazaar
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-foreground/80"}`}>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {profile?.user_type === "buyer" && (
                  <Button asChild variant="ghost" className="relative">
                    <Link to="/cart">
                      <ShoppingCart className="h-5 w-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                )}
                <Button asChild variant="ghost" className="relative">
                  <Link to="/chat">
                    <MessageCircle className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
                        {unreadMessages > 99 ? "99+" : unreadMessages}
                      </span>
                    )}
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <User className="h-5 w-5" />
                      <span className="max-w-24 truncate">{profile?.full_name || "Account"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate("/profile")}><User className="h-4 w-4 mr-2" />Profile</DropdownMenuItem>
                    {profile?.user_type === "seller" && (
                      <DropdownMenuItem onClick={() => navigate("/seller-dashboard")}><Store className="h-4 w-4 mr-2" />Dashboard</DropdownMenuItem>
                    )}
                    {profile?.user_type === "buyer" && (
                      <DropdownMenuItem onClick={() => navigate("/orders")}><Package className="h-4 w-4 mr-2" />Orders</DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}><LogOut className="h-4 w-4 mr-2" />Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost"><Link to="/auth">Login</Link></Button>
                <Button asChild><Link to="/auth">Sell Now</Link></Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-border/50">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}
                  className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-foreground/80"}`}>
                  {link.name}
                </Link>
              ))}
              {user ? (
                <div className="pt-3 space-y-2">
                  <Button asChild variant="outline" className="w-full" onClick={() => setIsOpen(false)}><Link to="/profile">Profile</Link></Button>
                  {profile?.user_type === "buyer" && <Button asChild variant="outline" className="w-full" onClick={() => setIsOpen(false)}><Link to="/cart">Cart ({cartCount})</Link></Button>}
                  <Button asChild variant="outline" className="w-full relative" onClick={() => setIsOpen(false)}>
                    <Link to="/chat" className="flex items-center justify-between">
                      <span>Messages</span>
                      {unreadMessages > 0 && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {unreadMessages > 99 ? "99+" : unreadMessages}
                        </span>
                      )}
                    </Link>
                  </Button>
                  {profile?.user_type === "seller" && <Button asChild variant="outline" className="w-full" onClick={() => setIsOpen(false)}><Link to="/seller-dashboard">Dashboard</Link></Button>}
                  <Button variant="outline" className="w-full" onClick={() => { handleSignOut(); setIsOpen(false); }}>Sign Out</Button>
                </div>
              ) : (
                <div className="pt-3 space-y-2">
                  <Button asChild variant="outline" className="w-full"><Link to="/auth" onClick={() => setIsOpen(false)}>Login</Link></Button>
                  <Button asChild className="w-full"><Link to="/auth" onClick={() => setIsOpen(false)}>Sell Now</Link></Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
