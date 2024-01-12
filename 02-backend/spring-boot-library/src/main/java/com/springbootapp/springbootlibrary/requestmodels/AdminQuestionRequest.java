package com.springbootapp.springbootlibrary.requestmodels;

import lombok.Data;

@Data
public class AdminQuestionRequest {

//    to send admin's responses to database

    private Long id;
    private String response;
}
