# 🏦 Zossen - Zero-Trust Banking Platform

> Zero-Trust Security Showcase for Distributed Banking Systems

## 📌 Overview

**Z-Trust** is a security-focused banking middleware platform designed to demonstrate Zero-Trust architecture principles in a distributed banking environment.

The project illustrates how modern financial systems can be secured by explicit verification, strong identity boundaries, and defense-in-depth, rather than relying on network trust.

This showcase focuses on architecture and security patterns, not business feature completeness.

## 🎯 Purpose

This is a personal technical showcase created for:
*   Architecture discussions
*   Security design reviews
*   Senior engineering / solution architect portfolios

It does not represent a production banking system and contains no proprietary data or logic.

## 🎯 Project Goals

*   Demonstrate Zero-Trust architecture in a banking context
*   Showcase realistic security controls used in financial institutions
*   Clearly separate:
    *   Identity
    *   Security enforcement
    *   Business logic
*   Provide a Backoffice UI for:
    *   Security monitoring
    *   Audit inspection
*   Serve as a portfolio artifact for senior engineering and architecture roles

## 🔐 Zero-Trust Principles Applied

| Principle | Implementation |
| :--- | :--- |
| **Never Trust, Always Verify** | OAuth2 + JWT validation on every request |
| **Identity First** | External Identity Provider (Keycloak) |
| **Least Privilege** | Scope-based RBAC |
| **Secure Service Communication** | Mutual TLS (mTLS) between microservices |
| **Observability & Auditability** | Centralized, immutable audit logs |
| **Assume Breach** | Correlation IDs, replay protection |

## 🔑 Identity & Access Management

### Why an External Identity Provider?

Keycloak is used to demonstrate enterprise-grade IAM separation.
The goal of this project is to show Zero-Trust system design, not to reimplement identity management logic inside the application.
Identity is treated as an external, authoritative system.

### OAuth2 Configuration (Conceptual)

*   **Realm**: `z-trust`
*   **Clients**:
    *   `bielefeld-backoffice` – Banking Operations UI
    *   `batavia-backend` – Secure Banking Middleware
*   **Roles**:
    *   `ADMIN`
    *   `AUDITOR`
    *   `SYSTEM`
*   **Scopes**:
    *   `txn.create`

### Token Usage

*   JWT validated at the API Gateway
*   Claims propagated to downstream services
*   No shared secrets between services
*   Authorization decisions based on:
    *   Role
    *   Scope
    *   Token claims

## 🔁 Sample API

### `POST /transfer`

Simulated fund transfer endpoint.

*   **Required Scope**: `txn.create`
*   **Response Includes**:
    *   Correlation ID
    *   Security context
    *   Immutable audit reference

This endpoint exists to demonstrate security enforcement, not business complexity.

## 📘 Security Controls Demonstrated

*   OAuth2 / JWT validation
*   Mutual TLS (service-to-service)
*   Role-Based Access Control (RBAC)
*   Rate limiting at API Gateway
*   Replay attack prevention (timestamp + request ID)
*   Secure HTTP headers
*   Centralized, immutable audit logging
*   Distributed tracing & correlation IDs

## 📜 Compliance Alignment (Conceptual)

| Regulation / Standard | Coverage |
| :--- | :--- |
| **PSD2** | Strong authentication, auditability |
| **ISO 27001** | Access control, logging |
| **OWASP ASVS** | API security controls |
| **BaFin IT Guidelines** | Secure system boundaries |

> ⚠️ **Note:** Compliance mapping is illustrative only and does not represent any certification claim.

## ⚠️ Important Disclaimer

This project is:
*   A personal technical showcase
*   Built entirely with synthetic data
*   Designed to demonstrate architecture and security patterns

It does not:
*   Represent a real banking system
*   Use proprietary business logic
*   Claim regulatory or compliance certification

## 🚀 Why This Project Matters

This project demonstrates:
*   Security-first system design
*   Practical Zero-Trust implementation
*   Strong banking domain awareness
*   Clear architectural decision-making
*   Realistic enterprise security patterns
