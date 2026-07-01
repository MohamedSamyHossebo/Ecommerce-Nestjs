# Route IT Back-end Diploma: NestJS E-Commerce Project

## Overview

This repository contains an e-commerce backend built with NestJS as part of the Route IT Back-end Node.js Diploma training.

The project is designed for learning NestJS fundamentals, backend architecture, and practical API development in a training environment.

## What this project includes

- Basic e-commerce API structure
- NestJS modules, controllers, and services
- MongoDB integration with Mongoose
- User and product model examples
- Password hashing and security patterns
- Validation using `class-validator` and `class-transformer`
- Unit and end-to-end testing with Jest

## Training goals

This project is intended to help learners at Route IT practice:
- Building RESTful APIs with NestJS
- Structuring backend code for clarity and maintainability
- Working with databases and data models
- Implementing authentication-related logic
- Testing backend features using Jest

## Prerequisites

- Node.js (recommended: 18+)
- npm
- MongoDB instance (local or cloud)

## Installation

```bash
npm install
```

## Running the application

### Development mode

```bash
npm run start
```

### Watch mode

```bash
npm run start:dev
```

### Production mode

```bash
npm run build
npm run start:prod
```

## Available scripts

- `npm run start` — start the NestJS server
- `npm run start:dev` — start with file watching and hot reload
- `npm run build` — compile the application to `dist/`
- `npm run start:prod` — run the built application
- `npm run test` — run unit tests
- `npm run test:e2e` — run end-to-end tests
- `npm run test:cov` — run tests with coverage report
- `npm run lint` — run ESLint checks
- `npm run format` — format code with Prettier

## Project structure

- `src/` — source code for the application
- `src/app.module.ts` — main NestJS application module
- `src/main.ts` — application entry point
- `src/common/` — shared filters, guards, pipes, and utilities
- `src/DB/Models/` — database models
- `test/` — integration and e2e test files

## Notes

This repository is meant for learning and training only. It is a practical exercise for understanding NestJS backend development in the Route IT curriculum.

## License

This project is created for educational use within the Route IT training program.
