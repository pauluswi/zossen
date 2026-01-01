# 🏦 Zossen - Zero-Trust Banking Platform

> A security-focused showcase for distributed banking systems, demonstrating Zero-Trust architecture, role-based access, and immutable audit trails.

This project illustrates how modern financial systems can be secured by explicit verification and strong identity boundaries, rather than relying on implicit network trust.

---

## 📚 Project Documentation

This README serves as the central hub for all project documentation.

### 🏛️ Core Architecture & Design

High-level diagrams and specifications that define the system's structure and behavior.

- **[High Level Architecture Diagram](docs/HIGH_LEVEL_ARCH.md)**: Visual overview of all system components and their interactions.
- **[Authentication Flow](docs/AUTH_FLOW.md)**: Step-by-step diagram of the user authentication and token flow.
- **[Audit & Risk Event Specification](docs/AUDIT_RISK_EVENT.md)**: The detailed design document for the BaFin-style audit and risk engine.

### 📦 Components

Detailed documentation for each major component of the application.

#### Backend Modules (Java / Spring Boot)

- **[Backoffice Module](src/main/java/com/pswied/zossen/backoffice/README.md)**: Handles business logic and delegates to Z-Trust.
- **[Security Module](src/main/java/com/pswied/zossen/security/README.md)**: Manages JWT validation and identity extraction.
- **[Z-Trust Gateway](src/main/java/com/pswied/zossen/ztrust/gateway/README.md)**: The core Policy Enforcement Point.
- **[Z-Trust Audit Module](src/main/java/com/pswied/zossen/ztrust/audit/README.md)**: The immutable, hash-chained audit log engine.
- **[Z-Trust Transaction Module](src/main/java/com/pswied/zossen/ztrust/transaction/README.md)**: The secure execution layer for financial operations.

#### Frontend UI (React / Material UI)

- **[Backoffice UI Guide](backoffice-ui/README.md)**: Instructions for running the frontend and a detailed walkthrough of the user flow with screenshots.

### 🧪 Testing

- **[API Testing Guide (cURL)](docs/API_TESTING.md)**: A guide with `curl` commands for manually testing the security of the backend API.
