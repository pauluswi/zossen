# arc42 - Zero-Trust Banking Platform

## 1. Introduction and Goals

### 1.1. Introduction

This document describes the architecture of the Zossen banking platform.

### 1.2. Goals

The primary goals of the Zossen project are:
*   Demonstrate Zero-Trust architecture in a banking context.
*   Showcase realistic security controls, including an immutable, hash-chained audit trail.
*   Clearly separate responsibilities: Identity, Security Enforcement, Business Logic.
*   Provide an interactive React-based Backoffice UI to demonstrate the role-based workflow.
*   Serve as a portfolio artifact for senior engineering and architecture roles.

## 2. Constraints

*   **Security**: Must adhere to Zero-Trust principles.
*   **Compliance**: Designed with principles relevant to financial regulations (e.g., BaFin, MaRisk, BAIT).
*   **Technology Stack**: Backend in Java/Spring Boot, Frontend in React/Vite.
*   **Auditability**: Immutable, hash-chained audit trail.
*   **Performance**: Not a primary focus for this showcase, but should be reasonably responsive.
*   **Scalability**: Not a primary focus for this showcase.

## 3. Context and Scope

### 3.1. Business Context

Zossen is a security-focused banking middleware platform designed to demonstrate Zero-Trust architecture principles in a distributed banking environment. It illustrates how modern financial systems can be secured by explicit verification, strong identity boundaries, and defense-in-depth.

### 3.2. Technical Context

The system integrates with a Mock Identity Provider for authentication and a Mock Core Banking system for transaction execution.

### 3.3. Scope

The project focuses on architecture and security patterns, not business feature completeness. It provides a backoffice UI for supervisors and auditors.

## 4. Solution Strategy

The solution strategy is based on a microservices architecture with a strong emphasis on security, auditability, and clear separation of concerns.

*   **Zero-Trust Gateway**: All requests pass through a Z-Trust API Gateway for policy enforcement.
*   **Immutable Audit Log**: All significant actions are recorded in a tamper-evident, hash-chained audit log.
*   **Role-Based Access Control (RBAC)**: Strict enforcement of roles (Supervisor, Auditor) for different functionalities.
*   **Decoupled Services**: Backend services are developed using Spring Boot, and the frontend is a React application.

## 5. Building Block View

### 5.1. Whitebox Overall System

(Refer to `docs/HIGH_LEVEL_ARCH.md` and `docs/AUTH_FLOW.md` for visual diagrams)

**Major Building Blocks:**

*   **Bielefeld Backoffice UI**: React application for user interaction.
*   **Mock IdP (Keycloak)**: External Identity Provider for authentication and token issuance.
*   **Backoffice API**: Spring Boot application handling business logic.
*   **Z-Trust API Gateway**: Policy Enforcement Point, handles Zero-Trust principles.
*   **Z-Trust Middleware**: Handles transaction execution, audit logging, and security.
*   **Mock Core Banking / ISO**: Simulates external banking systems.

### 5.2. Blackbox Building Blocks

#### 5.2.1. Backoffice UI

*   **Responsibilities**: User interface for supervisors and auditors, interacts with the Backoffice API.
*   **Interfaces**: REST API calls to Backoffice API.
*   **Technology**: React, Material UI.

#### 5.2.2. Mock IdP

*   **Responsibilities**: Authenticates users, issues JWTs with role claims.
*   **Interfaces**: OAuth2 endpoints.
*   **Technology**: Simulated Keycloak.

#### 5.2.3. Backoffice API

*   **Responsibilities**: Implements core business logic, delegates to Z-Trust Middleware for secure operations.
*   **Interfaces**: REST API endpoints (e.g., `/backoffice/approve`).
*   **Technology**: Java, Spring Boot.

#### 5.2.4. Z-Trust API Gateway

*   **Responsibilities**: Validates JWTs, enforces Zero-Trust policies, RBAC, context-based checks.
*   **Interfaces**: Intercepts all incoming requests to backend services.
*   **Technology**: Java, Spring Boot (part of the backend services).

#### 5.2.5. Z-Trust Middleware (Transaction / Audit / Security)

*   **Responsibilities**: Secure execution layer for financial operations, immutable audit logging, risk classification.
*   **Interfaces**: Internal APIs used by Backoffice API.
*   **Technology**: Java, Spring Boot.

#### 5.2.6. Mock Core Banking

*   **Responsibilities**: Simulates external core banking operations.
*   **Interfaces**: Internal APIs used by Z-Trust Middleware.
*   **Technology**: Simulated.

## 6. Runtime View

### 6.1. User Login and Token Acquisition

1.  User accesses Backoffice UI.
2.  UI redirects to Mock IdP for login.
3.  Mock IdP authenticates user and returns JWT to UI.

### 6.2. Transaction Approval Flow (Supervisor)

1.  Supervisor initiates an approval action in the Backoffice UI.
2.  UI sends a `POST /backoffice/approve` request with JWT to Backoffice API.
3.  Z-Trust API Gateway validates JWT, checks `ROLE_SUPERVISOR`.
4.  Backoffice API processes request, delegates to Z-Trust Middleware.
5.  Z-Trust Middleware executes transaction and logs an immutable audit event.
6.  Response returned to UI.

### 6.3. Audit Trail Viewing Flow (Auditor)

1.  Auditor logs into Backoffice UI.
2.  Auditor navigates to Audit Trail page.
3.  UI sends `GET /ztrust/audit/logs` request with JWT to Backoffice API.
4.  Z-Trust API Gateway validates JWT, checks `ROLE_AUDITOR`.
5.  Backoffice API retrieves audit logs from Z-Trust Middleware.
6.  Audit logs displayed in UI.

## 7. Deployment View

The application is designed to be deployed as a set of Spring Boot microservices and a React frontend.

*   **Backend Services**: Can be deployed as Docker containers or directly on a server.
*   **Frontend**: Served by a web server (e.g., Nginx) or integrated into a backend service.
*   **Mock IdP**: A separate service, potentially a Docker container.

(Refer to `docker-compose.yml` for local deployment setup)

## 8. Cross-cutting Concepts

*   **Security**: Zero-Trust, OAuth2/JWT, RBAC, Secure HTTP Headers, Centralized Exception Handling.
*   **Auditability**: Immutable, hash-chained audit logs with risk classification.
*   **Error Handling**: Consistent error responses across APIs.
*   **Configuration**: Externalized configuration for services.

## 9. Architectural Decisions

*   **Decision**: Use OAuth2/JWT for authentication and authorization.
    *   **Rationale**: Industry standard, stateless, scalable, supports Zero-Trust principles.
*   **Decision**: Implement an immutable, hash-chained audit log.
    *   **Rationale**: Meets regulatory requirements for tamper-evidence and traceability.
*   **Decision**: Separate Identity Provider from application logic.
    *   **Rationale**: Promotes single source of truth for identity, allows integration with enterprise IAM.
*   **Decision**: Use a dedicated API Gateway for security enforcement.
    *   **Rationale**: Centralizes security policies, simplifies business logic services.

## 10. Quality Requirements

*   **Security**: High (Zero-Trust, RBAC, immutable audit).
*   **Maintainability**: Moderate (modular microservices, clear separation of concerns).
*   **Testability**: High (unit, integration, API testing).
*   **Reliability**: Moderate (in-memory audit log for showcase, not production-grade persistence).
*   **Usability**: Moderate (Backoffice UI for specific roles).

## 11. Risks

*   **Complexity of Distributed System**: Managing multiple services.
*   **Security Misconfigurations**: Potential for vulnerabilities if security policies are not correctly applied.
*   **Performance Bottlenecks**: If audit logging becomes a high-volume operation without proper scaling.

## 12. Technical Debts

*   **In-Memory Audit Log**: Not suitable for production; needs persistent, distributed storage.
*   **Mock IdP**: Needs to be replaced with a real IdP (e.g., Keycloak, Okta) for production.
*   **Mock Core Banking**: Needs integration with actual core banking systems.
*   **Comprehensive Monitoring & Alerting**: Not fully implemented for a production environment.

## 13. Glossary

*   **BaFin**: German Federal Financial Supervisory Authority.
*   **BAIT**: Banking Supervisory Requirements for IT.
*   **JWT**: JSON Web Token.
*   **IdP**: Identity Provider.
*   **MaRisk**: Minimum Requirements for Risk Management (Germany).
*   **RBAC**: Role-Based Access Control.
*   **Zero-Trust**: Security model based on "never trust, always verify".