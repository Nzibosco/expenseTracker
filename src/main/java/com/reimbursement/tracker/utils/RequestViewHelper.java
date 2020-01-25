package com.reimbursement.tracker.utils;

public class RequestViewHelper {

    public static String process(String uri) {

        switch (uri) {
            case "/tracker/login.view":
                return "partials/login.html";
            case "/tracker/register.view":
                return "partials/register.html";
            case "/tracker/login/dashboard":
                return "tracker/dashboard.html";
            default:
                return "";
        }
    }
}