package com.reimbursement.tracker.models;

public enum Role {
    ADMIN(1, "Admin"), EMPLOYEE(2, "Employee"),
    MANAGER(3, "Manager");

    private int roleId;
    private String roleName;

    Role(int roleId, String roleName) {
        this.roleId = roleId;
        this.roleName = roleName;
    }

    public int getRoleId() {
        return roleId;
    }

    public String getRoleName() {
        return roleName;
    }
}
