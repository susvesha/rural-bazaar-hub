import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  seller: string;
  category: string;
}

const ProductCard = ({ id, name, price, image, rating, seller, category }: ProductCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative glass rounded-2xl overflow-hidden hover-lift"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="glass px-3 py-1 text-xs font-medium rounded-full">
            {category}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <Button size="icon" variant="secondary" className="rounded-full" asChild>
            <Link to={`/products/${id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-secondary">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">By {seller}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">₹{price}</span>
          </div>
          <Button size="sm" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Buy Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
