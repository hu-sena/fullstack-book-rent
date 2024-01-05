package com.springbootapp.springbootlibrary.controller;

import com.springbootapp.springbootlibrary.requestmodels.ReviewRequest;
import com.springbootapp.springbootlibrary.service.ReviewService;
import com.springbootapp.springbootlibrary.util.ExtractJWT;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private ReviewService reviewService;

    public ReviewController (ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/secure")
    public void postReview(@RequestHeader(value = "Authorization") String token,
                           @RequestBody ReviewRequest reviewRequest) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");

//        when failed to retrieve email from JWT extraction
        if (userEmail == null) {
            throw new Exception("User email is missing");
        }

        reviewService.postReview(userEmail, reviewRequest);
    }
}
