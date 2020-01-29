package com.reimbursement.tracker.dtos;

public class ProcessReimbRequest {

    private int reimbId;
    private String decision;
    private int resolverId;

    public ProcessReimbRequest() {
        super();
    }

    public ProcessReimbRequest(int reimbId, String decision, int resolverId) {
        this.reimbId = reimbId;
        this.decision = decision;
        this.resolverId = resolverId;
    }

    public int getReimbId() {
        return reimbId;
    }

    public void setReimbId(int reimbId) {
        this.reimbId = reimbId;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public int getResolverId() {
        return resolverId;
    }

    public void setResolverId(int resolverId) {
        this.resolverId = resolverId;
    }
}
