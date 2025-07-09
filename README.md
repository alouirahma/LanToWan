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

---

## Frontend (React + Vite)
- **Entry Point:** `src/router.tsx` and `src/routes/` define the app's pages.
- **Components:** UI building blocks in `src/components/` and `src/components/ui/` (e.g., `button.tsx`, `input.tsx`).
- **Hooks:** Custom React hooks in `src/hooks/` for form logic, context, etc.
- **Integrations:** External libraries/services (e.g., Clerk for auth, TanStack Query for data fetching, TRPC for API calls).
- **Data:** Demo/mock data in `src/data/`.
- **Lib:** Utility functions and stores in `src/lib/`.
- **Styles:** Global styles in `src/styles.css`.

### How to Use
- Start the frontend with `pnpm dev` (or `npm run dev` if using npm).
- Pages are in `src/routes/` (e.g., `demo.table.tsx` for a table demo).
- Reusable UI elements are in `src/components/ui/`.
- Use hooks for form state and context.
- Integrations folder shows how to connect to APIs and external services.

### Key Points
- **Use components** to build UI, don't repeat code.
- **Hooks** help manage state and logic in React.
- **Integrations** show how to connect to backend or third-party services.
- **Follow the folder structure** to keep code organized.
- **Use TypeScript** for type safety (all files are `.ts` or `.tsx`).
- **Check demo files** (like `demo.table.tsx`) for usage examples.
- **Don't edit files in `node_modules` or generated files.**

---

## General Advice
- **Read code comments** for explanations.
- **Google errors**—most issues are common and have solutions online.
- **Ask for help** if stuck, especially with Spring Boot or React specifics.
- **Commit often** and keep your changes small and focused.

---

## Useful Commands
- **Backend:**
  - `mvn spring-boot:run` — start backend server
- **Frontend:**
  - `pnpm dev` — start frontend dev server
  - `pnpm install` — install dependencies

---

## Technologies Used
- **Backend:** Java, Spring Boot, Spring Data JPA
- **Frontend:** React, Vite, TypeScript, TanStack Query, Clerk, TRPC

---

## Where to Start
- Try running both servers and opening the app in your browser.
- Explore the demo pages and components.
- Read and experiment with simple controllers/services/components first. 