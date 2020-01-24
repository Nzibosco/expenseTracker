package com.reimbursement.tracker.models;

public enum Role {
    ADMIN(1, "Admin"), EMPLOYEE(2, "Employee"),
    MANAGER(3, "Manager");

    private int roleId;
    private String name;

    Role(int roleId, String name) {
        this.roleId = roleId;
        this.name = name;
    }

    public int getRoleId() {
        return roleId;
    }

    public String getName() {
        return name;
    }
}
