package com.springbootapp.springbootlibrary.dao;

import com.springbootapp.springbootlibrary.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface BookRepository extends JpaRepository <Book, Long> {

//    Page: hold paginated data, Pageable: specify pagination options
    Page<Book> findByTitleContaining(@RequestParam("title") String title, Pageable paginateOptions);
    Page<Book> findByCategory(@RequestParam("category") String category, Pageable paginateOptions);
    @Query("SELECT o FROM Book o WHERE o.id IN :book_ids")
    List<Book> findBooksByBookIds(@Param("book_ids") List<Long> bookId);

//      provided by Spring Data JPA -- detect from naming convention to query database
//        "search": {
//            "href": "http://localhost:8080/api/books/search"
//        }
}
