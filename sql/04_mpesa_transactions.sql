CREATE TABLE mpesa_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checkout_request_id text,
  merchant_request_id text,
  phone text,
  amount numeric,
  order_ref text,
  order_id uuid REFERENCES orders(id),
  result_code integer,
  result_desc text,
  mpesa_receipt_number text,
  transaction_date text,
  callback_data jsonb,
  status text NOT NULL DEFAULT 'initiated',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mpesa_checkout ON mpesa_transactions (checkout_request_id);
CREATE INDEX idx_mpesa_order ON mpesa_transactions (order_id);

ALTER TABLE mpesa_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert transactions" ON mpesa_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read transactions" ON mpesa_transactions FOR SELECT USING (auth.role() = 'authenticated');
