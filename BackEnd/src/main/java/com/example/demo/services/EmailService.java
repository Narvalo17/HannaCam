package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Rdv;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String recipientEmail;

    public void sendRdvNotification(Rdv rdv) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(recipientEmail);
            message.setSubject("Nouveau rendez-vous - " + rdv.getNom() + " " + rdv.getPrenom());
            
            String body = String.format(
                "Bonjour Hanna,\n\n" +
                "Un nouveau rendez-vous a été pris :\n\n" +
                "Nom: %s %s\n" +
                "Email: %s\n" +
                "Téléphone: %d\n" +
                "Date et heure: %s\n" +
                "Type de soin: %s\n\n" +
                "À bientôt !",
                rdv.getNom(), rdv.getPrenom(),
                rdv.getMail(),
                rdv.getTelephone(),
                rdv.getRdv().toString(),
                rdv.getType_Soin()
            );
            
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
    }
}

