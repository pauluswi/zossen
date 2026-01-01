package com.pswied.zossen.ztrust.gateway;

import com.pswied.zossen.ztrust.audit.AuditService;
import com.pswied.zossen.ztrust.transaction.SecureTransactionService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * The Policy Enforcement Point (PEP).
 * All high-risk requests MUST pass through this gateway.
 * It enforces Zero-Trust principles: Verify Explicitly, Least Privilege.
 */
@Component
public class ZTrustSecurityGateway {

    private final SecureTransactionService transactionService;
    private final AuditService auditService;
    private static final Set<String> REQUIRED_ROLES = Set.of("ROLE_ADMIN", "ROLE_SUPERVISOR");

    public ZTrustSecurityGateway(SecureTransactionService transactionService, AuditService auditService) {
        this.transactionService = transactionService;
        this.auditService = auditService;
    }

    public void approveTransaction(String transactionId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String actor = auth.getName();

        // 1. Enforce RBAC (Role-Based Access Control)
        boolean hasAuthority = auth.getAuthorities().stream()
                .map(Object::toString)
                .anyMatch(REQUIRED_ROLES::contains);

        if (!hasAuthority) {
            String userRoles = auth.getAuthorities().stream().map(Object::toString).collect(Collectors.joining(","));
            auditService.logSecurityEvent(actor, "RBAC_DENIED", "User with roles [" + userRoles + "] attempted approval.");
            throw new SecurityException("Access Denied: User lacks one of the required roles: " + REQUIRED_ROLES);
        }

        // 2. Enforce Contextual Policy (e.g., Time of day, Location - simulated here)
        // In a real system, we might check if the user is on a VPN or if it's business hours.
        
        // 3. Audit the intent
        auditService.logTransaction(actor, "ATTEMPT_APPROVAL", transactionId, "PENDING", "Policy checks passed");

        // 4. Delegate to Secure Execution Layer
        transactionService.executeApproval(transactionId, actor);
    }
}
