-- Phase 4 analysis schema
CREATE TABLE IF NOT EXISTS analysis (
  id BIGSERIAL PRIMARY KEY,
  video_id BIGINT NOT NULL UNIQUE REFERENCES videos(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL,
  min_angle DOUBLE PRECISION,
  max_angle DOUBLE PRECISION,
  movement_score DOUBLE PRECISION,
  raw_json TEXT,
  error_code VARCHAR(100),
  error_message VARCHAR(300),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_video_id ON analysis(video_id);
