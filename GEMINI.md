# Project: admin-heko

## Project Overview

This project is a web-based administration panel for a clinic named "heko porã". It is a Node.js application built with Express.js. The front-end is rendered using EJS templates and styled with Bootstrap. The application provides functionalities for managing patients, doctors, specialties, and clinics. Authentication is implemented using JSON Web Tokens (JWT). The application is designed to connect to a Sybase database, but it also includes a local database setup for development.

## Building and Running

### Prerequisites

*   Node.js
*   A Sybase database (for production)

### Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

1.  Create a `.env` file in the root of the project and add the following environment variables:

    ```
    PORT=3000
    SECRET_JWT_KEY=your-secret-key

    # Sybase database connection details
    SYBASE_HOST=your-sybase-host
    SYBASE_PORT=your-sybase-port
    SYBASE_DB=your-sybase-db
    SYBASE_USER=your-sybase-user
    SYBASE_PASSWORD=your-sybase-password
    ```

2.  Start the application in development mode:

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

### Running without a Database

If you want to run the application without connecting to a Sybase database, you can set the `SKIP_DB` environment variable to `true` in your `.env` file:

```
SKIP_DB=true
```

## Development Conventions

*   **Code Style**: The project follows the "standard" JavaScript style guide. It is recommended to use an editor plugin to enforce the style.
*   **Modularity**: The application is structured in a modular way, with a clear separation of concerns between routes, repositories, and views.
*   **Database Interaction**: Database queries are centralized in repository files (e.g., `pacientes-repository.js`). This makes it easier to manage and maintain the database logic.
*   **Authentication**: Authentication is handled by a middleware that verifies a JWT token stored in a cookie. Protected routes use this middleware to ensure that only authenticated users can access them.
*   **API Endpoints**: The application exposes API endpoints for managing resources (e.g., `/api/pacientes`). These endpoints are used by the front-end JavaScript to interact with the back-end.

## Key Files

*   `app.js`: The main entry point of the application. It initializes Express, sets up middleware, and defines the main routes.
*   `config.js`: Exports configuration variables, such as the port and JWT secret key.
*   `db/connect.js`: Handles the connection to the Sybase database.
*   `routes/`: This directory contains the route definitions for the different resources (e.g., `pacientes.routes.js`).
*   `views/`: This directory contains the EJS templates for the user interface.
*   `public/`: This directory contains the static assets, such as CSS and client-side JavaScript files.
*   `*-repository.js`: These files (e.g., `pacientes-repository.js`, `medico-repository.js`) contain the database logic for each resource.
