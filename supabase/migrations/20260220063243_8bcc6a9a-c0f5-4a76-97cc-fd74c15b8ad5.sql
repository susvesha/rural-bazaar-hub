
-- User type enum
CREATE TYPE public.user_type AS ENUM ('seller', 'buyer');

-- App role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled');

-- Payment mode enum
CREATE TYPE public.payment_mode AS ENUM ('cod', 'online');

-- Payment status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  user_type public.user_type NOT NULL DEFAULT 'buyer',
  business_name TEXT DEFAULT '',
  business_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'other',
  image_url TEXT DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (status = 'active' OR seller_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Sellers can insert products" ON public.products FOR INSERT WITH CHECK (seller_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Sellers can update own products" ON public.products FOR UPDATE USING (seller_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Sellers can delete own products" ON public.products FOR DELETE USING (seller_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Cart items table
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_address TEXT NOT NULL DEFAULT '',
  payment_mode public.payment_mode NOT NULL DEFAULT 'cod',
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  order_status public.order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = buyer_id);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  status public.order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view own order items" ON public.order_items FOR SELECT USING (order_id IN (SELECT id FROM public.orders WHERE buyer_id = auth.uid()));
CREATE POLICY "Sellers can view their order items" ON public.order_items FOR SELECT USING (seller_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Buyers can insert order items" ON public.order_items FOR INSERT WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE buyer_id = auth.uid()));
CREATE POLICY "Sellers can update order item status" ON public.order_items FOR UPDATE USING (seller_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(buyer_id, seller_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view conversations" ON public.conversations FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT USING (
  conversation_id IN (SELECT id FROM public.conversations WHERE buyer_id = auth.uid() OR seller_id = auth.uid())
);
CREATE POLICY "Participants can send messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND conversation_id IN (SELECT id FROM public.conversations WHERE buyer_id = auth.uid() OR seller_id = auth.uid())
);
CREATE POLICY "Users can mark messages as read" ON public.messages FOR UPDATE USING (
  conversation_id IN (SELECT id FROM public.conversations WHERE buyer_id = auth.uid() OR seller_id = auth.uid())
);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
