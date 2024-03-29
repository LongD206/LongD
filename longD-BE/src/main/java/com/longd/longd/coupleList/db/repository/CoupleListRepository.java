package com.longd.longd.coupleList.db.repository;

import com.longd.longd.coupleList.db.entity.CoupleList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoupleListRepository extends JpaRepository<CoupleList, Integer> {

    public Optional<CoupleList> findById(int id);
    public Optional<CoupleList> findByUserFirstAndUserSecond(int userA, int userB);

}
