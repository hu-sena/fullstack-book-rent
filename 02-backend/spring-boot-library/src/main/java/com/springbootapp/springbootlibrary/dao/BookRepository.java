package com.springbootapp.springbootlibrary.dao;

import com.springbootapp.springbootlibrary.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository <Book, Long> {
}
