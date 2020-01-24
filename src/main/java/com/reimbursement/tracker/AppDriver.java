package com.reimbursement.tracker;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import static com.reimbursement.tracker.utils.ConnectionFactory.*;

public class AppDriver {

    public static void main (String ... args){
        try(Connection conn = getInstance().getConnection()){
            int id = 0;
            String name = "";
            String sql = "INSERT INTO roles VALUES(0, 'EMPLOYEE')";
            Statement stmt = conn.createStatement();
            int rowsAffected = stmt.executeUpdate(sql);

            if(rowsAffected !=0){
                ResultSet rs = stmt.getGeneratedKeys();
                while(rs.next()){
                    id = rs.getInt(1);
                    name = rs.getString(2);
                }
            }
            System.out.println("the new id is " + id + "and name is " + name);

        }catch (SQLException e){
            e.printStackTrace();
        }

    }
}
