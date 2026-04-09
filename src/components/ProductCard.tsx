import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image: string;
  rating?: number;
  seller: string;
  category: string;
}

const ProductCard = ({ id, name, price, image, rating, seller, category }: ProductCardProps) => {
  const { user, profile } = useAuth();

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error("Please login to add items to cart"); return; }
    if (profile?.user_type === "seller") { toast.error("Sellers cannot buy products"); return; }
    const { error } = await supabase.from("cart_items").upsert(
      { user_id: user.id, product_id: String(id), quantity: 1 },
      { onConflict: "user_id,product_id" }
    );
    if (error) toast.error("Failed to add to cart");
    else toast.success("Added to cart!");
  };

  return (
    <Link to={`/products/${id}`} className="group block">
      <div className="glass rounded-2xl overflow-hidden hover-lift cursor-pointer">
        <div className="relative h-64 overflow-hidden bg-muted">
          <img src={image || "/placeholder.svg"} alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute top-3 left-3">
            <span className="glass px-3 py-1 rounded-full text-xs font-medium capitalize">{category}</span>
          </div>
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="rounded-full shadow-lg" onClick={addToCart}>
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
            {rating && (
              <div className="flex items-center gap-1 text-secondary">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{rating}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">By {seller}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">₹{price.toLocaleString()}</span>
            <Button size="sm" variant="outline" className="rounded-full">View Details</Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
