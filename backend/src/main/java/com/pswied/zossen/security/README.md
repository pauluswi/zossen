# 🔐 Resource Server Security Layer

**JWT Validation & Identity Extraction**

## Overview

The **Resource Server Security Layer** is responsible for verifying incoming requests at the application boundary.

This layer ensures that:

*   Every request carries a valid JWT
*   Tokens are cryptographically verified
*   Identity and roles are extracted into a security context

🔑 **This layer answers: “Who is calling?”**
🔒 **Z-Trust answers: “Are they allowed to do this?”**

Together, they form a complete Zero-Trust flow.

## Architectural Position

```
Client / Backoffice UI
        │
        ▼
Resource Server Security   ← You are here
(JWT Verification)
        │
        ▼
Z-Trust Security Gateway
(Policy Enforcement)
```

This separation mirrors real banking architectures where:

*   Authentication is external
*   Authorization is internal and contextual

## Module Structure

```
security/
├── JwtSecurityConfig.java
├── JwtClaimMapper.java
└── SecurityConfig.java
```

Each class has a focused responsibility.

## JwtSecurityConfig

### Purpose

`JwtSecurityConfig` configures the application as an OAuth2 Resource Server.

It ensures that:

*   JWTs are validated on every request
*   Tokens are signed by a trusted Identity Provider
*   Invalid or expired tokens are rejected immediately

### Responsibilities

*   Configure JWT decoder
*   Validate token signature and expiration
*   Define trusted issuer / keys
*   Reject unauthenticated requests

🚫 **No JWT → No access**

## JwtClaimMapper

### Purpose

`JwtClaimMapper` translates JWT claims into application-friendly roles and authorities.

Identity Providers often issue claims in formats that are:

*   Too generic
*   Too IdP-specific
*   Not aligned with domain roles

This component adapts those claims into:

*   `GrantedAuthority`
*   Domain-level roles used by Z-Trust

### Example (Conceptual)

| JWT Claim | Mapped To |
| :--- | :--- |
| `realm_access.roles` | `ROLE_OPS_APPROVER` |
| `scope=approval` | `SCOPE_TRANSACTION_APPROVE` |

🔄 **Mapping avoids leaking IdP structure into business code**

## SecurityConfig

### Purpose

`SecurityConfig` defines global HTTP security rules.

It controls:

*   Which endpoints are public
*   Which endpoints require authentication
*   Which endpoints are protected by Zero-Trust enforcement

### Typical Rules

*   `/mock-idp/**` → public (development only)
*   `/health` → public
*   `/ztrust/**` → authenticated + secured
*   `/backoffice/**` → authenticated

This ensures a clear security posture from the first request.

## How Authentication Flows

```
Request with JWT
      │
      ▼
JwtSecurityConfig
(Token Validation)
      │
      ▼
JwtClaimMapper
(Role Mapping)
      │
      ▼
Spring Security Context
      │
      ▼
Z-Trust Gateway
```

At the end of this flow:

*   The caller’s identity is known
*   Roles and scopes are available
*   Authorization decisions are still pending

## Why This Layer Is Separate from Z-Trust

| Resource Server | Z-Trust |
| :--- | :--- |
| Validates identity | Enforces policy |
| Verifies tokens | Evaluates permissions |
| Stateless | Context-aware |
| Generic | Domain-specific |

This separation is critical for:

*   Clean architecture
*   Auditable security boundaries
*   Regulatory clarity

## Security Assumptions

This layer assumes:

*   JWTs are issued by a trusted IdP
*   Token signing keys are managed externally
*   Authentication ≠ Authorization

Those assumptions reflect Zero-Trust best practices.

## Production Mapping

In a real system, this layer would integrate with:

*   Keycloak
*   Azure AD
*   Okta
*   Ping Identity

This project uses a Mock IdP to preserve architecture while reducing setup complexity.

## Key Takeaway

> **Trust the token.**
> **Question the intent.**
> **Enforce the policy.**

The Resource Server Security Layer ensures that only authenticated identities are allowed to enter the system — nothing more, nothing less.
