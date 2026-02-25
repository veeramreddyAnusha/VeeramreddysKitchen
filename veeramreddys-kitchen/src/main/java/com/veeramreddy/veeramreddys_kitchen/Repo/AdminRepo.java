package com.veeramreddy.veeramreddys_kitchen.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.veeramreddy.veeramreddys_kitchen.Dto.Admin;
import com.veeramreddy.veeramreddys_kitchen.Dto.App_User;
import com.veeramreddy.veeramreddys_kitchen.Dto.FoodItem;

public interface AdminRepo extends JpaRepository<Admin, Long> {

	public Admin findByEmail(String email);
	
	 boolean existsByEmail(String email);

	    boolean existsByPhone(Long phone);
	

}
