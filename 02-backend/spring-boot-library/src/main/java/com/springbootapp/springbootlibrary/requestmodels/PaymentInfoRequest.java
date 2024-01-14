package com.springbootapp.springbootlibrary.requestmodels;

import lombok.Data;

// this is to send data to stripe
@Data
public class PaymentInfoRequest {

    private int amount;
    private String currency;
    private String receiptEmail;
}
