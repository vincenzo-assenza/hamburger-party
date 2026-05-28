-- init-db.sql - Eseguire manualmente su Vercel Postgres console

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  oauth_id VARCHAR(255),
  is_owner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  friend_name VARCHAR(255) NOT NULL,
  ingredients JSONB,
  meat_doneness VARCHAR(20) NOT NULL CHECK (meat_doneness IN ('rare', 'medium', 'well_done')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Sample data (facoltativo)
INSERT INTO orders (friend_name, ingredients, meat_doneness) VALUES
('Marco', '{"lettuce": true, "tomato": true, "cheese": true, "fries": false}'::jsonb, 'medium'),
('Sofia', '{"lettuce": false, "tomato": true, "cheese": true, "fries": true}'::jsonb, 'rare'),
('Luca', '{"lettuce": true, "tomato": false, "cheese": true, "fries": true}'::jsonb, 'well_done')
ON CONFLICT DO NOTHING;
