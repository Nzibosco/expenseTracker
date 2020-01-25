package com.reimbursement.tracker;
import com.reimbursement.tracker.models.Role;

import java.sql.*;

import static com.reimbursement.tracker.utils.ConnectionFactory.*;

public class AppDriver {

    public static void main (String ... args){
        try(Connection conn = getInstance().getConnection()){

            String sql = "SELECT * FROM roles";
            Statement pstmt = conn.createStatement();

            ResultSet rs = pstmt.executeQuery(sql);
            while(rs.next()){
                System.out.println("Role id: " + rs.getInt(1));
                System.out.println("Role name: " + rs.getString(2));
            }

        }catch (SQLException e){
            e.printStackTrace();
        }

    }
}
