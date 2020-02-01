package com.reimbursement.tracker.servlets;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import com.reimbursement.tracker.dtos.Credentials;
import com.reimbursement.tracker.exceptions.AuthenticationException;
import com.reimbursement.tracker.models.User;
import com.reimbursement.tracker.repos.UserRepo;
import com.reimbursement.tracker.services.UserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/auth")
public class AuthServlet extends HttpServlet {

    private static final Logger LOGGER = LogManager.getLogger(AuthServlet.class);

    public final UserService userService = new UserService(new UserRepo());

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getSession(false) != null) {
            req.getSession().invalidate();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        ObjectMapper mapper = new ObjectMapper();
        PrintWriter writer = resp.getWriter();
        resp.setContentType("application/json");

        try {

            Credentials creds = mapper.readValue(req.getInputStream(), Credentials.class);
            User authUser = userService.authenticate(creds.getUsername(), creds.getPassword());
            String authUserJSON = mapper.writeValueAsString(authUser);
            writer.write(authUserJSON);
            HttpSession session = req.getSession();
            session.setAttribute("this-user", authUser);

        } catch (MismatchedInputException e) {
            resp.setStatus(400);
            LOGGER.warn(e.getMessage());
        } catch (AuthenticationException e) {
            resp.setStatus(401);
            LOGGER.warn(e.getMessage());
        } catch (Exception e) {
            resp.setStatus(500);
            LOGGER.error(e.getMessage());
            //e.printStackTrace();
        }
    }
}
