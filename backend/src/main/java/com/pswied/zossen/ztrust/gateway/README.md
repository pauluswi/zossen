# 🔐 Z-Trust Security Gateway

**Zero-Trust Enforcement Boundary**

## Overview

The **Z-Trust Security Gateway** represents the **Zero-Trust enforcement boundary** within the platform.

It acts as a logical API Gateway inside the backend service, ensuring that no business operation is executed without explicit verification and policy enforcement, even though the system is implemented as a single service for demonstration purposes.

🔑 **Key Principle:**  
*Business logic never decides trust.*  
*All trust decisions are centralized here.*

## Responsibilities

The gateway is responsible for **security enforcement**, not business logic.

### ✅ What the Gateway Does
*   Enforces Zero-Trust principles
*   Validates security context extracted from JWT
*   Applies RBAC and scope-based authorization
*   Performs replay attack protection
*   Establishes correlation IDs
*   Initializes audit context before execution
*   Delegates approved requests to secure services

### ❌ What the Gateway Does NOT Do
*   Authenticate users (handled by external IdP / mock IdP)
*   Contain business rules
*   Perform UI-specific validation
*   Manage user data

## Module Structure

```
gateway/
└── ZTrustSecurityGateway.java
```

The gateway is intentionally minimal and explicit to keep the trust boundary easy to reason about.

## ZTrustSecurityGateway

### Role
`ZTrustSecurityGateway` is the **single entry point** into Z-Trust–protected operations.

Any high-risk or sensitive operation (e.g. transaction execution) **must** pass through this gateway.

### Responsibilities (Detailed)
Inside the gateway, the following steps typically occur:

1.  **Security Context Verification**
    *   Ensures a valid security context is present
    *   Relies on upstream JWT validation (Resource Server)

2.  **Authorization Enforcement**
    *   Role-based access control (RBAC)
    *   Scope validation (e.g. `txn.create`)

3.  **Replay Protection**
    *   Request ID and timestamp validation
    *   Prevents duplicate or delayed execution

4.  **Correlation & Traceability**
    *   Generates or propagates correlation IDs
    *   Enables full request tracing across layers

5.  **Audit Initialization**
    *   Captures *who, what, when, and from where*
    *   Delegates audit persistence to the Audit Service

6.  **Delegation to Secure Services**
    *   Only after all checks pass
    *   Business execution remains isolated

## Execution Flow (Simplified)

```
Backoffice Module
      │
      ▼
ZTrustSecurityGateway
  ├─ Authorization check
  ├─ Policy enforcement
  ├─ Audit context setup
      │
      ▼
Secure Transaction Service
```

**If any security check fails:**
*   Execution is stopped
*   An appropriate security exception is raised
*   The event is audit-logged

## Zero-Trust Design Rationale

Even though this project uses a single backend service, the gateway enforces Zero-Trust boundaries as if components were deployed independently.

This design:
*   Prevents accidental bypass of security controls
*   Makes future service separation trivial
*   Mirrors real banking middleware and API gateway patterns

🏦 *In real banking environments, this role is typically fulfilled by API Gateways, Service Mesh policies, or dedicated security middleware.*

## Relationship to Other Modules

| Module | Relationship |
| :--- | :--- |
| **Backoffice** | Calls the gateway, never bypasses it |
| **Security** | Supplies verified security context |
| **Audit** | Persists immutable security events |
| **Transaction** | Executes logic only after approval |

*The gateway coordinates — it does not own execution.*

## Future Evolution (Conceptual)

In a production setup, this gateway could be:
*   Extracted into a standalone service
*   Implemented as an external API Gateway
*   Backed by policy-as-code (OPA)
*   Enforced via service mesh (mTLS + authorization)

The current design preserves this path without refactoring.

## Key Takeaway

The **Z-Trust Security Gateway** is the **single source of trust enforcement**.  
No business operation is allowed to execute without passing through it.

*This module exists to demonstrate security-first architecture, not just secured endpoints.*
