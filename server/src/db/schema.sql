DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'importance_level') THEN
        CREATE TYPE importance_level AS ENUM ('Main', 'Highlight', 'Sticky');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'users') THEN
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(32) NOT NULL UNIQUE,
            password VARCHAR(64) NOT NULL,
            email VARCHAR(64) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'notebooks') THEN
        CREATE TABLE notebooks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(64) NOT NULL,
            user_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'notes') THEN
        CREATE TABLE notes (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL,
            notebook_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            importance importance_level NOT NULL DEFAULT 'Main',
            FOREIGN KEY (notebook_id) REFERENCES notebooks(id) ON DELETE CASCADE
        );
    END IF;
END $$;