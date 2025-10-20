package com.example.demo.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.Rdv;

public interface RdvRepository extends JpaRepository<Rdv, Long>{
	
    Optional<Rdv> findByMail(String mail);

    Optional<Rdv> findByTelephone(Long telephone);

	void deleteByTelephone(Long telephone);
	
	void deleteByMail(String mail);

	




}
