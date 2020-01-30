package com.reimbursement.tracker.services;

import com.reimbursement.tracker.exceptions.InvalidRequestException;
import com.reimbursement.tracker.exceptions.ResourceNotFoundException;
import com.reimbursement.tracker.models.Reimbursement;
import com.reimbursement.tracker.repos.ReimbRepo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Set;

public class ReimbServices {

    private ReimbRepo reimbRepo;

    public ReimbServices( ReimbRepo reimbRepo) {
        this.reimbRepo = reimbRepo;
    }

    // creating a reimbursement
    public void registerReimb(Reimbursement newReimb) {
        if (!isReimbValid(newReimb)) throw new InvalidRequestException();
        Double amount = validatedAmount(newReimb.getAmount());
        System.out.println(amount);
        Reimbursement r = newReimb;
        r.setAmount(amount);

        reimbRepo.save(newReimb);
    }

    // approve or deny a reimbursement request
    public boolean processReimb(int id, String decision, int resolver){
        if(negativeValuesChecker(Double.valueOf(id))) return false;
        if(negativeValuesChecker(Double.valueOf(resolver))) return false;
        if(decision == null || decision.trim().equals("") || decision.trim() == null) return false;
        boolean reimbProcessed = false;
        if(decision.equals("Denied") || decision.equals("Approved")) {
            reimbProcessed = reimbRepo.processRequest(id, decision, resolver);
        }
        return reimbProcessed;
    }

    // get all reimbursements
    public Set<Reimbursement> getAllReimbs(){

        Set<Reimbursement> reimbs;

        reimbs = reimbRepo.findAll();
        if (reimbs.isEmpty()) {
            throw new ResourceNotFoundException();
        }
        return reimbs;
    }

    // method to validate and format amount deposited or withdrawn
    private Double validatedAmount (Double amount){
        if(amount.isNaN() || amount < 0) return 0.0;

        try{
            // limit decimal points to 2.
            BigDecimal toTwoDecimal = BigDecimal.valueOf(amount);
            amount = toTwoDecimal.setScale(2, RoundingMode.DOWN).doubleValue();
        } catch (Exception e){
            throw new InvalidRequestException();
        }
        return amount;
    }

    private boolean negativeValuesChecker(Double amount){
        return amount <= 0;
    }

    private Boolean isReimbValid(Reimbursement reimb) {
        Double amount = reimb.getAmount();
        Double authorId = Double.valueOf(reimb.getAuthor());
        if (reimb == null) return false;
        if (negativeValuesChecker(reimb.getAmount()) || amount == null || reimb.getDescription().trim().equals("")) return false;
        if (authorId == null) return false;
        return Double.valueOf(reimb.getTypeId()) != null;
    }

}
