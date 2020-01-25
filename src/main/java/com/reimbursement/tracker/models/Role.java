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
    // Get role by ID

    public static String getRoleNameById(int id) {

        for (Role role : Role.values()) {
            if (role.roleId == id) {
                return role.roleName;
            }
        }
        return Role.EMPLOYEE.roleName;
    }

    public static int getRoleIdByName(String name) {

        for (Role role : Role.values()) {
            if (role.roleName == name) {
                return role.roleId;
            }
        }
        return Role.EMPLOYEE.roleId;
    }

}
