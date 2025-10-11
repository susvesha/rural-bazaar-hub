import { Link } from "react-router-dom";
import { ShoppingBag, Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="gradient-primary p-2 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LocalBazaar
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering rural entrepreneurs and artisans to showcase their products globally.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Start Selling
                </Link>
              </li>
              <li>
                <Link to="/seller-dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Seller Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@localbazaar.com"
                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 LocalBazaar. All rights reserved. Empowering rural communities.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
