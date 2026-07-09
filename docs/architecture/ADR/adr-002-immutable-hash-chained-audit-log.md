# ADR 002: Immutable, Hash-Chained Audit Log

## Status
Accepted

## Context
Regulatory compliance (e.g., BaFin, MaRisk, BAIT) in the banking sector demands a highly reliable and tamper-evident audit trail for all significant actions. Traditional logging mechanisms might be susceptible to modification or deletion, which is unacceptable for financial systems. The Zossen platform needs to ensure the integrity and traceability of audit events.

## Decision
We will implement an immutable, hash-chained audit log for all critical and security-relevant events. Each audit event will include a hash of its own content combined with the hash of the previous event, forming a cryptographic chain that makes any tampering immediately detectable.

## Consequences
*   **Positive**:
    *   **Tamper-Evidence**: The hash-chaining mechanism provides strong cryptographic evidence against unauthorized modifications or deletions of audit records.
    *   **Regulatory Compliance**: Directly addresses requirements for auditability, traceability, and immutability mandated by financial regulations.
    *   **Integrity Verification**: Allows for easy verification of the entire audit trail's integrity at any point in time.
    *   **Enhanced Trust**: Increases confidence in the system's security and compliance posture.
*   **Negative**:
    *   **Complexity**: Adds complexity to the audit logging mechanism compared to simple append-only logs.
    *   **Performance Overhead**: Calculating and storing hashes for each event introduces a minor performance overhead, though typically acceptable for audit logs.
    *   **Storage**: Requires storing the `previousHash` for each event, slightly increasing storage requirements.
    *   **In-Memory Limitation (Showcase)**: For the showcase, the audit log is in-memory, which is not suitable for production and represents a technical debt for persistence.

## Alternatives Considered
*   **Simple Append-Only Logging**: Rejected because it does not provide cryptographic tamper-evidence, making it less suitable for strict regulatory environments.
*   **Centralized Log Management (e.g., ELK Stack)**: While valuable for operational monitoring, these systems typically do not inherently provide cryptographic immutability guarantees at the individual log entry level without additional custom mechanisms.
*   **Blockchain-based Logging**: Considered, but deemed overly complex and heavyweight for the current scope and showcase nature of the project, especially given the in-memory implementation for the prototype. Hash-chaining provides a simpler, more direct solution for the core immutability requirement.