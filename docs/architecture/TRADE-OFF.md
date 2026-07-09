# Architectural Trade-Offs

This document summarizes the key architectural decisions made for the Zossen project, highlighting the chosen solutions and the alternatives considered, along with their trade-offs.

| ADR | Decision | Chosen | Alternatives Considered |
|:----|:---------|:-------|:------------------------|
| 001 | Use OAuth2/JWT for Authentication and Authorization | OAuth2 with JSON Web Tokens (JWTs) | Session-based Authentication, API Keys |
| 002 | Immutable, Hash-Chained Audit Log | Immutable, hash-chained audit log | Simple Append-Only Logging, Centralized Log Management (e.g., ELK Stack), Blockchain-based Logging |
| 003 | Microservices Architecture for Backend | Microservices Architecture | Monolithic Architecture, Modular Monolith |