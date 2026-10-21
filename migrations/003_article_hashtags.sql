ALTER TABLE articles
  ADD COLUMN hashtags TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE articles
  ADD CONSTRAINT articles_hashtags_valid
  CHECK (cardinality(hashtags) <= 10);
