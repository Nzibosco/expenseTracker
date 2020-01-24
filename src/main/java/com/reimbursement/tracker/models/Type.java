package com.reimbursement.tracker.models;

public enum Type {
    LODGING(1, "Lodging"),
    TRAVEL(2, "Travel"),
    FOOD(3, "Food"),
    OTHER(4, "Other");

    private int typeId;
    private String typeName;

    Type(int typeId, String typeName) {
        this.typeId = typeId;
        this.typeName = typeName;
    }

    public int getTypeId() {
        return typeId;
    }

    public String getTypeName() {
        return typeName;
    }
}
