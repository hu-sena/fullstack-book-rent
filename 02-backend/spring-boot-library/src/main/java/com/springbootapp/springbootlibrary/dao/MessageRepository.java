package com.springbootapp.springbootlibrary.dao;

import com.springbootapp.springbootlibrary.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

}
