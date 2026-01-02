# 🏦 Zossen - Zero-Trust Banking Platform

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-purple?style=for-the-badge&logo=vite)
![Security](https://img.shields.io/badge/Security-Zero%20Trust-red?style=for-the-badge&logo=security)
![Audit](https://img.shields.io/badge/Audit-Immutable-darkgreen?style=for-the-badge&logo=logstash)

> A security-focused showcase for distributed banking systems, demonstrating Zero-Trust architecture, role-based access, and immutable audit trails.

---

## 🏛️ Regulatory & Compliance Architecture

This project is a technical showcase demonstrating a **Zero-Trust security architecture** for banking middleware, designed with principles relevant to the financial sector in mind.

The architecture emphasizes **traceability, immutability, and explicit verification**, aligning with the expectations of regulatory bodies like **BaFin** and standards such as **MaRisk** and **BAIT**.

**Key features demonstrated:**
*   **Immutable, Hash-Chained Audit Trail**: An audit log designed to be tamper-evident, a core requirement for compliance.
*   **Automated Risk Classification**: Events are automatically classified (`INFO`, `WARNING`, `CRITICAL`), enabling focused regulatory reporting.
*   **Strict Role-Based Access Control (RBAC)**: A clear separation of duties is enforced between operational roles (e.g., `Supervisor`) and oversight roles (e.g., `Auditor`).
*   **Secure, Decoupled Architecture**: The system is built with decoupled microservices (Java/Spring Boot) and a modern frontend (React), communicating via secure, token-based APIs.

This showcase serves as a practical example of how to build secure, compliant, and modern banking systems.

---

## 📚 Project Documentation

This README serves as the central hub for all project documentation.

### 📄 Project Overview

- **[Z-Trust Platform Overview](docs/Z-TRUST.md)**: A detailed overview of the project's goals, principles, and security features.

### 🏛️ Core Architecture & Design

High-level diagrams and specifications that define the system's structure and behavior.

- **[Architecture Diagram](docs/Arch.md)**: Visual overview of all system components and their interactions.
- **[Authentication Flow](docs/AUTH-FLOW.md)**: Step-by-step diagram of the user authentication and token flow.
- **[Audit & Risk Event Specification](docs/AUDIT_RISK_EVENT.md)**: The detailed design document for the BaFin-style audit and risk engine.

### 📦 Components

Detailed documentation for each major component of the application.

#### Backend Modules (Java / Spring Boot)

- **[Backoffice Module](backend/src/main/java/com/pswied/zossen/backoffice/README.md)**: Handles business logic and delegates to Z-Trust.
- **[Security Module](backend/src/main/java/com/pswied/zossen/security/README.md)**: Manages JWT validation and identity extraction.
- **[Z-Trust Gateway](backend/src/main/java/com/pswied/zossen/ztrust/gateway/README.md)**: The core Policy Enforcement Point.
- **[Z-Trust Audit Module](backend/src/main/java/com/pswied/zossen/ztrust/audit/README.md)**: The immutable, hash-chained audit log engine.
- **[Z-Trust Transaction Module](backend/src/main/java/com/pswied/zossen/ztrust/transaction/README.md)**: The secure execution layer for financial operations.

#### Frontend UI (React / Material UI)

- **[Backoffice UI Guide](backoffice-ui/README.md)**: Instructions for running the frontend and a detailed walkthrough of the user flow with screenshots.

### 🧪 Testing

- **[API Testing Guide (cURL)](docs/API_TESTING.md)**: A guide with `curl` commands for manually testing the security of the backend API.
