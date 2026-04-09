import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsSent(true);
      toast.success("Password reset link sent to your email!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="gradient-primary p-3 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              LocalBazaar
            </span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
            <p className="text-muted-foreground">
              {isSent 
                ? "Check your email for the reset link." 
                : "No worries! Enter your email and we'll send you a reset link."}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth">Back to Login</Link>
            </Button>
          )}

          <div className="mt-8 text-center">
            <Link to="/auth" className="text-sm font-medium text-primary hover:underline flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
