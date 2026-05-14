CREATE TABLE IF NOT EXISTS progress_records (
  id SERIAL,
  user_id INT NOT NULL,
  program_type VARCHAR(50) NOT NULL,
  program_id INT NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  value NUMERIC NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Composite unique constraint = the isolation key
  CONSTRAINT progress_records_unique 
    UNIQUE (user_id, program_type, program_id, metric_name)
);