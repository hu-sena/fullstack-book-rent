package com.springbootapp.springbootlibrary.dao;

import com.springbootapp.springbootlibrary.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface BookRepository extends JpaRepository <Book, Long> {

//    Page: hold paginated data, Pageable: specify pagination options
    Page<Book> findByTitleContaining(@RequestParam("title") String title, Pageable paginateOptions);
    Page<Book> findByCategory(@RequestParam("category") String title, Pageable paginateOptions);

//      provided by Spring Data JPA -- detect from naming convention to query database
//        "search": {
//            "href": "http://localhost:8080/api/books/search"
//        }
}
