package com.reimbursement.tracker.models;

public enum Status {
    PENDING(1, "Pending"),
    APPROVED(2, "Approved"),
    DENIED(3, "Denied");

    private int statusId;
    private String statusName;

    Status(int statusId, String statusName) {
        this.statusId = statusId;
        this.statusName = statusName;
    }

    public int getStatusId() {
        return statusId;
    }

    public String getStatusName() {
        return statusName;
    }
}
