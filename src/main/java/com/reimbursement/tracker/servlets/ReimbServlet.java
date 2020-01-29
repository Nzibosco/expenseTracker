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

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Set;

@WebServlet("/reimbs/*")
public class ReimbServlet extends HttpServlet {


    private final ReimbServices reimbServices = new ReimbServices(new ReimbRepo());
    private static Reimbursement r = new Reimbursement();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        ObjectMapper mapper = new ObjectMapper();
        resp.setContentType("application/json");
        String reimbIdParam = req.getParameter("reimbId");

        if (req.getSession(false) != null) {
            User thisUser = (User) req.getSession().getAttribute("this-user");
            System.out.println(thisUser);
        }

        if (reimbIdParam == null) {

            Set<Reimbursement> reimbs = reimbServices.getAllReimbs();
            String reimbJSON = mapper.writeValueAsString(reimbs);
            resp.getWriter().write(reimbJSON);

        } else {

            try {

                reimbServices.getAllReimbs().forEach(reimbursement -> {
                    if(reimbursement.getReimbId() == Integer.parseInt(reimbIdParam)){
                        r = reimbursement;
                    }
                });
                String reimbJSON = mapper.writeValueAsString(r);
                resp.getWriter().write(reimbJSON);

            } catch (Exception e) {
                resp.setStatus(400);
            }

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
        } catch (AuthenticationException e) {
            resp.setStatus(401);
        } catch (Exception e) {
            resp.setStatus(500);
            e.printStackTrace();
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
        } catch (AuthenticationException e) {
            resp.setStatus(401);
        } catch (Exception e) {
            resp.setStatus(500);
            e.printStackTrace();
        }
    }

}
