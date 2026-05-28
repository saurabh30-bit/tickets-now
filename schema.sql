-- 1. Create the Seats table
CREATE TABLE seats (
  id INTEGER PRIMARY KEY,
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
  locked_at TIMESTAMP WITH TIME ZONE,
  session_id UUID
);

-- 2. Generate exactly 5,000 seats
INSERT INTO seats (id, status)
SELECT generate_series(1, 5000), 'AVAILABLE';

-- 3. Turn on Realtime for the seats table (Optional but highly recommended)
ALTER PUBLICATION supabase_realtime ADD TABLE seats;
