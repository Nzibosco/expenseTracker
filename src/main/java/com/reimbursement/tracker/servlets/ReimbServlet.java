package com.reimbursement.tracker.servlets;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import com.reimbursement.tracker.dtos.ProcessReimbRequest;
import com.reimbursement.tracker.dtos.Request;
import com.reimbursement.tracker.exceptions.AuthenticationException;
import com.reimbursement.tracker.models.Reimbursement;
import com.reimbursement.tracker.models.User;
import com.reimbursement.tracker.repos.ReimbRepo;
import com.reimbursement.tracker.services.ReimbServices;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashSet;
import java.util.Set;

@WebServlet("/reimbs/*")
public class ReimbServlet extends HttpServlet {


    private final ReimbServices reimbServices = new ReimbServices(new ReimbRepo());
    //private static Reimbursement re = new Reimbursement();
    private static Set<Reimbursement> r = new HashSet<>();
    private static final Logger LOGGER = LogManager.getLogger(ReimbServlet.class);
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        ObjectMapper mapper = new ObjectMapper();
        resp.setContentType("application/json");
        String reimbIdParam = req.getParameter("reimbId");

        // param to get a reimb by status
        String reimbStatusParam = req.getParameter("reimbStatus");

        // param to get a reimb by author
        String reimbAuthParam = req.getParameter("reimbAuth");

        // param to get a reimb by type
        String reimbTypeParam = req.getParameter("reimbType");

        if (req.getSession(false) != null) {
            User thisUser = (User) req.getSession().getAttribute("this-user");
            LOGGER.info(thisUser);

        }

        // get reimbs by author
        if(reimbAuthParam != null){
            try {
                // empty reimb set for previous HTTP requests
                r.clear();
                reimbServices.getAllReimbs().forEach(reimbursement -> {
                    if(reimbursement.getAuthor() == Integer.parseInt(reimbAuthParam)){
                        r.add(reimbursement);
                    }
                });
                String reimbJSON = mapper.writeValueAsString(r);
                resp.getWriter().write(reimbJSON);

            } catch (Exception e) {
                resp.setStatus(400);
            }
        }
        // get reimbs by status
        else if (reimbStatusParam != null){

            try {
                // empty reimb set for previous HTTP requests
                r.clear();
                reimbServices.getAllReimbs().forEach(reimbursement -> {
                    if(reimbursement.getStatusId() == Integer.parseInt(reimbStatusParam)){
                        r.add(reimbursement);
                    }
                });
                String reimbJSON = mapper.writeValueAsString(r);
                resp.getWriter().write(reimbJSON);

            } catch (Exception e) {
                resp.setStatus(400);
            }
        }
        // get reimbs by type
        else if (reimbTypeParam != null){

            try {
                // empty reimb set for previous HTTP requests
                r.clear();
                reimbServices.getAllReimbs().forEach(reimbursement -> {
                    if(reimbursement.getTypeId() == Integer.parseInt(reimbTypeParam)){
                        r.add(reimbursement);
                    }
                });
                String reimbJSON = mapper.writeValueAsString(r);
                resp.getWriter().write(reimbJSON);

            } catch (Exception e) {
                resp.setStatus(400);
                LOGGER.error(e.getMessage());
            }

        }
        // get reimbs by id
        else if (reimbIdParam != null){

            try {
                // empty reimb set for previous HTTP requests
                r.clear();
                reimbServices.getAllReimbs().forEach(reimbursement -> {
                    if(reimbursement.getReimbId() == Integer.parseInt(reimbIdParam)){

                        r.add(reimbursement);
                    }
                });
                    String reimbJSON = mapper.writeValueAsString(r);
                    resp.getWriter().write(reimbJSON);


            } catch (Exception e) {
                resp.setStatus(400);
                LOGGER.error(e.getMessage());
            }

        }     else {

            Set<Reimbursement> reimbs = reimbServices.getAllReimbs();
            String reimbJSON = mapper.writeValueAsString(reimbs);
            resp.getWriter().write(reimbJSON);

        }

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        ObjectMapper mapper = new ObjectMapper();
        PrintWriter writer = resp.getWriter();

        try {
            Request re = mapper.readValue(req.getInputStream(), Request.class);
            Reimbursement reimb = new Reimbursement();
            reimb.setAmount(re.getAmount());
            reimb.setDescription(re.getDescription());
            reimb.setAuthor(re.getAuthor());
            reimb.setTypeId(re.getTypeId());

            reimbServices.registerReimb(reimb);

            String newReimbJSON = mapper.writeValueAsString(reimb);
            writer.write(newReimbJSON);

        } catch (MismatchedInputException e) {
            resp.setStatus(400);
            LOGGER.warn(e.getMessage());
        } catch (AuthenticationException e) {
            resp.setStatus(401);
            LOGGER.warn(e.getMessage());
        } catch (Exception e) {
            resp.setStatus(500);
            LOGGER.error(e.getMessage());
        }

    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        resp.setContentType("application/json");
        ObjectMapper mapper = new ObjectMapper();
        PrintWriter writer = resp.getWriter();

        try {
            ProcessReimbRequest re = mapper.readValue(req.getInputStream(), ProcessReimbRequest.class);
            reimbServices.processReimb(re.getReimbId(), re.getDecision(), re.getResolverId());

            String newUpdatedReimbJSON = mapper.writeValueAsString(re);
            writer.write(newUpdatedReimbJSON);

        } catch (MismatchedInputException e) {
            resp.setStatus(400);
            LOGGER.warn(e.getMessage());
        } catch (AuthenticationException e) {
            resp.setStatus(401);
            LOGGER.warn(e.getMessage());
        } catch (Exception e) {
            resp.setStatus(500);
            LOGGER.error(e.getMessage());
        }
    }

}
