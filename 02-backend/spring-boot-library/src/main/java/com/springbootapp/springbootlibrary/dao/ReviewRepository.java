package com.springbootapp.springbootlibrary.dao;

import com.springbootapp.springbootlibrary.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
