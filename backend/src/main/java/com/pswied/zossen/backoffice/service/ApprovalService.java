package com.pswied.zossen.backoffice.service;

import com.pswied.zossen.ztrust.gateway.ZTrustSecurityGateway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Handles business logic for transaction approvals.
 * Note: This service does NOT perform security checks.
 * It delegates secure execution to the Z-Trust Gateway.
 */
@Service
public class ApprovalService {

    private static final Logger logger = LoggerFactory.getLogger(ApprovalService.class);
    private final ZTrustSecurityGateway zTrustGateway;

    public ApprovalService(ZTrustSecurityGateway zTrustGateway) {
        this.zTrustGateway = zTrustGateway;
    }

    public void approveTransaction(String transactionId) {
        logger.info("Business validation started for transaction: {}", transactionId);

        // 1. Business Validation (Simulated)
        if (transactionId == null || transactionId.trim().isEmpty()) {
            throw new IllegalArgumentException("Transaction ID cannot be empty");
        }

        // 2. Delegate to Z-Trust for Security Enforcement & Execution
        // We do not check roles here. We trust the Gateway to do it.
        zTrustGateway.approveTransaction(transactionId);
        
        logger.info("Business validation completed for transaction: {}", transactionId);
    }
}
