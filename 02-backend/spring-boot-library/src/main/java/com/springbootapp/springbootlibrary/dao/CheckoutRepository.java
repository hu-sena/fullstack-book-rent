package com.springbootapp.springbootlibrary.dao;

import com.springbootapp.springbootlibrary.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {

    Checkout findByUserEmailAndBookId(String userEmail, Long bookId);

    List<Checkout> findBooksByUserEmail(String userEmail);

//    :book_id is from @Param("book_id")
    @Modifying
    @Query("DELETE FROM Checkout WHERE book_id IN :book_id")
    void deleteAllByBookId(@Param("book_id") Long bookId);
}
