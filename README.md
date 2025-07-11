<p align="center">
    <h1 align="center">GEO-TAG-BACKEND</h1>
</p>

## Project Title & Description

This project is a backend application built with a TypeScript.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

- **Node.js:** (Version >= 16 is recommended)
- **npm:** (npm >= 8)
- **PostgreSQL:** For running database

## Installation & Setup Instructions

Follow these steps to set up the project:

1.  **Clone the repository:**

    ```bash
    git clone git@github.com:Marcel-zb96/geo-tag-backend.git
    cd geo-tag-backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Backend Environment:**

    - Copy `.env.example` to `.env` file.

    - Update the `.env` file with appropriate values (database connection string, etc.).


4. **Run Prisma Migrations:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
   This will create or update the database schema based on the `prisma/schema.prisma` file.

5. **Run the server:**
```bash
   npm run dev
   ```
   This will start the server in dev mode with nodemon.


## Architectural Choices

- **Layered Architecture:**  
    The project uses a layered (controller-service-repository) structure to separate concerns, making the codebase easier to test and maintain.

- **RESTful API:**  
    REST principles were chosen for simplicity, and ease of integration with various clients.

- **Database Abstraction:**  
    The repository pattern abstracts database operations, allowing for easy swapping of the underlying database technology.

---

---
## SOLID Principles in This Project
- **Single Responsibility:**  
    Each controller handles only HTTP request/response logic, while business logic is encapsulated in service layer. This separation keeps each file focused and maintainable.

- **Open/Closed:**  
    The structure allows adding new features (such as additional endpoints or service methods) without changing existing code, making the system easy to extend.

- **Interface Segregation:**  
    Responsibilities are split across focused modules, so components only depend on what they actually use.
