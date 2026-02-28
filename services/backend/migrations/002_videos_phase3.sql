-- Phase 3 videos schema
CREATE TABLE IF NOT EXISTS videos (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cloud_url VARCHAR(1024) NOT NULL,
  cloud_public_id VARCHAR(512) NOT NULL UNIQUE,
  duration_seconds INTEGER NOT NULL,
  content_type VARCHAR(100) NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
