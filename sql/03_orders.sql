CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL UNIQUE,
  customer_name text,
  customer_phone text,
  delivery_residence text,
  delivery_block text,
  delivery_room text,
  delivery_time text,
  delivery_instructions text,
  catalogue_items jsonb DEFAULT '[]'::jsonb,
  custom_items text DEFAULT '',
  special_instructions text DEFAULT '',
  subtotal numeric DEFAULT 0,
  delivery_fee numeric DEFAULT 0,
  grand_total numeric DEFAULT 0,
  order_type text NOT NULL DEFAULT 'Standard',
  payment_status text NOT NULL DEFAULT 'Awaiting Pricing',
  payment_method text,
  transaction_ref text,
  status text NOT NULL DEFAULT 'Awaiting Pricing',
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  custom_pricing jsonb,
  admin_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_payment_status ON orders (payment_status);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX idx_orders_order_type ON orders (order_type);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert orders" ON orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete orders" ON orders FOR DELETE USING (auth.role() = 'authenticated');
