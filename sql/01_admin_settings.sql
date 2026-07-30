CREATE TABLE admin_settings (
  id bigint PRIMARY KEY DEFAULT 1,
  delivery_fee numeric NOT NULL DEFAULT 50,
  contact_phone text NOT NULL DEFAULT '+254 763 377 229',
  contact_email text NOT NULL DEFAULT 'hello@locoglovo.co.ke',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT one_row CHECK (id = 1)
);
INSERT INTO admin_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read settings" ON admin_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update settings" ON admin_settings FOR UPDATE USING (auth.role() = 'authenticated');
