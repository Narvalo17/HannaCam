package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Rdv;
import com.example.demo.repositories.RdvRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class RdvServiceImpl implements RdvService {
	
	@Autowired 
	private RdvRepository rdvRepository;
	
	@Autowired
	private EmailService emailService;
	
	public Rdv createRdv(Rdv rdv) {
		Rdv savedRdv = rdvRepository.save(rdv);
		
		// Envoyer un email de notification à Hanna
		try {
			emailService.sendRdvNotification(savedRdv);
		} catch (Exception e) {
			// Log l'erreur mais ne pas bloquer la création du RDV
			System.err.println("Erreur lors de l'envoi de l'email pour le RDV: " + e.getMessage());
		}
		
		return savedRdv;
	}
	
	@Override
	public List<Rdv> getAllRdv() {
		return rdvRepository.findAll();
	}
	
	@Override
	public Optional<Rdv> getRdvById(Long id) {
	    return rdvRepository.findById(id);
	}
	
	@Override
	public Optional<Rdv> getRdvByMail (String mail){
		return rdvRepository.findByMail(mail);
	}
	
	@Override
	public Optional<Rdv> getRdvByTelephone(Long telephone){
		return rdvRepository.findByTelephone(telephone);
	}
	
	@Override
	public void deleteRdvById(Long id) {
		rdvRepository.deleteById(id);
	}
	
	@Override
	public void deleteRdvByTelephone(Long telephone) {
		rdvRepository.deleteByTelephone(telephone);
	}
	@Override
	public void deleteRdvByMail(String mail) {
		rdvRepository.deleteByMail(mail);
	}
	
}
