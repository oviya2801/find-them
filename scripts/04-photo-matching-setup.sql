-- Enable vector extension for similarity search (if using pgvector)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- Update photo_embeddings table to use proper vector type
-- In production, you would use pgvector extension for efficient similarity search
ALTER TABLE photo_embeddings 
ALTER COLUMN embedding TYPE TEXT; -- Store as JSON string for demo

-- Add indexes for photo matching performance
CREATE INDEX IF NOT EXISTS idx_photo_embeddings_case_id ON photo_embeddings(case_id);

-- Add photo matching logs table
CREATE TABLE IF NOT EXISTS photo_match_logs (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255),
  uploaded_photo_hash VARCHAR(255),
  matches_found INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photo_match_logs_created_at ON photo_match_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_photo_match_logs_session_id ON photo_match_logs(session_id);

-- Add photo matching statistics view
CREATE OR REPLACE VIEW photo_match_stats AS
SELECT 
  DATE(created_at) as match_date,
  COUNT(*) as total_searches,
  AVG(matches_found) as avg_matches_per_search,
  AVG(processing_time_ms) as avg_processing_time_ms
FROM photo_match_logs
GROUP BY DATE(created_at)
ORDER BY match_date DESC;

-- Sample photo embeddings for demo cases
INSERT INTO photo_embeddings (case_id, photo_url, embedding) VALUES
(1, '/placeholder.svg?height=300&width=300', '{"embedding": "mock_embedding_data_1"}'),
(2, '/placeholder.svg?height=300&width=300', '{"embedding": "mock_embedding_data_2"}'),
(3, '/placeholder.svg?height=300&width=300', '{"embedding": "mock_embedding_data_3"}')
ON CONFLICT DO NOTHING;
