import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  other_name?: string;
}

const Chat = () => {
  const { user, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get("seller");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  useEffect(() => {
    if (!user) return;
    const fetchConvs = async () => {
      const { data } = await supabase.from("conversations").select("*")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("created_at", { ascending: false });
      if (data) {
        // Fetch profile names for the other party
        const convs: Conversation[] = [];
        for (const c of data as any[]) {
          const otherId = c.buyer_id === user.id ? c.seller_id : c.buyer_id;
          const { data: p } = await supabase.from("profiles").select("full_name").eq("user_id", otherId).single();
          convs.push({ ...c, other_name: p?.full_name || "User" });
        }
        setConversations(convs);
        if (convs.length > 0 && !activeConv) setActiveConv(convs[0].id);
      }
    };
    fetchConvs();
  }, [user]);

  // Create conversation if seller param is present
  useEffect(() => {
    if (!user || !sellerId || sellerId === user.id) return;
    const createOrFindConv = async () => {
      // Check existing
      const { data: existing } = await supabase.from("conversations").select("*")
        .eq("buyer_id", user.id).eq("seller_id", sellerId).single();
      if (existing) { setActiveConv(existing.id); return; }
      const { data: newConv } = await supabase.from("conversations").insert({ buyer_id: user.id, seller_id: sellerId }).select().single();
      if (newConv) setActiveConv(newConv.id);
    };
    createOrFindConv();
  }, [user, sellerId]);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConv) return;
    const fetchMsgs = async () => {
      const { data } = await supabase.from("messages").select("*").eq("conversation_id", activeConv).order("created_at", { ascending: true });
      if (data) {
        setMessages(data as Message[]);
        // Mark all messages as read for this conversation if they're not from the current user
        const unreadMsgs = data.filter((msg: any) => !msg.read && msg.sender_id !== user?.id);
        if (unreadMsgs.length > 0) {
          await supabase.from("messages").update({ read: true })
            .eq("conversation_id", activeConv)
            .eq("read", false)
            .neq("sender_id", user?.id);
        }
      }
    };
    fetchMsgs();

    // Real-time subscription
    const channel = supabase.channel(`messages-${activeConv}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${activeConv}` },
        (payload) => { 
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
          // Show notification only if the message is from the other person
          if (newMessage.sender_id !== user?.id) {
            const sender = conversations.find(c => 
              c.id === activeConv
            )?.other_name || "Someone";
            toast.success(`New message from ${sender}`, {
              description: newMessage.content.slice(0, 50) + (newMessage.content.length > 50 ? "..." : ""),
            });
            // Mark as read immediately
            supabase.from("messages").update({ read: true }).eq("id", newMessage.id);
          }
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeConv, user?.id, conversations]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeConv || !user) return;
    try {
      await supabase.from("messages").insert({ conversation_id: activeConv, sender_id: user.id, content: newMsg.trim() });
      setNewMsg("");
      toast.success("Message sent!");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20 text-center">
        <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold">Please login to access messages</h2>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold mb-8">Messages</motion.h1>

        <div className="grid lg:grid-cols-4 gap-6" style={{ height: "calc(100vh - 280px)" }}>
          {/* Conversations sidebar */}
          <Card className="glass border-border/50 overflow-y-auto">
            <div className="p-4 space-y-2">
              <h3 className="font-semibold mb-3">Conversations</h3>
              {conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No conversations yet</p>
              ) : conversations.map((conv) => (
                <button key={conv.id} onClick={() => setActiveConv(conv.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${activeConv === conv.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"}`}>
                  <p className="font-medium text-sm">{conv.other_name}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Chat area */}
          <Card className="glass border-border/50 lg:col-span-3 flex flex-col">
            {activeConv ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${msg.sender_id === user.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        {msg.content}
                        <p className={`text-xs mt-1 opacity-70`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <form onSubmit={sendMessage} className="p-4 border-t border-border flex gap-2">
                  <Input placeholder="Type a message..." value={newMsg} onChange={(e) => setNewMsg(e.target.value)} className="flex-1" />
                  <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
