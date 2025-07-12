-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE swaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  points INTEGER DEFAULT 50,
  location TEXT,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_swaps INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  size TEXT NOT NULL,
  condition TEXT NOT NULL,
  points INTEGER NOT NULL,
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'swapped', 'redeemed')),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Swaps table
CREATE TABLE IF NOT EXISTS swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  requester_item_id UUID REFERENCES items(id) ON DELETE SET NULL,
  owner_item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  type TEXT NOT NULL CHECK (type IN ('swap', 'redeem')),
  points_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
-- Users
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Items
CREATE POLICY "Anyone can view approved items" ON items FOR SELECT USING (status = 'approved' OR user_id = auth.uid());
CREATE POLICY "Users can insert own items" ON items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own items" ON items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any item" ON items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Swaps
CREATE POLICY "Users can view own swaps" ON swaps FOR SELECT USING (
  auth.uid() = requester_id OR auth.uid() = owner_id
);
CREATE POLICY "Users can create swaps" ON swaps FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update swaps they're involved in" ON swaps FOR UPDATE USING (
  auth.uid() = requester_id OR auth.uid() = owner_id
);

-- Likes
CREATE POLICY "Users can view all likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own likes" ON likes FOR ALL USING (auth.uid() = user_id);

-- Reports
CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins can view all reports" ON reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Functions
CREATE OR REPLACE FUNCTION increment_likes(item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE items SET likes = likes + 1 WHERE id = item_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_likes(item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE items SET likes = GREATEST(likes - 1, 0) WHERE id = item_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_points(user_id UUID, points_change INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE users SET points = GREATEST(points + points_change, 0) WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_user_swaps(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE users SET total_swaps = total_swaps + 1 WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_swaps_updated_at BEFORE UPDATE ON swaps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
