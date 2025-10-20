package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Contact;
import com.example.demo.services.ContactService;

@RestController
@CrossOrigin
@RequestMapping("api/contact")
public class ContactConroller {
	
	@Autowired 
	private ContactService contactService;
	
	@PostMapping("/CreateContact")
	public Contact addContact(@RequestBody Contact contact) {
		return contactService.addContact(contact);
	}

}
