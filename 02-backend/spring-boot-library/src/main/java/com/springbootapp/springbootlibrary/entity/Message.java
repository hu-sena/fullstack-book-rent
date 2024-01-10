package com.springbootapp.springbootlibrary.entity;

import lombok.Data;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import javax.persistence.*;

@Entity
@Table(name = "messages")
@Data
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String userEmail;

    @Column(name = "title")
    private String title;

    @Column(name = "question")
    private String question;

    @Column(name = "admin_email")
    private String adminEmail;

    @Column(name = "response")
    private String response;

    @Column(name = "closed")
    private boolean closed;

    public Message() {}

    public Message(String title, String question) {
        this.title = title;
        this.question = question;
    }


}
