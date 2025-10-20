package com.example.demo.entities;

import java.time.OffsetDateTime;
import java.util.Calendar;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
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

public class Rdv {
	
		@Id
		@GeneratedValue(strategy = GenerationType.AUTO)
		
		private Long id;
		private String nom;
		private String prenom;
		private String mail;
		private Long telephone;
	
		@Column(nullable =false)
		private OffsetDateTime rdv;
		
		private type_soins type_Soin;
		
		public enum type_soins{
								Soins_Visage,
								Soins_Combinés,
								Cils_Sourcils,	
		}
}
