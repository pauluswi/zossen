# 🔐 Z-Trust Security Layer

**Zero-Trust Enforcement Components**

## Overview

The **Z-Trust Security Layer** contains core security enforcement mechanisms that operate inside the Zero-Trust boundary.

Unlike perimeter security, this layer assumes:
*   Every request is untrusted by default
*   Identity must be verified on every call
*   Authorization decisions are contextual and explicit
*   All actions must be traceable and auditable

This package provides cross-cutting security controls applied consistently across sensitive banking operations.

## Design Principles

*   **Never trust, always verify**
*   **Policy before execution**
*   **Identity ≠ Permission**
*   **Defense in depth**
*   **Auditability by design**

Each component addresses a distinct Zero-Trust risk vector.

## Module Structure

```
security/
├── RbacEvaluator.java
├── ReplayProtection.java
└── CorrelationIdFilter.java
```

## RbacEvaluator

### Purpose
`RbacEvaluator` enforces **Role-Based Access Control (RBAC)** for protected operations inside the Z-Trust boundary.

Even with a valid JWT:
*   Access is denied by default
*   Roles and scopes are explicitly evaluated
*   High-risk actions require elevated privileges

### Responsibilities
*   Extract roles/scopes from JWT claims
*   Validate permission against requested operation
*   Prevent privilege escalation
*   Enforce least-privilege access

### Example Policy (Conceptual)
| Operation | Required Role |
| :--- | :--- |
| Approve Transaction | `OPS_APPROVER` |
| Reject Transaction | `OPS_APPROVER` |
| View Approval Detail | `OPS_VIEWER` |

✅ *Authentication proves who you are*  
🔒 *RBAC proves what you are allowed to do*

## ReplayProtection

### Purpose
`ReplayProtection` defends against **replay attacks**, where a valid request is maliciously reused to perform duplicate or unauthorized operations.

This is critical for:
*   Financial transactions
*   Approval workflows
*   Idempotent-sensitive APIs

### Responsibilities
*   Validate uniqueness of request identifiers
*   Enforce time-based request validity
*   Detect duplicated transaction attempts
*   Reject stale or reused requests

### Typical Signals Used
*   Correlation ID
*   Request timestamp
*   Transaction reference
*   Nonce (conceptual)

🏦 *Replay protection is mandatory in regulated payment systems.*

## CorrelationIdFilter

### Purpose
`CorrelationIdFilter` ensures **end-to-end traceability** across distributed components.

Every incoming request receives a unique correlation ID that flows through:
*   Gateway
*   Security checks
*   Business services
*   Audit logs

### Responsibilities
*   Generate correlation ID if missing
*   Propagate ID across threads and services
*   Attach ID to logs and responses
*   Enable forensic analysis and auditing

### Example Header
`X-Correlation-Id: 3f9c2b7a-1e8f-4c0d-9a71-acde987abc12`

🔍 *Without correlation IDs, audits become guesswork.*

## How These Components Work Together

```
Incoming Request
      │
      ▼
CorrelationIdFilter
      │
      ▼
JWT Validation (Spring Security)
      │
      ▼
RbacEvaluator
      │
      ▼
ReplayProtection
      │
      ▼
Business Execution
```

*Each step adds a layer of trust verification, not assumptions.*

## Why This Layer Matters

This security layer demonstrates:
*   Zero-Trust enforcement beyond authentication
*   Separation of identity and authorization
*   Protection against common banking attack vectors
*   Production-grade thinking without production complexity

It reflects real-world banking security controls, often required by:
*   Internal security reviews
*   Regulatory audits
*   Penetration testing
*   Architecture governance boards

## Production Note

In a real deployment:
*   RBAC policies may be externalized (OPA, IAM, ABAC)
*   Replay protection may use Redis or distributed caches
*   Correlation IDs integrate with SIEM / APM tools

This project intentionally keeps implementations lightweight and readable while preserving architectural intent.

## Key Takeaway

**Security is not a single check.**  
**It is a chain — and every link matters.**

The Z-Trust Security Layer ensures that every sensitive action is verified, authorized, traceable, and defensible.
