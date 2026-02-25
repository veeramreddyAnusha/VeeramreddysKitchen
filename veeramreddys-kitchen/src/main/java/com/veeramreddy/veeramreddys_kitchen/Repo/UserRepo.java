package com.veeramreddy.veeramreddys_kitchen.Repo;




import org.springframework.data.jpa.repository.JpaRepository;
import com.veeramreddy.veeramreddys_kitchen.Dto.App_User;

public interface UserRepo extends JpaRepository<App_User, Long> {

	public App_User findByEmail(String email);
	
	 boolean existsByEmail(String email);

	    boolean existsByPhone(Long phone);
    
}
