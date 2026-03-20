package com.veeramreddy.veeramreddys_kitchen.Repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Admin;

public interface AdminRepo extends JpaRepository<Admin, Long> {

	public Admin findByEmail(String email);
	
	 boolean existsByEmail(String email);

	    boolean existsByPhone(Long phone);
	

}
