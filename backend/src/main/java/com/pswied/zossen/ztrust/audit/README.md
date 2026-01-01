# 📘 Z-Trust Audit Layer

**Immutable Security & Transaction Audit Logging**

## Overview

The **Z-Trust Audit Layer** is responsible for recording security-relevant and business-critical events occurring inside the Zero-Trust boundary.

In banking systems, audit logging is not optional:

*   Every privileged action must be traceable
*   Every decision must be reconstructable
*   Every execution must be defensible

This module ensures that no high-risk operation occurs without leaving an immutable trail.

## Architectural Role

```
Backoffice Request
      │
      ▼
Z-Trust Security Gateway
      │
      ▼
Z-Trust Security Layer
(RBAC, Replay Protection)
      │
      ▼
Z-Trust Transaction Service
      │
      ▼
Z-Trust Audit Service   ← You are here
```

Audit is not an afterthought — it is part of the execution path.

## Module Structure

```
audit/
└── AuditService.java
```

The simplicity reflects its focused responsibility.

## AuditService

### Purpose

`AuditService` records immutable audit events for:

*   Security decisions
*   Transaction approvals
*   High-risk actions
*   Access to sensitive resources

It ensures that **who** did **what**, **when**, and **why** can always be answered.

### Responsibilities

*   Capture security context (actor, roles, scopes)
*   Record action type and outcome
*   Attach correlation ID for traceability
*   Timestamp every event
*   Prevent modification or deletion of audit records

🏦 **In regulated systems, audit logs are treated as evidence, not diagnostics.**

### Typical Audit Events

| Event Type | Description |
| :--- | :--- |
| `TRANSACTION_APPROVED` | Approval of high-risk transfer |
| `TRANSACTION_REJECTED` | Explicit rejection |
| `RBAC_DENIED` | Authorization failure |
| `REPLAY_BLOCKED` | Duplicate request detected |
| `SECURITY_POLICY_VIOLATION` | Zero-Trust enforcement |

### Audit Event Context

Each audit record typically includes:

*   Actor identity (`sub`)
*   Actor roles
*   Action performed
*   Resource identifier
*   Correlation ID
*   Timestamp
*   Result (`SUCCESS` / `FAILURE`)

This enables:

*   Forensic analysis
*   Incident investigation
*   Compliance reporting

## Why Audit Is Inside Z-Trust

Placing audit inside the Zero-Trust boundary ensures:

*   Audit cannot be bypassed
*   Logs cannot be selectively written
*   Every privileged action is recorded consistently

🔐 **If an action is important enough to protect, it is important enough to audit.**

## Immutability Guarantee

In real systems:

*   Audit logs are **append-only**
*   Stored in **WORM storage**
*   Forwarded to **SIEM systems**

In this project:

*   Immutability is conceptually enforced
*   The architecture mirrors production-grade patterns

## What This Module Does NOT Do

*   Log application debug data
*   Replace standard application logging
*   Perform authorization checks
*   Manage log storage infrastructure

Those concerns are intentionally separated.

## Production Mapping

In production, this service would integrate with:

*   Centralized audit databases
*   SIEM platforms (Splunk, ELK, QRadar)
*   Regulatory reporting tools

This project focuses on architectural correctness, not vendor integration.

## Regulatory Alignment

This audit model aligns with:

*   PCI-DSS logging requirements
*   ISO 27001 audit controls
*   Internal banking governance standards
*   Operational risk management practices

## Key Takeaway

> **If it isn’t auditable, it isn’t secure.**

The Z-Trust Audit Layer ensures that every sensitive action is recorded, traceable, and defensible — by design.
