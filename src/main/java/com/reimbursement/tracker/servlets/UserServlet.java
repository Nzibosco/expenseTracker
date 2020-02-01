package com.reimbursement.tracker.servlets;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import com.reimbursement.tracker.dtos.ErrorResponse;
import com.reimbursement.tracker.exceptions.ResourcePersistenceException;
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
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Set;

@WebServlet("/users/*")
public class UserServlet extends HttpServlet {

    private final UserService userService = new UserService(new UserRepo());
    private static final Logger LOGGER = LogManager.getLogger(UserServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        ObjectMapper mapper = new ObjectMapper();
        resp.setContentType("application/json");
        String userIdParam = req.getParameter("userId");

        if (req.getSession(false) != null) {
            User thisUser = (User) req.getSession().getAttribute("this-user");
            LOGGER.info("LOGGED IN USER \n" + thisUser);
        }

        if (userIdParam == null) {

            Set<User> users = userService.getAllUsers();
            String usersJSON = mapper.writeValueAsString(users);
            resp.getWriter().write(usersJSON);
            LOGGER.info("User with the following info " + (User)req.getSession().getAttribute("this-user") + "\n attempted to " +
                    "to make a get request for all users in DB.");

        } else {

            try {
                User user = userService.getUserById(Integer.parseInt(userIdParam));
                String userJSON = mapper.writeValueAsString(user);
                resp.getWriter().write(userJSON);

            } catch (Exception e) {
                resp.setStatus(400);
                LOGGER.warn(e.getMessage());
            }

        }

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ObjectMapper mapper = new ObjectMapper();
        PrintWriter writer = resp.getWriter();

        try {

            User newUser = mapper.readValue(req.getInputStream(), User.class);
            userService.register(newUser);
            String newUserJSON = mapper.writeValueAsString(newUser);
            writer.write(newUserJSON);
            //resp.setStatus(201); // created;

        } catch (MismatchedInputException e) {
            resp.setStatus(400); // bad request
            LOGGER.warn(e.getMessage());
        } catch (ResourcePersistenceException e) {
            resp.setStatus(409); // conflict
            ErrorResponse err = new ErrorResponse(409, System.currentTimeMillis());
            err.setMessage(e.getMessage());
            LOGGER.warn(err.getMessage());
            writer.write(mapper.writeValueAsString(err));
        } catch (Exception e) {
            resp.setStatus(500); // internal server error
            LOGGER.error(e.getMessage());
        }

    }
}

