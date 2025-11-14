-- backend/schema.sql

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster lookups on common query fields
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_email ON users (email);

-- Future tables for a smart vacation planner would link to users.id
-- Example (commented out for now):
-- CREATE TABLE trips (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER NOT NULL,
--     destination TEXT NOT NULL,
--     start_date TEXT NOT NULL,
--     end_date TEXT NOT NULL,
--     budget REAL,
--     FOREIGN KEY (user_id) REFERENCES users (id)
-- );

-- CREATE TABLE itinerary_items (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     trip_id INTEGER NOT NULL,
--     item_name TEXT NOT NULL,
--     description TEXT,
--     date TEXT,
--     time TEXT,
--     location TEXT,
--     cost REAL,
--     FOREIGN KEY (trip_id) REFERENCES trips (id)
-- );