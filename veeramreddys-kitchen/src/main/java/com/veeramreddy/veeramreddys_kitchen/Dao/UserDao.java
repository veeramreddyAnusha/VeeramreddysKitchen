package com.veeramreddy.veeramreddys_kitchen.Dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.veeramreddy.veeramreddys_kitchen.Dto.App_User;
import com.veeramreddy.veeramreddys_kitchen.Repo.UserRepo;

@Repository
public class UserDao {

    @Autowired
    private UserRepo repo;

    public App_User saveUser(App_User user) {
        return repo.save(user);
    }
    
// ------------------------------------------------------------------------------------

    public App_User deleteUser(Long userId) {
        Optional<App_User> userOpt = repo.findById(userId);
        if (userOpt.isPresent()) {
            App_User user = userOpt.get();
            repo.delete(user);
            return user;
        }
        return null;
    }



// --------------------------------------------------------------------------------------------------


   public List<App_User> getAllUsers(){
	return repo.findAll();
	   
   }
   
//   ------------------------------------------------------------------------------------------------
   
   public App_User getUserById(long userId) {
	   
	   if (repo.findById((long) userId).isPresent()) {
		   App_User user=repo.findById(userId).get();
		   return user;
	   }
	   
	return null;
	   
   }
//   ------------------------------------------------------------------------------------------

public App_User getUserByEmail(String email) {
	App_User user=repo.findByEmail(email);
	if(user !=null) {
		return user;
		
	} else
	return null;
}

//   ------------------------------------------------------------------------------------------

public App_User userUpdate(App_User user) {
	App_User us=repo.findById(user.getUserId()).get();
	if(us !=null) {
		if(user.getFullName() ==null) {
			user.setFullName(us.getFullName());
		}
	}
	if(us !=null) {
		if(user.getEmail() ==null) {
			user.setEmail(us.getEmail());
		}
	}
	if(us !=null) {
		if(user.getPassword()==null) {
			user.setPassword(us.getPassword());
		}
	}
		if(us !=null) {
			if(user.getAddress()==null) {
				user.setAddress(us.getAddress());
			}
		}
			
			if(us !=null) {
				if(user.getPhone()==null) {
					user.setPhone(us.getPhone());
				}
				
		
		repo.save(user);
		return user;
		
	}
	
	return null;
}
   
//   -------------------------------------------------------------------------------------------  
}
