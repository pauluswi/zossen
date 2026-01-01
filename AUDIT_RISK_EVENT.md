# 🏦 Banking Audit & Risk Event
**BaFin-Style Audit, Risk Classification and Regulatory Reporting**

---

## 📌 Overview

The **Banking Audit & Risk Event** is a standalone audit microservice designed to collect, classify, store, and report security- and transaction-related events in a **traceable and audit-ready** manner.

The platform demonstrates how typical **German banking and regulatory expectations** (e.g. BaFin, MaRisk, BAIT) can be implemented from a technical architecture perspective.

---

## 🎯 Purpose

This project is intended to demonstrate:

- Immutable audit logging
- Deterministic risk classification
- Technical audit controls
- Regulatory-oriented reporting
- Data retention and archiving concepts

**Focus:** compliance-aware system design and architecture  
**Out of scope:** business banking logic

---

## 🏛️ Regulatory Context (Germany)

The design follows principles commonly required in German financial institutions:

- **MaRisk** – Minimum Requirements for Risk Management
- **BAIT** – Banking Supervisory Requirements for IT
- **GoBD** – Principles for Proper Accounting Records
- **GDPR / DSGVO** – Data retention and access control

> Audit data must be complete, tamper-evident, traceable, and reviewable.

---

## 🧠 Architecture Overview

```
[ Banking Applications / APIs / Middleware ]
                   |
                   v
      ┌────────────────────────────┐
      │ Audit & Risk Microservice  │
      └────────────────────────────┘
         │           │           │
         │           │           │
   Event Store   Risk Engine   Reporting
         │
   Immutable Audit Database
```

### Architectural Principles

- Append-only data storage
- Strict separation of business data and audit data
- Event-driven processing
- Clear technical and organizational controls

---

## ✨ Key Features

### 1️⃣ Immutable Audit Trail

- No UPDATE or DELETE operations
- Events are stored as append-only records
- Corrections are handled via compensating events
- Optional hash chaining for tamper detection

**Objective:** technical immutability aligned with audit requirements

---

### 2️⃣ Event and Risk Classification

Each incoming event is automatically classified:

| Risk Level | Description |
|----------|------------|
| INFO | Normal operational activity |
| WARNING | Suspicious or abnormal behavior |
| CRITICAL | Regulatory or security-relevant incident |

**Examples**

- INFO → Balance inquiry
- WARNING → Multiple failed login attempts
- CRITICAL → Unauthorized transaction execution

Classification is rule-based and fully auditable.

---

### 3️⃣ Audit and Regulatory Reporting

#### 📄 CSV Export
- Intended for auditors and supervisory authorities
- Structured, filterable datasets

#### 📄 PDF Mock Reports
- Intended for management and compliance teams
- Contains:
    - Reporting period
    - Risk overview
    - List of critical events
    - Applied control measures

---

### 4️⃣ Retention and Archiving Concept

Simulation of regulatory data retention periods:

| Risk Level | Retention Period |
|----------|------------------|
| INFO | 2 years |
| WARNING | 5 years |
| CRITICAL | 10 years |

- No physical deletion
- State transitions only: `ACTIVE → ARCHIVED → EXPIRED`
- Access restriction instead of data removal

---

## 🔐 Security Model

- OAuth2 / OpenID Connect
- Mutual TLS (mTLS) between services
- Role-based access control (RBAC)

### Roles

| Role | Permission |
|----|-----------|
| SYSTEM | Create audit events |
| AUDITOR | Read-only access |
| COMPLIANCE | Reporting and export |

> The audit service also records access to its own APIs.

---

## 📡 API Overview

### Create Audit Event
```http
POST /audit/events
```

```json
{
  "sourceSystem": "PAYMENT-SERVICE",
  "eventType": "TRANSFER_EXECUTED",
  "actor": "system",
  "entityId": "TX-2025-0001",
  "details": {
    "amount": 5000,
    "currency": "EUR"
  }
}
```

---

### Query Audit Events
```http
GET /audit/events?riskLevel=CRITICAL&period=2025-Q1
```

---

### Export Audit Data
```http
GET /audit/export?format=csv&period=2025-Q1
```

---

## 🗄️ Data Model (Excerpt)

```
AuditEvent
---------
event_id (UUID)
timestamp
source_system
actor
event_type
risk_level
payload (JSON)
hash
previous_hash
retention_state
```

**Hash chaining rationale**

- Detects tampering attempts
- Increases audit reliability
- Easy to explain to auditors and regulators

---

## 🧰 Technology Stack

- Java 17
- Spring Boot
- PostgreSQL (append-only schema)
- Flyway (schema versioning)
- OpenAPI
- Docker

Optional components:
- Kafka (event ingestion)
- Object storage (archival data)

---

## 🧪 Example Scenarios

1. Multiple failed logins → WARNING
2. Unauthorized API access → CRITICAL
3. Quarterly audit export
4. Retention job archives expired INFO events
5. Integrity check detects data manipulation attempt

---

## 🧭 Intended Audience

- Banks and savings banks
- BaFin-regulated FinTechs
- IT audit and compliance teams
- Financial services software architects

---

## ⚠️ Disclaimer

This project is provided **for demonstration and educational purposes only**  
and does **not** represent a production-ready compliance solution.

---

## 👤 Author

**Slamet Widodo**  
Senior Software Engineer – Banking & Middleware  
Focus areas: Java, Microservices, Security, Banking Compliance
