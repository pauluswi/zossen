package com.pswied.zossen.ztrust.audit;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ztrust/audit")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AuditEvent>> getAuditLogs() {
        // In a real system, we would add pagination and filtering here.
        // We would also enforce that only users with ROLE_AUDITOR can access this.
        return ResponseEntity.ok(auditService.getAuditLogs());
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyAuditChain() {
        boolean isValid = auditService.verifyChain();
        if (isValid) {
            return ResponseEntity.ok(Map.of(
                "status", "INTEGRITY_VERIFIED",
                "message", "The audit chain is valid. No tampering detected."
            ));
        } else {
            return ResponseEntity.status(409).body(Map.of(
                "status", "TAMPER_DETECTED",
                "message", "The audit chain has been compromised!"
            ));
        }
    }
}
