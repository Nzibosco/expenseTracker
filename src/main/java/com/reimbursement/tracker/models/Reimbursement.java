package com.reimbursement.tracker.models;

import java.util.Objects;

public class Reimbursement {

    private int reimbId;
    private double amount;
    private String submittedOn;
    private String resolvedOn;
    private String description;
    private String receipt;
    private int author;
    private int resolver;
    private int statusId;
    private int typeId;

    public Reimbursement() {
        super();
    }

    public int getReimbId() {
        return reimbId;
    }

    public void setReimbId(int reimbId) {
        this.reimbId = reimbId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getSubmittedOn() {
        return submittedOn;
    }

    public void setSubmittedOn(String submittedOn) {
        this.submittedOn = submittedOn;
    }

    public String getResolvedOn() {
        return resolvedOn;
    }

    public void setResolvedOn(String resolvedOn) {
        this.resolvedOn = resolvedOn;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getReceipt() {
        return receipt;
    }

    public void setReceipt(String receipt) {
        this.receipt = receipt;
    }

    public int getAuthor() {
        return author;
    }

    public void setAuthor(int author) {
        this.author = author;
    }

    public int getResolver() {
        return resolver;
    }

    public void setResolver(int resolver) {
        this.resolver = resolver;
    }

    public int getStatusId() {
        return statusId;
    }

    public void setStatusId(int statusId) {
        this.statusId = statusId;
    }

    public int getTypeId() {
        return typeId;
    }

    public void setTypeId(int typeId) {
        this.typeId = typeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Reimbursement)) return false;
        Reimbursement that = (Reimbursement) o;
        return getReimbId() == that.getReimbId() &&
                Double.compare(that.getAmount(), getAmount()) == 0 &&
                getAuthor() == that.getAuthor() &&
                getResolver() == that.getResolver() &&
                getStatusId() == that.getStatusId() &&
                getTypeId() == that.getTypeId() &&
                Objects.equals(getSubmittedOn(), that.getSubmittedOn()) &&
                Objects.equals(getResolvedOn(), that.getResolvedOn()) &&
                Objects.equals(getDescription(), that.getDescription()) &&
                Objects.equals(getReceipt(), that.getReceipt());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getReimbId(), getAmount(), getSubmittedOn(), getResolvedOn(), getDescription(), getReceipt(), getAuthor(), getResolver(), getStatusId(), getTypeId());
    }

    @Override
    public String toString() {
        return "Reimbursement{" +
                "reimbId=" + reimbId +
                ", amount=" + amount +
                ", submittedOn='" + submittedOn + '\'' +
                ", resolvedOn='" + resolvedOn + '\'' +
                ", description='" + description + '\'' +
                ", receipt='" + receipt + '\'' +
                ", author=" + author +
                ", resolver=" + resolver +
                ", statusId=" + statusId +
                ", typeId=" + typeId +
                '}';
    }
}
