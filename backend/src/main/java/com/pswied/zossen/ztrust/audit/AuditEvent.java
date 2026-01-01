package com.pswied.zossen.ztrust.audit;

import java.time.Instant;

public class AuditEvent {
    private String id;
    private Instant timestamp;
    private String actor;
    private String action;
    private String resourceId;
    private String result;
    private String details;
    private RiskLevel riskLevel;
    private String hash;
    private String previousHash;

    // Constructors, Getters, Setters
    public AuditEvent() {}

    public AuditEvent(String id, Instant timestamp, String actor, String action, String resourceId, String result, String details, RiskLevel riskLevel, String previousHash) {
        this.id = id;
        this.timestamp = timestamp;
        this.actor = actor;
        this.action = action;
        this.resourceId = resourceId;
        this.result = result;
        this.details = details;
        this.riskLevel = riskLevel;
        this.previousHash = previousHash;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getActor() { return actor; }
    public void setActor(String actor) { this.actor = actor; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public String getHash() { return hash; }
    public void setHash(String hash) { this.hash = hash; }

    public String getPreviousHash() { return previousHash; }
    public void setPreviousHash(String previousHash) { this.previousHash = previousHash; }

    @Override
    public String toString() {
        return "AuditEvent{" +
                "id='" + id + '\'' +
                ", timestamp=" + timestamp +
                ", actor='" + actor + '\'' +
                ", action='" + action + '\'' +
                ", resourceId='" + resourceId + '\'' +
                ", result='" + result + '\'' +
                ", details='" + details + '\'' +
                ", riskLevel=" + riskLevel +
                ", hash='" + hash + '\'' +
                ", previousHash='" + previousHash + '\'' +
                '}';
    }
}
