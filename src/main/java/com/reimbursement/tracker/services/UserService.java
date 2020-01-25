package com.reimbursement.tracker.services;

import com.reimbursement.tracker.exceptions.AuthenticationException;
import com.reimbursement.tracker.exceptions.InvalidRequestException;
import com.reimbursement.tracker.exceptions.ResourceNotFoundException;
import com.reimbursement.tracker.exceptions.ResourcePersistenceException;
import com.reimbursement.tracker.models.Role;
import com.reimbursement.tracker.models.User;
import com.reimbursement.tracker.repos.UserRepo;

import java.util.*;
import java.util.stream.Collectors;

public class UserService {

    private UserRepo userRepo;

    public UserService(UserRepo repo) {
        super();
        this.userRepo = repo;
    }

    public User getUserById(int id) {
        return userRepo.findById(id).orElseThrow(ResourceNotFoundException::new);
    }

    public void register(User newUser) {

        if (!isUserValid(newUser)) throw new InvalidRequestException();

        if (userRepo.findUserByUsername(newUser.getUsername()).isPresent()) {
            throw new ResourcePersistenceException("Username is already in use!");
        }

        userRepo.save(newUser);

    }

    public Set<User> getAllUsers() {

        Set<User> users;

        users = userRepo.findAll();

        if (users.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return users;

    }

    public Set<User> getUsersByRole(Role role) {

        Set<User> users;

        if (role == null) {
            throw new InvalidRequestException();
        }

        users = userRepo.findUsersByRole(role);

        if (users.isEmpty()) {
            throw new ResourceNotFoundException();
        }

        return users;

    }

    public User getUserByUsername(String username) {

        if (username == null || username.trim().equals("")) {
            throw new InvalidRequestException();
        }

        return userRepo.findUserByUsername(username).orElseThrow(ResourceNotFoundException::new);


    }

//    public SortedSet<User> sortUsers(String sortCriterion, Set<User> usersForSorting) {
//
//        SortedSet<User> users = new TreeSet<>(usersForSorting);
//
//        switch (sortCriterion.toLowerCase()) {
//            case "username":
//                users = users.stream()
//                        .collect(Collectors.toCollection(() -> {
//                            return new TreeSet<>(Comparator.comparing(User::getUsername, String::compareTo));
//                        }));
//                break;
//            case "first":
//                users = users.stream()
//                        .collect(Collectors.toCollection(() -> {
//                            return new TreeSet<>(Comparator.comparing(User::getFname, String::compareTo));
//                        }));
//                break;
//            case "last":
//                users = users.stream()
//                        .collect(Collectors.toCollection(() -> {
//                            return new TreeSet<>(Comparator.comparing(User::getLname, String::compareTo));
//                        }));
//                break;
//            case "role":
//                users = users.stream()
//                        .collect(Collectors.toCollection(() -> {
//                            return new TreeSet<>(Comparator.comparing(User::getRoleId, Enum::compareTo));
//                        }));
//                break;
//            default:
//                throw new InvalidRequestException();
//
//        }
//
//        return users;
//
//    }

    public User authenticate(String username, String password) {

        if (username == null || username.trim().equals("") || password == null || password.trim().equals("")) {
            throw new InvalidRequestException();
        }

        return userRepo.findUserByCredentials(username, password).orElseThrow(AuthenticationException::new);

    }

    public Boolean updateProfile(User updatedUser) {

        Boolean profileUpdated;

        if (!isUserValid(updatedUser)) {
            throw new InvalidRequestException();
        }

        Optional<User> persistedUser = userRepo.findUserByUsername(updatedUser.getUsername());
        if (persistedUser.isPresent() && persistedUser.get().getUserId() != updatedUser.getUserId()) {
            throw new ResourcePersistenceException("That username is taken by someone else!");
        }

        profileUpdated = userRepo.update(updatedUser);

        return profileUpdated;

    }

    public Boolean isUserValid(User user) {
        if (user == null) return false;
        if (user.getFname() == null || user.getFname().trim().equals("")) return false;
        if (user.getLname() == null || user.getLname().trim().equals("")) return false;
        if (user.getUsername() == null || user.getUsername().trim().equals("")) return false;
        if (user.getPassword() == null || user.getPassword().trim().equals("")) return false;
        return true;
    }

}
