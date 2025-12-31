package com.pswied.zossen.ztrust.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

/**
 * Responsible for recording immutable audit logs for all security-critical actions.
 * In a real system, this would write to a WORM (Write Once Read Many) storage or SIEM.
 */
@Service
public class AuditService {

    private static final Logger logger = LoggerFactory.getLogger("AUDIT_LOG");

    public void logTransaction(String actor, String action, String resourceId, String result, String reason) {
        String correlationId = UUID.randomUUID().toString();
        Instant timestamp = Instant.now();

        // Structured logging format for easy parsing (JSON-like)
        logger.info("AUDIT_EVENT | id={} | time={} | actor={} | action={} | resource={} | result={} | reason={}",
                correlationId, timestamp, actor, action, resourceId, result, reason);
    }

    public void logSecurityEvent(String actor, String eventType, String details) {
        String correlationId = UUID.randomUUID().toString();
        Instant timestamp = Instant.now();

        logger.warn("SECURITY_EVENT | id={} | time={} | actor={} | type={} | details={}",
                correlationId, timestamp, actor, eventType, details);
    }
}
