package com.pswied.zossen.ztrust.transaction;

import com.pswied.zossen.ztrust.audit.AuditService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * The final execution point for high-risk transactions.
 * This service assumes that ALL security checks (Authentication, RBAC, Policy)
 * have already been passed by the Z-Trust Gateway.
 */
@Service
public class SecureTransactionService {

    private static final Logger logger = LoggerFactory.getLogger(SecureTransactionService.class);
    private final AuditService auditService;

    public SecureTransactionService(AuditService auditService) {
        this.auditService = auditService;
    }

    public void executeApproval(String transactionId, String approverId) {
        logger.info("Executing secure approval for transaction: {}", transactionId);

        // 1. Simulate Core Banking Call (Idempotent)
        boolean success = simulateCoreBankingCall(transactionId);

        // 2. Audit the execution result
        if (success) {
            auditService.logTransaction(approverId, "EXECUTE_APPROVAL", transactionId, "SUCCESS", "Transaction finalized in core");
        } else {
            auditService.logTransaction(approverId, "EXECUTE_APPROVAL", transactionId, "FAILURE", "Core banking timeout");
            throw new RuntimeException("Transaction execution failed");
        }
    }

    private boolean simulateCoreBankingCall(String transactionId) {
        // Simulate a successful downstream call
        try {
            Thread.sleep(100); // Simulate network latency
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return true;
    }
}
