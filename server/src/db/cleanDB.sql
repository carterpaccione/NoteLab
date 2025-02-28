DROP DATABASE IF EXISTS notebook_db;
CREATE DATABASE notebook_db;

\c notebook_db;

CREATE TYPE importance_level AS ENUM ('Main', 'Highlight', 'Sticky');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(32) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notebooks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    notebook_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    importance importance_level NOT NULL DEFAULT 'Main',
    FOREIGN KEY (notebook_id) REFERENCES notebooks(id) ON DELETE CASCADE
);

SELECT current_database();