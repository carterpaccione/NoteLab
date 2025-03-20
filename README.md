# <center>Notebook App   [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)</center>

## Description

Notebook App is a feature-rich note-taking application designed for developers and students. It allows users to organize notes into Notebooks, categorize them with importance levels, and leverage an AI-powered assistant for coding-related queries.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Tech Stack](#techstack)
- [API Documentation](#api-documentation)
- [Tests](#tests)
- [Contributing](#contributing)
- [Questions](#questions)
- [Future Improvements](#future-improvements)
- [License](#license)

## Installation

- Local Usage:
  - Set necessary environment variables, npm install, npm run start.
- Deployed Application:
    - TBD

## Features

- User Authentication:
  - Sign up and log in to manage personal notebooks and notes.
- Notebook Management:
  - Create, rename, and delete notebooks.
- Note Management:
  - Add notes within notebooks.
  - Categorize notes using three statuses:
    - Main - Core ideas or key points.
    - Highlight - Important snippets or insights.
    - Code: Code snippets or technical details.
  - Edit note content and update status.
  - Delete notes when no longer needed.
- AI-Powered Assistant:
  - Topic Summarization: Generate a summary of coding topics.
  - Coding Problem Assistance: Get hints and explainations for solving coding challenges (e.g., LeetCode-style problems).
- User-Friendly Interface:
  - Organized Notebook tabs for easy access to notebooks.
  - Collapsible AI assistant component to be displayed when needed.
 
## Tech Stack

- Frontend: React, Vite, ReactBootstrap
- Backend: Node.js, Express
- Database: SQL-based storage, Postgresql
- AI Integration: OpenAI API fro coding assistance

## API Documentation

- Endpoints:
  - Auth Routes:
    - POST /auth/register - Register a new user
      - Request Body:
      - Response:
    - POST /auth/login - Authenticate user
      - Request Body:
      - Response:
  - User Routes:
    - GET /api/users/me - Get user profile
      - Headers: Authorization: Bearer *token*
      - Response:
    - DELETE /api/users/me - Delete user profile
      - Headers: Authorization: Bearer *token*
      - Response:
  - Notebook Routes:
    - GET /api/notebooks/:id - Get a notebook by ID
      - Headers: Authorization: Bearer *token*
      - Response:
    - POST /api/notebooks - Create a new notebook
      - Headers: Authorization: Bearer *token*
      - Request Body: { "title": "Notebook Title" }
      - Response:
    - PUT /api/notebooks/:id - Update a notebook title by ID
      - Headers: Authorization: Bearer *token*
      - Request Body: { "title": "Notebook Title" }
      - Response:
    - DELETE /api/notebooks/:id - Delete a notebook by ID
      - Headers: Authorization: Bearer *token*
      - Response:
  - Note Routes:
    - POST /api/notes - Create a new note
      - Headers: Authorization: Bearer *token*
      - Request Body: { "content": "Note Content", "notebook_id:" ID, "importance": "status from selector", "user_id": ID }
      - Response:
    - PUT /api/notes/:id - Update a note by ID
      - Headers: Authorization: Bearer *token*
      - Request Body: (both optional) { "content": "New Content", "importance": "new status" }
      - Response:
    - DELETE /api/notes/:id - Delete a note by ID
      - Headers: Authorization: Bearer *token*
      - Response:

## Tests

- Component:
  - Header:
    - it should render the header
  - Login:
    - it should render the login form
    - it should display the correct labels and placeholders
    - it should display the correct error message
  - Note:
    - Basic Rendering:
      - it should render the passed MAIN note content
      - it should render the passed STICKY (Code) note content
      - it should render the correct NoteForm when the edit button is clicked
      - it should render the correct NoteForm inputs MAIN
      - it should render the correct NoteForm inputs STICKY (Code)
    - CRUD Operations:
      - it should update the note content and importance
  - Notebook:
    - Basic Rendering:
      - it should render the correct NotebookTabs
- E2E:
  - Landing Page:
    - it should sign up a user
    - it should login a user
  - Notebook Page:
    - it should crate a notebook
    - it should edit a notebook title
    - it should create a note
    - it should edit the note content and importance
    - it should delete the note
    - it should delete the notebook
   
## Contributing

Carter Paccione

## Questions

For any questions or suggestions, please contact me at: 
carterpaccione@gmail.com.

GitHub: github.com/carterpaccione

## Future Improvements



## License

Distributed under MIT License. See https://choosealicense.com/licenses/mit/ for more information.
