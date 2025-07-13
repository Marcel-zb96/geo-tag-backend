<p align="center">
    <h1 align="center">GEO-TAG-BACKEND</h1>
</p>

## Project Title & Description

This project is a backend RESTful API for the Geo-Tag system, built with TypeScript, Express, and Prisma (PostgreSQL). It provides endpoints for user authentication, registration, and CRUD operations on geolocated notes.

---

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

- **Node.js:** (Version >= 16 is recommended)
- **npm:** (npm >= 8)
- **PostgreSQL:** For running the database

---

## Installation & Setup Instructions

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Marcel-zb96/geo-tag-backend.git
    cd geo-tag-backend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure Environment:**

    - Copy `.env.example` to `.env` file.
    - Set the database connection string and other environment variables as needed:
        DATABASE_URL= \<Your PSQL connection string\>\
        PORT= \<The port the application will run on\>\
        JWT_SECRET= \<A secret for JWT\>

4. **Run Prisma Migrations & Generate Client:**

    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```
    This will create or update the database schema based on `prisma/schema.prisma`.

5. **Run the backend server:**

    ```bash
    npm run dev
    ```
    This will start the server in development mode (with nodemon). The API will be available at `http://localhost:3000` by default.

---

## Architectural Choices

- **Layered Architecture (Controller-Service):**
    - Controllers handle HTTP request/response logic.
    - Services encapsulate business logic and interact with the database via Prisma.
    - This separation improves maintainability, testability, and clarity.

- **Prisma ORM:**
    - Used for type-safe database access and migrations with PostgreSQL.

- **Express Middleware:**
    - Custom middleware for authentication, authorization and error handling.

- **TypeScript:**
    - Provides type safety and better developer experience.

---

## Assumptions

- The frontend client will handle user sessions via JWT tokens issued by the backend.
- The database is PostgreSQL and is accessible via the connection string in `.env`.

---

## SOLID Principles in This Project

- **Single Responsibility:**
    - Controllers only handle HTTP logic; services handle business logic; middleware handles cross-cutting concerns.
- **Open/Closed:**
    - New endpoints or features can be added by extending controllers/services without modifying existing code.
---

## How to Use

- **Register:** Send a POST request to `/api/users/register` with user details.
- **Login:** Send a POST request to `/api/users/login` to receive a JWT token.
- **Notes:** Use `/api/notes` endpoints to create, read, update, and delete geolocated notes (authentication required).

---

## Example API Endpoints

- `POST /api/users/register` — Register a new user
- `POST /api/users/login` — Login and receive JWT
- `GET /api/notes` — List all notes (auth required)
- `POST /api/notes` — Create a new note (auth required)
- `PUT /api/notes/:id` — Update a note (auth required)
- `DELETE /api/notes/:id` — Delete a note (auth required)

---

## Testing

- Run all tests:
    ```bash
    npm run test
    ```
- Tests are located in the `test/` directory and cover controllers and services.

