package com.reimbursement.tracker.exceptions;

public class AuthenticationException extends RuntimeException {

    public AuthenticationException() {
        super("Authentication failed!");
    }

}
