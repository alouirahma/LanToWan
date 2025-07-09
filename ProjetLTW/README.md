# Developer Guide: LanToWan Project

## Overview
- This project is a full-stack web application with a Java Spring Boot backend and a modern React (Vite) frontend.
- It manages business operations like purchases, sales, inventory, and users.

---

## Backend (Java Spring Boot)
- **Entry Point:** `ProjetLtwApplication.java` starts the backend server.
- **Entities:** Represent database tables (e.g., `Achat`, `Produit`, `Client`).
- **Repositories:** Handle database operations for each entity (e.g., `AchatRepository`).
- **Services:** Contain business logic (e.g., `AchatService`).
- **Controllers:** Define API endpoints (e.g., `AchatController`).
- **DTOs:** Data Transfer Objects for requests/responses (in `dtos/requests` and `dtos/responses`).
- **Mappers:** Convert between Entities and DTOs.
- **Configs:** Spring configuration files (rarely need to change as a beginner).
- **Enums:** Define constant values (e.g., product categories, payment modes).
- **Exceptions:** Custom error handling (e.g., `ResourceNotFoundException`).

### How to Use
- Start the backend with your IDE or `mvn spring-boot:run`.
- API endpoints are defined in `controllers/` (e.g., `/achats`, `/produits`).
- Data is sent/received as JSON using DTOs.
- Business logic is in `services/`.
- Database access is via `repositories/` (uses Spring Data JPA).

### Key Points
- **Never edit generated or config files unless you know why.**
- **Entities** must match your database schema.
- **DTOs** help keep API data clean and safe.
- **Services** are where you add most new logic.
- **Controllers** should be thin (just call services, handle requests/responses).
- **Use mappers** to convert between entities and DTOs.
- **Enums** help avoid magic strings/numbers in code.
- **Handle errors** using exceptions and the global handler.