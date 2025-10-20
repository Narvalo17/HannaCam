package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Rdv;
import com.example.demo.services.RdvService;

@RestController
@CrossOrigin
@RequestMapping("api/rdv")
public class RdvController {

		 @Autowired
		 private RdvService rdvService;
		 
		 @PostMapping()
		 public ResponseEntity<Rdv> createRdv (@RequestBody Rdv rdv){
			 Rdv createRdv = rdvService.createRdv(rdv);
			return ResponseEntity.status(HttpStatus.CREATED).body(createRdv);
		 }
		
		@GetMapping("/all")
		 public List<Rdv> getAllRdv(){
			 return rdvService.getAllRdv();
	 }
		@GetMapping("/{id}")
		public Optional<Rdv> getRdvById(@PathVariable Long id) {
		    return rdvService.getRdvById(id);
		            
		}
		
		@GetMapping("/mail/{mail}")
		public Optional<Rdv> getRdvByMail(@PathVariable String mail){
			return rdvService.getRdvByMail(mail);
		}
		
		@GetMapping("/telephone/{telephone}")
		public Optional <Rdv> getRdvByTelephone(@PathVariable Long telephone){
			return rdvService.getRdvByTelephone(telephone);
		}
		
		@DeleteMapping("/id/{id}")
		public void deleteRdvById(@PathVariable Long id) {
			rdvService.deleteRdvById(id);
		}
		
		@DeleteMapping("/telephone/{telephone}")
		public void deleteRdvByTelephone(@PathVariable Long telephone) {
			rdvService.deleteRdvByTelephone(telephone);
		}
		
		@DeleteMapping ("/mail/{mail}")
		public void deleteRdvByMail(@PathVariable String mail) {
			rdvService.deleteRdvByMail(mail);
		}
		
}
