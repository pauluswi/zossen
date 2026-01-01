package com.pswied.zossen.ztrust.audit;

import org.springframework.stereotype.Component;

@Component
public class RiskClassifier {

    public RiskLevel classify(String action, String result) {
        if ("RBAC_DENIED".equals(action) || "SECURITY_VIOLATION".equals(action)) {
            return RiskLevel.CRITICAL;
        }
        if ("FAILURE".equals(result)) {
            return RiskLevel.WARNING;
        }
        if ("EXECUTE_APPROVAL".equals(action) || "ATTEMPT_APPROVAL".equals(action)) {
            return RiskLevel.INFO; // Normal business operation
        }
        return RiskLevel.INFO;
    }
}
