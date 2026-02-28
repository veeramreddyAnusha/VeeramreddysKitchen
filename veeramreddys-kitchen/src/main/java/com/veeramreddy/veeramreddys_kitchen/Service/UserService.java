package com.veeramreddy.veeramreddys_kitchen.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.veeramreddy.veeramreddys_kitchen.Dao.UserDao;
import com.veeramreddy.veeramreddys_kitchen.Dto.App_User;
import com.veeramreddy.veeramreddys_kitchen.Exception.EmailNotFound;
import com.veeramreddy.veeramreddys_kitchen.Exception.NoSuchElementFoundException;
import com.veeramreddy.veeramreddys_kitchen.Exception.PaswordIncorrect;
import com.veeramreddy.veeramreddys_kitchen.Repo.UserRepo;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@Service
public class UserService {

    @Autowired
    private UserDao dao;
    
    @Autowired
    private UserRepo repo;

    public ResponseEntity<ResponseStructure<App_User>> saveUser(App_User user) {
    	
    	if (repo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (repo.existsByPhone(user.getPhone())) {
            throw new RuntimeException("Phone number already exists");
        }
    	
        App_User savedUser = dao.saveUser(user);

        ResponseStructure<App_User> structure = new ResponseStructure<>();
        structure.setStatus(HttpStatus.CREATED.value());
        structure.setMessage("User created successfully");
        structure.setData(savedUser);

        return new ResponseEntity<>(structure, HttpStatus.CREATED);
    }
    
//    ---------------------------------------------------------------------------------------------
    
    public ResponseEntity<ResponseStructure<App_User>> deleteUser(long userId) {

        Optional<App_User> optional = repo.findById(userId);

        if (optional.isPresent()) {

            repo.deleteById(userId);

            ResponseStructure<App_User> structure = new ResponseStructure<>();
            structure.setStatus(200);
            structure.setMessage("User deleted successfully");
            structure.setData(null);

            return new ResponseEntity<>(structure, HttpStatus.OK);

        } else {

            ResponseStructure<App_User> structure = new ResponseStructure<>();
            structure.setStatus(404);
            structure.setMessage("User id not found");
            structure.setData(null);

            return new ResponseEntity<>(structure, HttpStatus.NOT_FOUND);
        }
    }
    
    
    
    
    
    
    
    
//    -----------------------------------------------------------------------------------------------

	public ResponseEntity<ResponseStructure<List<App_User>>> getAllUsers() {
		
		ResponseStructure<List<App_User>> structure=new ResponseStructure<List<App_User>>();
		
		List<App_User> user=dao.getAllUsers();
		if(user !=null) {
			structure.setData(dao.getAllUsers());
			structure.setStatus(HttpStatus.FOUND.value());
			structure.setMessage("All users are getting");
			
			
			return new ResponseEntity<ResponseStructure<List<App_User>>>(structure,HttpStatus.FOUND);
		}
		else throw new NoSuchElementFoundException("No data is there in the database");
		
	}

//	--------------------------------------------------------------------------------------------------
	
	public ResponseEntity<ResponseStructure<App_User>> getUserById(long userId) {
		App_User user=dao.getUserById(userId);
		ResponseStructure<App_User> structure=new ResponseStructure<App_User>();
		if(user !=null) {
			structure.setData(user);
			structure.setStatus(HttpStatus.FOUND.value());
			structure.setMessage("user found");
			
			return new ResponseEntity<ResponseStructure<App_User>>(structure,HttpStatus.FOUND);
			}
		else {
			throw new NoSuchElementFoundException("no User found for the particular id " +userId);
		}
	}
	
//	------------------------------------------------------------------------------------------------------
	
	public ResponseEntity<ResponseStructure<App_User>> userLogin(String email,String password){
		App_User user=dao.getUserByEmail(email);
		if(user !=null) {
			if(user.getPassword().equals(password)) {
				ResponseStructure<App_User> structure=new ResponseStructure<App_User>();
				structure.setData(user);
				structure.setStatus(HttpStatus.FOUND.value());
				structure.setMessage("Successfully Login Completed");
				
				return new ResponseEntity<ResponseStructure<App_User>>(structure,HttpStatus.FOUND);
			}
			else {
				throw new PaswordIncorrect();
			}
			
		}else {
			throw new EmailNotFound();
		}
		
		
	}

//	--------------------------------------------------------------------------------------------

	public ResponseEntity<ResponseStructure<App_User>> updateUser(App_User user) {

	    Optional<App_User> optional = repo.findById(user.getUserId());

	    if (optional.isPresent()) {

	        App_User existingUser = optional.get();

	        existingUser.setFullName(user.getFullName());
	        existingUser.setEmail(user.getEmail());
	        existingUser.setPhone(user.getPhone());
	        existingUser.setAddress(user.getAddress());

	        App_User updatedUser = repo.save(existingUser);

	        ResponseStructure<App_User> structure = new ResponseStructure<>();
	        structure.setStatus(200);
	        structure.setMessage("User updated successfully");
	        structure.setData(updatedUser);

	        return new ResponseEntity<>(structure, HttpStatus.OK);
	    }

	    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	
	
	
	
	
}
