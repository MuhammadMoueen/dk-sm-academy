CREATE TABLE social_provider_connections (
  provider TEXT PRIMARY KEY CHECK (provider IN ('facebook', 'tiktok', 'youtube', 'instagram')),
  account_id TEXT NOT NULL,
  account_name TEXT NOT NULL DEFAULT '',
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT,
  token_type TEXT NOT NULL DEFAULT 'Bearer',
  scopes TEXT[] NOT NULL DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'connected'
    CHECK (status IN ('connected', 'expired', 'error', 'revoked')),
  last_error TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE social_metric_snapshots (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  provider TEXT NOT NULL REFERENCES social_provider_connections(provider) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  metric_date DATE NOT NULL,
  metric_count BIGINT NOT NULL CHECK (metric_count >= 0),
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, account_id, metric_date)
);
CREATE INDEX social_metric_snapshots_lookup_idx
  ON social_metric_snapshots(provider, account_id, metric_date DESC);
