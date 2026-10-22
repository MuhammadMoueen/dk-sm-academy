ALTER TABLE articles
  ADD COLUMN article_link TEXT;

ALTER TABLE articles
  ADD CONSTRAINT articles_article_link_safe
  CHECK (
    article_link IS NULL OR
    article_link ~* '^https?://[^\s]+$'
  );
