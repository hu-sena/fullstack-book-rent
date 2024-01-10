package com.springbootapp.springbootlibrary.service;

import com.springbootapp.springbootlibrary.dao.MessageRepository;
import com.springbootapp.springbootlibrary.entity.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MessageService {

    private MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void postMessage(Message messageRequest, String userEmail) {
            Message message = new Message(messageRequest.getTitle(), messageRequest.getQuestion());
            message.setUserEmail(userEmail);
            messageRepository.save(message);
    }
}
