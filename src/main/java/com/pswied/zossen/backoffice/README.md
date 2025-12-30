# 🧾 Backoffice Module (Business Layer)

## Overview

The **Backoffice module** represents the business-facing layer of the Bielefeld Backoffice system.
It handles operational workflows and business validation, while delegating all security enforcement to the **Z-Trust security boundary**.

This module is intentionally thin and security-agnostic, reflecting real banking architecture where business systems do not own authentication or trust decisions.

## Responsibilities

✅ Business workflow handling  
✅ Input validation & approval logic  
✅ DTO mapping for UI communication  
✅ Delegation to Z-Trust for secure execution  

❌ Authentication  
❌ Authorization enforcement  
❌ Token validation  
❌ Audit persistence  

🔐 **All security concerns are handled by the Z-Trust module.**

## Module Structure

```
backoffice/
├── controller/
│   └── TransactionApprovalController.java
│
├── service/
│   └── ApprovalService.java
│
└── dto/
```

## Component Description

### TransactionApprovalController

**Role:**
Acts as the entry point for Backoffice UI requests related to transaction approval.

**Key characteristics:**
*   Exposes REST endpoints for approval actions
*   Accepts already-authenticated requests (JWT validated upstream)
*   Does not perform security checks
*   Delegates execution to the business service layer

**Example responsibility:**
1.  Receive approval request
2.  Perform basic request validation
3.  Forward request to `ApprovalService`

### ApprovalService

**Role:**
Encapsulates business rules related to transaction approval.

**Responsibilities:**
*   Validate approval conditions (amount, status, risk level)
*   Prepare approval context
*   Delegate secure execution to **Z-Trust Security Gateway**

**This service does not:**
*   Verify JWTs
*   Check roles or scopes
*   Write audit logs

*That separation is intentional.*

### dto (Data Transfer Objects)

**Purpose:**
Defines request and response objects exchanged between:
*   Backoffice UI
*   Backoffice controller
*   Z-Trust boundary

**DTOs are kept simple and explicit to ensure:**
*   Clear API contracts
*   No leakage of security internals
*   Easy evolution of UI or middleware independently

## Transaction Approval Flow (High-Level)

### 1. Authentication Phase
```
Backoffice UI
      │
      ▼
Mock IdP (Login)
      │
      ▼
Returns JWT (Access Token)
```

### 2. Execution Phase
```
Backoffice UI (with Token)
      │
      ▼
TransactionApprovalController
      │
      ▼
ApprovalService
      │
      ▼
Z-Trust Security Gateway
      │
      ▼
Secure Transaction Execution + Audit
```

*The Backoffice module never bypasses Z-Trust for high-risk operations.*

## Design Rationale

### Why is security not handled here?

In real banking systems:
1.  Backoffice applications focus on process & workflow
2.  Security is enforced by central platforms (gateways, middleware, IAM)

This module reflects that separation to:
*   Improve maintainability
*   Reduce security duplication
*   Enable independent scaling of security controls

## Future Evolution (Conceptual)

In a production setup:
*   This module could be deployed as a separate service
*   Z-Trust would remain an independent platform
*   Integration would remain unchanged

This design allows scaling without refactoring business logic.

## Summary

The Backoffice module:
*   Represents business intent
*   Avoids security coupling
*   Delegates trust decisions
*   Mirrors real-world banking backoffice systems
