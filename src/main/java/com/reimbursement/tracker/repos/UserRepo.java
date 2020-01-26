package com.reimbursement.tracker.repos;

import com.reimbursement.tracker.models.Role;
import com.reimbursement.tracker.models.User;
import com.reimbursement.tracker.utils.ConnectionFactory;

import java.sql.*;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

public class UserRepo implements CrudRepo<User> {


    public Set<User> findUsersByRole(Role role) {

        Set<User> users = new HashSet<>();

        try (Connection conn = ConnectionFactory.getInstance().getConnection()) {

            String sql = "SELECT * FROM users WHERE roleId = ?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, role.getRoleId());

            ResultSet rs = pstmt.executeQuery();
            users = mapResultSet(rs);

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return users;

    }

    public Optional<User> findUserByUsername(String username) {

        Optional<User> user = Optional.empty();

        try (Connection conn = ConnectionFactory.getInstance().getConnection()) {

            String sql = "SELECT * FROM users WHERE username = ?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, username);

            ResultSet rs = pstmt.executeQuery();
            user = mapResultSet(rs).stream().findFirst();

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return user;

    }

    public Optional<User> findUserByCredentials(String username, String password) {

        Optional<User> user = Optional.empty();

        try (Connection conn = ConnectionFactory.getInstance().getConnection()) {

            String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, username);
            pstmt.setString(2, password);

            ResultSet rs = pstmt.executeQuery();
            user = mapResultSet(rs).stream().findFirst();

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return user;

    }

    @Override
    public void save(User newObj) {

        try (Connection conn = ConnectionFactory.getInstance().getConnection()) {

            String sql = "INSERT INTO users VALUES (0, ?, ?, ?, ?, ?, ?)";
            PreparedStatement pstmt = conn.prepareStatement(sql, new String[] {"userId"});
            pstmt.setString(1, newObj.getFname());
            pstmt.setString(2, newObj.getLname());
            pstmt.setString(3, newObj.getUsername());
            pstmt.setString(4, newObj.getPassword());
            pstmt.setString(5, newObj.getEmail());
            pstmt.setInt(6, newObj.getRoleId());

            int rowsInserted = pstmt.executeUpdate();

            if (rowsInserted != 0) {

                ResultSet rs = pstmt.getGeneratedKeys();

                while (rs.next()) {
                    newObj.setUserId(rs.getInt(1));
                }

            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public Set<User> findAll() {

        Set<User> users = new HashSet<>();

        try (Connection conn = ConnectionFactory.getInstance().getConnection();) {

            String sql = "SELECT * FROM users";
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            users = mapResultSet(rs);

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return users;

    }

    @Override
    public Optional<User> findById(int id) {

        Optional<User> user = Optional.empty();

        try (Connection conn = ConnectionFactory.getInstance().getConnection();) {

            String sql = "SELECT * FROM users WHERE userId = ?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, id);

            ResultSet rs = pstmt.executeQuery();
            user = mapResultSet(rs).stream().findFirst();

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return user;

    }

    @Override
    public boolean update(User updatedObj) {

        boolean updateSuccessful = false;

        try (Connection conn = ConnectionFactory.getInstance().getConnection();) {

            String sql = "UPDATE users SET username = ?, password = ?, fname = ?, lname = ? " +
                    "WHERE userId = ?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, updatedObj.getUsername());
            pstmt.setString(2, updatedObj.getPassword());
            pstmt.setString(3, updatedObj.getFname());
            pstmt.setString(4, updatedObj.getLname());
            pstmt.setInt(5, updatedObj.getUserId());

            int rowsUpdated = pstmt.executeUpdate();

            if (rowsUpdated > 0) {
                updateSuccessful = true;
            }


        } catch (SQLException e) {
            e.printStackTrace();
        }

        return updateSuccessful;

    }

    @Override
    public boolean deleteById(int id) {

        boolean deleteSuccessful = false;

        try (Connection conn = ConnectionFactory.getInstance().getConnection();) {

            String sql = "DELETE FROM users WHERE userId = ?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, id);

            int rowsDeleted = pstmt.executeUpdate();

            if (rowsDeleted > 0) {
                deleteSuccessful = true;
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return deleteSuccessful;

    }

    private Set<User> mapResultSet(ResultSet rs) throws SQLException {

        Set<User> users = new HashSet<>();

        while (rs.next()) {
            User temp = new User();
            temp.setUserId(rs.getInt("userId"));
            temp.setFname(rs.getString("fname"));
            temp.setLname(rs.getString("lname"));
            temp.setUsername(rs.getString("username"));
            temp.setPassword(rs.getString("password"));
            temp.setEmail(rs.getString("email"));
            temp.setRoleId(rs.getInt("roleId"));
            users.add(temp);
        }

        return users;

    }
}
