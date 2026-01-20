package com.pswied.zossen.ztrust.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Responsible for recording immutable audit logs for all security-critical actions.
 * Implements Hash Chaining to ensure tamper-evidence.
 */
@Service
public class AuditService {

    private static final Logger logger = LoggerFactory.getLogger("AUDIT_LOG");
    private final RiskClassifier riskClassifier;
    
    // In-memory storage for demonstration. In prod, this would be a database.
    private final List<AuditEvent> eventStore = Collections.synchronizedList(new ArrayList<>());
    private static final String GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";
    private String lastHash = GENESIS_HASH;

    public AuditService(RiskClassifier riskClassifier) {
        this.riskClassifier = riskClassifier;
        createInitialMockData();
    }

    private void createInitialMockData() {
        // CRITICAL Event
        createAndStoreEvent("user", "RBAC_DENIED", "025093000003", "FAILURE", "User with roles [ROLE_USER] attempted approval.");
        
        // WARNING Event
        createAndStoreEvent("supervisor", "EXECUTE_APPROVAL", "025093000002", "FAILURE", "Core banking timeout");

        // INFO Event
        createAndStoreEvent("supervisor", "LOGIN", "N/A", "SUCCESS", "User authenticated successfully");
    }

    public void logTransaction(String actor, String action, String resourceId, String result, String details) {
        createAndStoreEvent(actor, action, resourceId, result, details);
    }

    public void logSecurityEvent(String actor, String eventType, String details) {
        createAndStoreEvent(actor, eventType, "N/A", "FAILURE", details);
    }

    private void createAndStoreEvent(String actor, String action, String resourceId, String result, String details) {
        RiskLevel risk = riskClassifier.classify(action, result);
        String id = UUID.randomUUID().toString();
        Instant now = Instant.now();

        AuditEvent event = new AuditEvent(id, now, actor, action, resourceId, result, details, risk, lastHash);
        
        // Calculate Hash: SHA256(id + timestamp + actor + action + result + prevHash)
        String signature = calculateHash(event);
        event.setHash(signature);
        
        // Update chain
        lastHash = signature;
        eventStore.add(event);

        // Log to console/file as well
        logger.info("AUDIT_EVENT | id={} | time={} | risk={} | actor={} | action={} | hash={}",
                id, now, risk, actor, action, signature);
    }

    private String calculateHash(AuditEvent event) {
        try {
            String data = event.getId() + event.getTimestamp().toString() + event.getActor() + 
                          event.getAction() + event.getResult() + event.getPreviousHash();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    private static String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public List<AuditEvent> getAuditLogs() {
        return new ArrayList<>(eventStore); // Return copy
    }

    /**
     * Verifies the integrity of the entire audit chain.
     * @return true if the chain is valid, false otherwise.
     */
    public boolean verifyChain() {
        String previousHash = GENESIS_HASH;
        for (AuditEvent event : eventStore) {
            // Check if the previous hash matches the one stored in the current event
            if (!event.getPreviousHash().equals(previousHash)) {
                logger.error("Chain tamper detected! Event ID: {}. Expected previous hash: {}, but got: {}",
                        event.getId(), previousHash, event.getPreviousHash());
                return false;
            }

            // Recalculate the hash of the current event and check if it matches the stored hash
            String recalculatedHash = calculateHash(event);
            if (!event.getHash().equals(recalculatedHash)) {
                logger.error("Chain tamper detected! Event ID: {}. Hash mismatch. Stored: {}, Recalculated: {}",
                        event.getId(), event.getHash(), recalculatedHash);
                return false;
            }

            // Move to the next link in the chain
            previousHash = event.getHash();
        }
        logger.info("Audit chain verification successful. No tampering detected.");
        return true;
    }
}
