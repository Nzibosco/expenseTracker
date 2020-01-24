package com.reimbursement.tracker.repos;

import java.util.Optional;
import java.util.Set;

public interface CrudRepo<T> {

    void save(T newObj);
    Set<T> findAll();
    Optional<T> findById(int id);
    boolean update(T updatedObj);
    boolean deleteById(int id);
}
