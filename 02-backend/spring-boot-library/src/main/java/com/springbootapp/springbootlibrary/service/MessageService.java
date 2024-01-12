package com.springbootapp.springbootlibrary.service;

import com.springbootapp.springbootlibrary.dao.MessageRepository;
import com.springbootapp.springbootlibrary.entity.Message;
import com.springbootapp.springbootlibrary.requestmodels.AdminQuestionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class MessageService {

    private MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

//    user create a message
    public void postMessage(Message messageRequest, String userEmail) {
            Message message = new Message(messageRequest.getTitle(), messageRequest.getQuestion());
            message.setUserEmail(userEmail);
            messageRepository.save(message);
    }

//    admin update the message
    public void putMessage(AdminQuestionRequest adminQuestionRequest, String userEmail) throws Exception {
        Optional<Message> message = messageRepository.findById(adminQuestionRequest.getId());

        if (!message.isPresent()) {
           throw new Exception("Message not found");
        }

        message.get().setAdminEmail(userEmail);
        message.get().setResponse(adminQuestionRequest.getResponse());
        message.get().setClosed(true);

        messageRepository.save(message.get());
    }
}
