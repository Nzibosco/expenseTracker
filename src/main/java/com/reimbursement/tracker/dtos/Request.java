package com.reimbursement.tracker.dtos;

public class Request {

    private double amount;
    private String description;
    private int author;
    private int typeId;

    public Request() {
        super();
    }

    public Request(double amount, String description, int author, int typeId) {
        this.amount = amount;
        this.description = description;
        this.author = author;
        this.typeId = typeId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getAuthor() {
        return author;
    }

    public void setAuthor(int author) {
        this.author = author;
    }

    public int getTypeId() {
        return typeId;
    }

    public void setTypeId(int typeId) {
        this.typeId = typeId;
    }
}
