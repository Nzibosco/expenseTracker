package com.reimbursement.tracker;
import com.reimbursement.tracker.models.*;
import com.reimbursement.tracker.repos.ReimbRepo;
import com.reimbursement.tracker.repos.UserRepo;
import com.reimbursement.tracker.services.UserService;
import com.sun.xml.internal.ws.api.model.wsdl.WSDLOutput;

import java.sql.*;
import java.util.HashSet;
import java.util.Set;

import static com.reimbursement.tracker.utils.ConnectionFactory.*;

public class AppDriver {

    public static void main (String ... args){
//        try(Connection conn = getInstance().getConnection()){
////
////            String sql = "SELECT * FROM users";
////            Statement pstmt = conn.createStatement();
////
////            ResultSet rs = pstmt.executeQuery(sql);
////            while(rs.next()){
////                System.out.println("User id: " + rs.getInt(1));
////                System.out.println("email: " + rs.getString(4));
////            }
////
////        }catch (SQLException e){
////            e.printStackTrace();
////        }
////
        try{
//            Reimbursement r = new Reimbursement();
//            r.setAmount(210);
//            r.setDescription("give me my money nooooow!!!");
//            r.setAuthor(1);
//            r.setTypeId(1);
            ReimbRepo repo = new ReimbRepo();
//            UserService us = new UserService(new UserRepo());
////            repo.findAll();
//            Set<Reimbursement> rs = repo.findAll();
//            Set<User> users = new HashSet<>();
//            rs.stream().forEach(reimbursement -> {
//
//                if(reimbursement.getStatusId() == Status.DENIED.getStatusId()) {
//                    //String lname = us.getUserById(reimbursement.getResolver()).getLname();
//                    //User u = us.getUserById(reimbursement.getResolver());
//                    User u = us.getUserById(reimbursement.getResolver());
//                    users.add(u);
//                    //System.out.println(reimbursement.getResolver());
//
//                    }
//            });
//
//            users.stream().forEach(user -> System.out.println(user.getLname()));
            repo.processRequest(22, "Approved", 2);


        }catch (Exception e){
            e.printStackTrace();
        }
}

}
