# 🏦 Zossen - Zero-Trust Banking Platform

> A security-focused showcase for distributed banking systems, demonstrating Zero-Trust architecture, role-based access, and immutable audit trails.

## 📌 Overview

**Zossen** is a security-focused banking middleware platform designed to demonstrate Zero-Trust architecture principles in a distributed banking environment.

The project illustrates how modern financial systems can be secured by explicit verification, strong identity boundaries, and defense-in-depth, rather than relying on network trust.

This showcase focuses on architecture and security patterns, not business feature completeness.

## 🎯 Project Goals

*   Demonstrate Zero-Trust architecture in a banking context.
*   Showcase realistic security controls, including an immutable, hash-chained audit trail.
*   Clearly separate responsibilities:
    *   Identity (Mock IdP)
    *   Security Enforcement (Z-Trust Gateway)
    *   Business Logic (Backoffice)
*   Provide an interactive **React-based Backoffice UI** to demonstrate the role-based workflow between a Supervisor and an Auditor.
*   Serve as a portfolio artifact for senior engineering and architecture roles.

## 🔐 Zero-Trust Principles Applied

| Principle | Implementation |
| :--- | :--- |
| **Never Trust, Always Verify** | OAuth2 + JWT validation on every request. |
| **Identity First** | External Mock Identity Provider that issues role-based tokens. |
| **Least Privilege** | Strict, role-based access control (e.g., only Supervisors can approve). |
| **Observability & Auditability** | All actions are recorded in an **immutable, hash-chained audit log** with automatic **risk classification**. |
| **Assume Breach** | All sensitive endpoints are protected, even if the request originates from an authenticated user. |

## 🔑 Identity & Access Management

### Why a Mock Identity Provider?

A Mock IdP is used to simulate an enterprise-grade IAM system (like Keycloak or Okta) without requiring complex setup. The goal is to show Zero-Trust system design, not to reimplement identity management. Identity is treated as an external, authoritative system.

### OAuth2 Configuration (Showcase Roles)

For this showcase, the user-facing roles are simplified to demonstrate a clear separation of duties:

*   **SUPERVISOR**: A user who can perform privileged actions, such as approving transactions. Mapped to `ROLE_SUPERVISOR`.
*   **AUDITOR**: A user who has read-only access to review the audit trail. Mapped to `ROLE_AUDITOR`.

### Token Usage

*   The UI authenticates with the Mock IdP to get a JWT.
*   The JWT is validated at the API boundary on every request.
*   Authorization decisions are based on the roles present in the token's claims.

## 🔁 Sample API Endpoint

### `POST /backoffice/approve`

A high-risk endpoint to approve a financial transaction, protected by the Z-Trust gateway.

*   **Required Role**: `ROLE_SUPERVISOR`
*   **Request Parameter**: `transactionId={id}` (e.g., `025093000001`)
*   **On Success (200 OK)**:
    *   Returns a confirmation message.
    *   Guarantees the action was recorded in the immutable audit log.
*   **On Failure**:
    *   `401 Unauthorized`: If no token is provided.
    *   `403 Forbidden`: If the token lacks the required `ROLE_SUPERVISOR`.

This endpoint demonstrates the complete Zero-Trust flow: **Authenticate -> Authorize -> Audit -> Execute**.

## 📘 Security Controls Demonstrated

*   **OAuth2 / JWT Validation**: All protected endpoints require a valid token.
*   **Role-Based Access Control (RBAC)**: Strict enforcement of Supervisor vs. Auditor roles.
*   **Immutable Audit Logging**:
    *   Events are stored in an in-memory "database".
    *   **Hash-chaining** is used to ensure logs cannot be tampered with.
    *   **Risk Classification** (`INFO`, `WARNING`, `CRITICAL`) is automatically applied to events.
*   **Secure HTTP Headers**: Includes HSTS, CSP, and X-Frame-Options to protect the UI.
*   **Centralized Exception Handling**: Security exceptions are gracefully handled and returned as proper HTTP error codes (e.g., 403).

## ⚠️ Important Disclaimer

This project is a personal technical showcase built with synthetic data. It is designed to demonstrate architecture and security patterns and does not represent a real, production-ready banking system.
