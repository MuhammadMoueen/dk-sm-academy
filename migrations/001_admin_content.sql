CREATE TABLE admin_accounts (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_sessions (
  token_hash CHAR(64) PRIMARY KEY,
  admin_id SMALLINT NOT NULL REFERENCES admin_accounts(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX admin_sessions_expires_at_idx ON admin_sessions(expires_at);

CREATE TABLE admin_login_attempts (
  bucket_hash CHAR(64) PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  window_started_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 180),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt TEXT NOT NULL CHECK (char_length(excerpt) BETWEEN 1 AND 500),
  content JSONB NOT NULL DEFAULT '[]'::jsonb
    CHECK (jsonb_typeof(content) = 'array'),
  thumbnail_url TEXT NOT NULL DEFAULT '',
  category TEXT,
  display_order INTEGER CHECK (display_order IS NULL OR display_order >= 0),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX articles_status_order_idx
  ON articles(status, display_order, published_at DESC);

CREATE TABLE portfolio_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL CHECK (char_length(client_name) BETWEEN 1 AND 120),
  client_image_url TEXT NOT NULL DEFAULT '',
  transaction_image_url TEXT NOT NULL DEFAULT '',
  review TEXT NOT NULL CHECK (char_length(review) BETWEEN 1 AND 3000),
  rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0
    CHECK (rating >= 1.0 AND rating <= 5.0 AND rating * 2 = trunc(rating * 2)),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX portfolio_reviews_status_created_idx
  ON portfolio_reviews(status, created_at DESC);

CREATE TABLE admin_activity (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id SMALLINT NOT NULL REFERENCES admin_accounts(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('article', 'portfolio')),
  entity_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'published', 'unpublished', 'deleted')),
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX admin_activity_created_at_idx
  ON admin_activity(created_at DESC);
