package com.veeramreddy.veeramreddys_kitchen.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.veeramreddy.veeramreddys_kitchen.Dto.App_User;
import com.veeramreddy.veeramreddys_kitchen.Service.UserService;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@RestController
@CrossOrigin(origins = "*",methods = {RequestMethod.POST, RequestMethod.GET,RequestMethod.DELETE,RequestMethod.PUT})

public class UserController {

	@Autowired
	private UserService service;
	
	@PostMapping("/saveUser")
	public ResponseEntity<ResponseStructure<App_User>> saveUser(@RequestBody App_User user) {
		return service.saveUser(user);
		
	}
	
//	------------------------------------------------------------------------------------------------
	
	@DeleteMapping("/deleteUser")
	public ResponseEntity<ResponseStructure<App_User>> deleteCustomer(@RequestParam long userId){
		return service.deleteUser(userId);
		
	}
	
//	-------------------------------------------------------------------------------------------------
	
	@GetMapping("/FindAllUsers")
	public ResponseEntity<ResponseStructure<List<App_User>>> getAllUsers(){
		return service.getAllUsers() ;
		
	}
	
//	--------------------------------------------------------------------------------------------------
	
	@GetMapping("/FindUserById")
	public ResponseEntity<ResponseStructure<App_User>> getUserById(@RequestParam long userId){
		return service.getUserById(userId);
		
	}
//	-----------------------------------------------------------------------------------------------------
	@GetMapping("/UserLogin")
	public ResponseEntity<ResponseStructure<App_User>> userLogin(@RequestParam String email,@RequestParam String password){
		return service.userLogin(email, password);
		
	}
	
//	------------------------------------------------------------------------------------------------------
	@PutMapping("/UserUpdate")
	
	public ResponseEntity<ResponseStructure<App_User>> userUpdate(@RequestBody App_User user){
		return service.updateUser(user);
		
	}
}
