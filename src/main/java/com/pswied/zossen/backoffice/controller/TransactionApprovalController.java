package com.pswied.zossen.backoffice.controller;

import com.pswied.zossen.backoffice.service.ApprovalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/backoffice")
public class TransactionApprovalController {

    private final ApprovalService approvalService;

    public TransactionApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @PostMapping("/approve")
    public ResponseEntity<Map<String, String>> approveTransaction(@RequestParam String transactionId) {
        // The controller is thin. It just passes data to the service.
        // Authentication is already handled by the Security Filter Chain.
        
        approvalService.approveTransaction(transactionId);

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Transaction approved and executed securely",
                "transactionId", transactionId
        ));
    }
}
