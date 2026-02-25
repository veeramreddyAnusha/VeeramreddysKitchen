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

import com.veeramreddy.veeramreddys_kitchen.Dto.Admin;
import com.veeramreddy.veeramreddys_kitchen.Dto.App_User;
import com.veeramreddy.veeramreddys_kitchen.Service.AdminService;
import com.veeramreddy.veeramreddys_kitchen.Util.ResponseStructure;

@RestController
@CrossOrigin(origins = "*",methods = {RequestMethod.POST, RequestMethod.GET,RequestMethod.DELETE,RequestMethod.PUT})
public class AdminController {

	@Autowired
	private AdminService service;
	
	@PostMapping("/saveAdmin")
	public ResponseEntity<ResponseStructure<Admin>> SaveAdmin(@RequestBody Admin admin){
		return service.SaveAdmin(admin);
		
	}
	
//	--------------------------------------------------------------------------------------
	@DeleteMapping("/deleteAdmin")
	public ResponseEntity<ResponseStructure<Admin>> DeleteAdmin(@RequestParam long adminId){
		return service.DeleteAdmin(adminId);
		
	}
	
	
//	--------------------------------------------------------------------------------------------
	
	@GetMapping("/FindAdminById")
	public ResponseEntity<ResponseStructure<Admin>> getUserById(@RequestParam long adminId){
		return service.getAdminById(adminId);
		
	}
	
//	-----------------------------------------------------------------------------------------
	
	@GetMapping("/AdminLogin")
	public ResponseEntity<ResponseStructure<Admin>> AdminLogin(@RequestParam String email,@RequestParam String password){
		return service.AdminLogin(email, password);
		
	}
	
//	------------------------------------------------------------------------------------------------------
	@PutMapping("/AdminUpdate")
	
	public ResponseEntity<ResponseStructure<Admin>> AdminUpdate(@RequestBody Admin admin){
		return service.AdminUpdate(admin);
		
	}
	
//	--------------------------------------------------------------------------------------------------------
	@GetMapping("/FindAllAdmins")
	public ResponseEntity<ResponseStructure<List<Admin>>> getAllAdmins(){
		return service.getAllAdmins() ;
		
	}
	
}
