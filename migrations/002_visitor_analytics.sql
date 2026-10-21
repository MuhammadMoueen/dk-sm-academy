CREATE TABLE visitor_daily_counts (
  visit_date DATE PRIMARY KEY,
  visit_count BIGINT NOT NULL DEFAULT 0 CHECK (visit_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
