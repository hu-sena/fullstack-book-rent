package com.springbootapp.springbootlibrary.dao;

import com.springbootapp.springbootlibrary.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

public interface MessageRepository extends JpaRepository<Message, Long> {


    Page<Message> findByUserEmail(@RequestParam("user_email") String userEmail, Pageable paginateOptions);

//    admin: only see unanswered questions for all users
    Page<Message> findByClosed(@RequestParam("closed") boolean closed, Pageable paginateOptions);
}
