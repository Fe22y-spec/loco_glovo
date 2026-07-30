CREATE TABLE catalogue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalogue_id text NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

INSERT INTO catalogue (catalogue_id, name, category, price) VALUES
  ('cat-meal-1', 'Pilau', 'Meals', 120),
  ('cat-meal-2', 'Pilau Beef', 'Meals', 240),
  ('cat-meal-3', 'Chapati + Beans', 'Meals', 100),
  ('cat-meal-4', 'Chapati + Ndengu', 'Meals', 100),
  ('cat-meal-5', 'Chapati + Kamande', 'Meals', 130),
  ('cat-meal-6', 'Chapati + Miji', 'Meals', 130),
  ('cat-meal-7', 'Ugali Plain', 'Meals', 50),
  ('cat-meal-8', 'Ugali + Beef', 'Meals', 200),
  ('cat-meal-9', 'Ugali + Matumbo', 'Meals', 150),
  ('cat-meal-10', 'Ugali + Greens', 'Meals', 100),
  ('cat-meal-11', 'Ugali + Cabbage', 'Meals', 100),
  ('cat-meal-12', 'Beef Stew', 'Meals', 140),
  ('cat-meal-13', 'Rice + Beef', 'Meals', 200),
  ('cat-meal-14', 'Rice + Beans', 'Meals', 100),
  ('cat-meal-15', 'Rice + Ndengu', 'Meals', 100),
  ('cat-meal-16', 'Rice + Kamande', 'Meals', 130),
  ('cat-meal-17', 'Rice + Miji', 'Meals', 130),
  ('cat-meal-18', 'Mukimo Plain', 'Meals', 90),
  ('cat-meal-19', 'Mukimo + Beef', 'Meals', 200),
  ('cat-meal-20', 'Mukimo + Stew', 'Meals', 150),
  ('cat-meal-21', 'Chicken Loaded', 'Meals', 350),
  ('cat-meal-22', 'Beef Loaded', 'Meals', 350),
  ('cat-meal-23', 'Pork Loaded', 'Meals', 350),
  ('cat-meal-24', 'Masala', 'Meals', 200),
  ('cat-snack-1', 'Chips / Fries', 'Snacks', 110),
  ('cat-snack-2', 'Smokie', 'Snacks', 40),
  ('cat-snack-3', 'Sausage', 'Snacks', 50),
  ('cat-snack-4', 'Chapati', 'Snacks', 20),
  ('cat-snack-5', 'Andazi', 'Snacks', 10),
  ('cat-drink-1', 'Tea', 'Drinks', 30),
  ('cat-drink-2', 'Juice (Small)', 'Drinks', 50),
  ('cat-drink-3', 'Juice (Large)', 'Drinks', 100);

ALTER TABLE catalogue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read catalogue" ON catalogue FOR SELECT USING (true);
CREATE POLICY "Admins can insert catalogue" ON catalogue FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update catalogue" ON catalogue FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete catalogue" ON catalogue FOR DELETE USING (auth.role() = 'authenticated');
