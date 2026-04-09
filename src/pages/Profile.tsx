import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDesc, setBusinessDesc] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
      setBusinessName(profile.business_name || "");
      setBusinessDesc(profile.business_description || "");
    }
  }, [user, profile, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: fullName,
      phone,
      address,
      business_name: businessName,
      business_description: businessDesc,
    }).eq("user_id", user.id);
    if (error) toast.error("Failed to save");
    else { toast.success("Profile updated!"); refreshProfile(); }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold mb-8">My Profile</motion.h1>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{fullName || "User"}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">{profile?.user_type || "buyer"} Account</p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input className="pl-10" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input className="pl-10" value={user?.email || ""} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input className="pl-10" placeholder="+91 XXXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Your address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>
              {profile?.user_type === "seller" && (
                <>
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input placeholder="Your business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Description</Label>
                    <Textarea placeholder="Tell buyers about your business" value={businessDesc} onChange={(e) => setBusinessDesc(e.target.value)} rows={3} />
                  </div>
                </>
              )}
              <Button type="submit" className="w-full gap-2" disabled={saving}>
                <Save className="h-4 w-4" />{saving ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
