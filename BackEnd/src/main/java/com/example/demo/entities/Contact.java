package com.example.demo.entities;


import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Contact {
	@Id
	@GeneratedValue (strategy = GenerationType.AUTO)
	private Long id;
	private String nom;
	private String adresse_mail;
	private String sujet;
	private String message;
	private LocalDateTime heure_message;

}
