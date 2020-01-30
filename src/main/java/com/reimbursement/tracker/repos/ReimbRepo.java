package com.reimbursement.tracker.repos;

import com.reimbursement.tracker.models.Reimbursement;
import com.reimbursement.tracker.utils.ConnectionFactory;

import java.sql.*;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

public class ReimbRepo implements CrudRepo <Reimbursement> {

    @Override
    public void save(Reimbursement newObj) {

        try (Connection conn = ConnectionFactory.getInstance().getConnection()) {

            String sql = "{CALL insert_reimb (?, ?, ?, ?)}";

            CallableStatement cstmt = conn.prepareCall(sql);
            cstmt.setDouble(1, newObj.getAmount());
            cstmt.setString(2, newObj.getDescription());
            cstmt.setInt(3, newObj.getAuthor());
            cstmt.setInt(4, newObj.getTypeId());

            int rowsInserted = cstmt.executeUpdate();

            if (rowsInserted != 0) {
                System.out.println("Reimbursement requested saved!");
            }

        } catch (SQLException e) {
            //e.printStackTrace();
            System.err.println("QUERRY DENIED. TRY AGAIN");

        }
    }

    @Override
    public Set<Reimbursement> findAll() {

        Set<Reimbursement> r = new HashSet<>();

        try (Connection conn = ConnectionFactory.getInstance().getConnection()) {

            String sql = "SELECT * FROM reimbursements";
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            r = mapResultSet(rs);

        } catch (SQLException e) {
            //e.printStackTrace();
            System.err.println("REQUEST DENIED. TRY AGAIN");
        }
        return r;
    }

    @Override
    public Optional<Reimbursement> findById(int id) {
        return Optional.empty();
    }

    @Override
    public boolean update(Reimbursement updatedObj) {
        return false;
    }

    @Override
    public boolean deleteById(int id) {
        return false;
    }

    public boolean processRequest(int reimbId, String decision, int resolver){

        boolean updated = false;

        try(Connection conn = ConnectionFactory.getInstance().getConnection()) {

            String sql = "{CALL process_reimb(?, ?, ?)}";

            CallableStatement cstmt = conn.prepareCall(sql);
            cstmt.setInt(1, reimbId);
            cstmt.setString(2, decision);
            cstmt.setInt(3, resolver);

            int rowsAffected = cstmt.executeUpdate();

            if(rowsAffected != 0){
                updated = true;
                ResultSet rs = cstmt.getGeneratedKeys();
            }

        } catch (SQLException e) {
            //e.printStackTrace();
            System.err.println("PROCESS DENIED. TRY AGAIN");
        }
        return updated;
    }

    private Set<Reimbursement> mapResultSet(ResultSet rs) throws SQLException {

        Set<Reimbursement> r = new HashSet<>();

        while (rs.next()) {
            Reimbursement temp = new Reimbursement();
            temp.setReimbId(rs.getInt(1));
            temp.setAmount(rs.getDouble(2));
            temp.setSubmittedOn(rs.getString(3));
            temp.setResolvedOn(rs.getString(4));
            temp.setDescription(rs.getString(5));
            temp.setAuthor(rs.getInt(7));
            temp.setResolver(rs.getInt(8));
            temp.setStatusId(rs.getInt(9));
            temp.setTypeId(rs.getInt(10));
            r.add(temp);
        }

        return r;

    }
}
