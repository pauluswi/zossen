package com.pswied.zossen.ztrust.gateway;

import com.pswied.zossen.ztrust.audit.AuditService;
import com.pswied.zossen.ztrust.transaction.SecureTransactionService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * The Policy Enforcement Point (PEP).
 * All high-risk requests MUST pass through this gateway.
 * It enforces Zero-Trust principles: Verify Explicitly, Least Privilege.
 */
@Component
public class ZTrustSecurityGateway {

    private final SecureTransactionService transactionService;
    private final AuditService auditService;

    public ZTrustSecurityGateway(SecureTransactionService transactionService, AuditService auditService) {
        this.transactionService = transactionService;
        this.auditService = auditService;
    }

    public void approveTransaction(String transactionId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String actor = auth.getName();

        // 1. Enforce RBAC (Role-Based Access Control)
        boolean hasAuthority = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_APPROVER"));

        if (!hasAuthority) {
            auditService.logSecurityEvent(actor, "RBAC_DENIED", "User attempted approval without ROLE_APPROVER");
            throw new SecurityException("Access Denied: Missing required role");
        }

        // 2. Enforce Contextual Policy (e.g., Time of day, Location - simulated here)
        // In a real system, we might check if the user is on a VPN or if it's business hours.
        
        // 3. Audit the intent
        auditService.logTransaction(actor, "ATTEMPT_APPROVAL", transactionId, "PENDING", "Policy checks passed");

        // 4. Delegate to Secure Execution Layer
        transactionService.executeApproval(transactionId, actor);
    }
}
