package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.entities.Rdv;


public interface RdvService {
	
	Rdv createRdv (Rdv rdv);
	
	List<Rdv> getAllRdv();

	Optional<Rdv> getRdvById(Long id);
	
	Optional<Rdv> getRdvByMail(String mail);
	
	Optional<Rdv> getRdvByTelephone(Long telephone);
	
	public void deleteRdvById(Long id);
	
	public void deleteRdvByTelephone(Long telephone);
	
	public void deleteRdvByMail(String mail);
	
	

}
